# Docker Build Script for UIMP (PowerShell)
# Builds and optionally pushes Docker images for frontend and backend

param(
    [switch]$Push,
    [string]$Tag = "local",
    [ValidateSet("frontend", "backend", "all")]
    [string]$Service = "all",
    [switch]$NoCache,
    [string[]]$BuildArgs = @(),
    [switch]$Help
)

# Configuration
$REGISTRY = "ghcr.io"
$REPOSITORY = "your-org/uimp"
$PLATFORMS = "linux/amd64,linux/arm64"

# Colors for output
$RED = "Red"
$GREEN = "Green"
$YELLOW = "Yellow"
$BLUE = "Blue"

# Help function
function Show-Help {
    Write-Host "Usage: .\docker-build.ps1 [OPTIONS]" -ForegroundColor $BLUE
    Write-Host ""
    Write-Host "Options:" -ForegroundColor $BLUE
    Write-Host "  -Help                   Show this help message"
    Write-Host "  -Push                   Push images to registry"
    Write-Host "  -Tag <TAG>              Tag for the images (default: local)"
    Write-Host "  -Service <SERVICE>      Build specific service (frontend|backend|all)"
    Write-Host "  -NoCache                Disable build cache"
    Write-Host "  -BuildArgs <ARG=VALUE>  Pass build arguments"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $BLUE
    Write-Host "  .\docker-build.ps1                          # Build all services locally"
    Write-Host "  .\docker-build.ps1 -Service frontend        # Build only frontend"
    Write-Host "  .\docker-build.ps1 -Push -Tag v1.0.0        # Build and push with tag v1.0.0"
    Write-Host "  .\docker-build.ps1 -BuildArgs 'NODE_ENV=production'"
}

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Color = $BLUE)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Log $Message $GREEN
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message $YELLOW
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message $RED
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        return $false
    }
}

# Function to setup Docker Buildx
function Initialize-Buildx {
    Write-Log "Setting up Docker Buildx..."
    
    # Check if builder exists
    $builderExists = docker buildx inspect uimp-builder 2>$null
    if (-not $builderExists) {
        docker buildx create --name uimp-builder --use
    }
    else {
        docker buildx use uimp-builder
    }
    
    # Bootstrap the builder
    docker buildx inspect --bootstrap
}

# Function to build a service
function Build-Service {
    param([string]$ServiceName)
    
    $context = ""
    $dockerfile = ""
    
    switch ($ServiceName) {
        "frontend" {
            $context = "./client"
            $dockerfile = "./client/Dockerfile"
        }
        "backend" {
            $context = "./server"
            $dockerfile = "./server/Dockerfile"
        }
        default {
            Write-Error "Unknown service: $ServiceName"
            return $false
        }
    }
    
    $imageName = "$REGISTRY/$REPOSITORY/${ServiceName}:$Tag"
    
    Write-Log "Building $ServiceName..."
    Write-Log "Context: $context"
    Write-Log "Dockerfile: $dockerfile"
    Write-Log "Image: $imageName"
    
    # Build command components
    $buildCmd = @("docker", "buildx", "build")
    
    # Add cache options
    if (-not $NoCache) {
        $cacheDir = "$env:TEMP\.buildx-cache-$ServiceName"
        $buildCmd += "--cache-from=type=local,src=$cacheDir"
        $buildCmd += "--cache-to=type=local,dest=$cacheDir,mode=max"
    }
    else {
        $buildCmd += "--no-cache"
    }
    
    # Add build arguments
    foreach ($arg in $BuildArgs) {
        $buildCmd += "--build-arg"
        $buildCmd += $arg
    }
    
    # Add platforms for multi-arch builds
    if ($Push) {
        $buildCmd += "--platform"
        $buildCmd += $PLATFORMS
    }
    
    # Add push or load option
    if ($Push) {
        $buildCmd += "--push"
    }
    else {
        $buildCmd += "--load"
    }
    
    # Add final parameters
    $buildCmd += "-f"
    $buildCmd += $dockerfile
    $buildCmd += "-t"
    $buildCmd += $imageName
    $buildCmd += $context
    
    Write-Log "Executing: $($buildCmd -join ' ')"
    
    try {
        & $buildCmd[0] $buildCmd[1..($buildCmd.Length-1)]
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Successfully built $ServiceName"
            
            # Run security scan if not pushing
            if (-not $Push) {
                Write-Log "Running security scan for $ServiceName..."
                if (Get-Command trivy -ErrorAction SilentlyContinue) {
                    trivy image --exit-code 0 --severity HIGH,CRITICAL $imageName
                }
                else {
                    Write-Warning "Trivy not found. Skipping security scan."
                }
            }
            
            return $true
        }
        else {
            Write-Error "Failed to build $ServiceName"
            return $false
        }
    }
    catch {
        Write-Error "Failed to build $ServiceName: $_"
        return $false
    }
}

# Function to login to registry
function Connect-Registry {
    if ($Push) {
        Write-Log "Logging in to registry..."
        
        if ($env:GITHUB_TOKEN) {
            $env:GITHUB_TOKEN | docker login $REGISTRY -u $env:GITHUB_ACTOR --password-stdin
        }
        elseif ($env:DOCKER_PASSWORD) {
            $env:DOCKER_PASSWORD | docker login $REGISTRY -u $env:DOCKER_USERNAME --password-stdin
        }
        else {
            Write-Warning "No registry credentials found. You may need to login manually."
            Write-Log "Run: docker login $REGISTRY"
        }
    }
}

# Function to cleanup
function Invoke-Cleanup {
    Write-Log "Cleaning up..."
    
    # Remove dangling images
    try {
        docker image prune -f | Out-Null
    }
    catch {
        # Ignore errors
    }
    
    # Clean build cache if it gets too large
    $cacheDir = "$env:TEMP\.buildx-cache-*"
    $cacheSize = (Get-ChildItem $cacheDir -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    if ($cacheSize -gt 1GB) {
        Write-Log "Cleaning build cache..."
        Remove-Item $cacheDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Main execution
function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    # Determine services to build
    $services = if ($Service -eq "all") { @("frontend", "backend") } else { @($Service) }
    
    Write-Log "Starting Docker build process..."
    Write-Log "Services: $($services -join ', ')"
    Write-Log "Tag: $Tag"
    Write-Log "Push: $Push"
    
    # Pre-flight checks
    if (-not (Test-Docker)) {
        return
    }
    
    Initialize-Buildx
    Connect-Registry
    
    # Build services
    $failedServices = @()
    foreach ($svc in $services) {
        if (-not (Build-Service $svc)) {
            $failedServices += $svc
        }
    }
    
    # Cleanup
    Invoke-Cleanup
    
    # Report results
    if ($failedServices.Count -eq 0) {
        Write-Success "All services built successfully!"
        
        if ($Push) {
            Write-Success "Images pushed to registry: $REGISTRY/$REPOSITORY"
        }
        else {
            Write-Success "Images available locally:"
            foreach ($svc in $services) {
                Write-Host "  - $REGISTRY/$REPOSITORY/${svc}:$Tag"
            }
        }
    }
    else {
        Write-Error "Failed to build services: $($failedServices -join ', ')"
        exit 1
    }
}

# Run main function
Main