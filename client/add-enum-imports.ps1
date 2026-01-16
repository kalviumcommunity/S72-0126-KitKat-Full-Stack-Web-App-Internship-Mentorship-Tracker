# PowerShell script to add enum imports to files that use them

$files = Get-ChildItem -Path "src" -Include "*.ts","*.tsx" -Recurse

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $content = $lines -join "`n"
    $modified = $false
    
    # Check if file uses enums but doesn't import them
    $usesEnums = $content -match "UserRole\.|ApplicationStatus\.|ApplicationPlatform\.|FeedbackTag\.|FeedbackPriority\.|NotificationType\."
    $hasImport = $content -match "import.*from '@/lib/types'"
    
    if ($usesEnums -and -not $hasImport) {
        # Find the last import statement
        $lastImportIndex = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import ") {
                $lastImportIndex = $i
            }
        }
        
        if ($lastImportIndex -ge 0) {
            # Insert the enum import after the last import
            $newLines = @()
            for ($i = 0; $i -le $lastImportIndex; $i++) {
                $newLines += $lines[$i]
            }
            $newLines += "import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';"
            for ($i = $lastImportIndex + 1; $i -lt $lines.Count; $i++) {
                $newLines += $lines[$i]
            }
            
            Set-Content -Path $file.FullName -Value ($newLines -join "`n")
            Write-Host "Added imports to: $($file.FullName)"
            $modified = $true
        }
    }
}

Write-Host "Import additions complete!"
