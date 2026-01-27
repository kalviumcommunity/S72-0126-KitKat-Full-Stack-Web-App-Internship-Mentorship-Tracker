# PowerShell script to fix UserRole imports to use Prisma's generated types
# This replaces all imports from "../../types/roles" with "@prisma/client"

$files = @(
    "tests/utils/test-helpers.ts",
    "tests/unit/utils.test.ts",
    "tests/unit/middleware.test.ts",
    "tests/unit/feedback.service.test.ts",
    "tests/unit/auth.service.test.ts",
    "tests/unit/application.service.test.ts",
    "tests/integration/feedback.integration.test.ts",
    "tests/integration/auth.integration.test.ts",
    "tests/integration/application.integration.test.ts",
    "tests/application.test.ts",
    "src/lib/jwt.ts",
    "src/middlewares/application-security.middleware.ts",
    "src/api/users/user.service.ts",
    "src/api/feedback/feedback.service.ts",
    "src/api/feedback/feedback.routes.ts",
    "src/api/feedback/feedback.controller.ts",
    "src/api/auth/auth.schema.ts",
    "src/api/applications/application.service.optimized.ts",
    "src/api/applications/application.service.ts",
    "src/api/applications/application.controller.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "Fixing imports in $file"
        $content = Get-Content $fullPath -Raw
        
        # Replace the import statement
        $content = $content -replace 'import \{ UserRole \} from [''"]\.\.\/\.\.\/types\/roles[''"];?', 'import { UserRole } from "@prisma/client";'
        $content = $content -replace 'import \{ UserRole \} from [''"]\.\.\/types\/roles[''"];?', 'import { UserRole } from "@prisma/client";'
        $content = $content -replace 'import \{ UserRole \} from [''"]\.\.\/\.\.\/src\/types\/roles[''"];?', 'import { UserRole } from "@prisma/client";'
        
        Set-Content $fullPath $content -NoNewline
        Write-Host "Fixed $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All UserRole imports have been updated to use Prisma's generated types"