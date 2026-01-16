# PowerShell script to fix enum string literals across all TypeScript files

$files = Get-ChildItem -Path "src" -Include "*.ts","*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Fix UserRole enums
    if ($content -match "'STUDENT'|'MENTOR'|'ADMIN'") {
        $content = $content -replace "role:\s*'STUDENT'", "role: UserRole.STUDENT"
        $content = $content -replace "role:\s*'MENTOR'", "role: UserRole.MENTOR"
        $content = $content -replace "role:\s*'ADMIN'", "role: UserRole.ADMIN"
        $content = $content -replace '\["STUDENT"\]', '[UserRole.STUDENT]'
        $content = $content -replace '\["MENTOR"\]', '[UserRole.MENTOR]'
        $content = $content -replace '\["ADMIN"\]', '[UserRole.ADMIN]'
        $modified = $true
    }
    
    # Fix ApplicationStatus enums
    if ($content -match "'DRAFT'|'APPLIED'|'SHORTLISTED'|'INTERVIEW'|'OFFER'|'REJECTED'") {
        $content = $content -replace "status:\s*'DRAFT'", "status: ApplicationStatus.DRAFT"
        $content = $content -replace "status:\s*'APPLIED'", "status: ApplicationStatus.APPLIED"
        $content = $content -replace "status:\s*'SHORTLISTED'", "status: ApplicationStatus.SHORTLISTED"
        $content = $content -replace "status:\s*'INTERVIEW'", "status: ApplicationStatus.INTERVIEW"
        $content = $content -replace "status:\s*'OFFER'", "status: ApplicationStatus.OFFER"
        $content = $content -replace "status:\s*'REJECTED'", "status: ApplicationStatus.REJECTED"
        $content = $content -replace '"INTERVIEW"', 'ApplicationStatus.INTERVIEW'
        $content = $content -replace '"DRAFT"', 'ApplicationStatus.DRAFT'
        $content = $content -replace '"APPLIED"', 'ApplicationStatus.APPLIED'
        $content = $content -replace '"SHORTLISTED"', 'ApplicationStatus.SHORTLISTED'
        $content = $content -replace '"OFFER"', 'ApplicationStatus.OFFER'
        $content = $content -replace '"REJECTED"', 'ApplicationStatus.REJECTED'
        $modified = $true
    }
    
    # Fix ApplicationPlatform enums
    if ($content -match "'LINKEDIN'|'COMPANY_WEBSITE'|'REFERRAL'|'JOB_BOARD'|'CAREER_FAIR'|'OTHER'") {
        $content = $content -replace "platform:\s*'LINKEDIN'", "platform: ApplicationPlatform.LINKEDIN"
        $content = $content -replace "platform:\s*'COMPANY_WEBSITE'", "platform: ApplicationPlatform.COMPANY_WEBSITE"
        $content = $content -replace "platform:\s*'REFERRAL'", "platform: ApplicationPlatform.REFERRAL"
        $content = $content -replace "platform:\s*'JOB_BOARD'", "platform: ApplicationPlatform.JOB_BOARD"
        $content = $content -replace "platform:\s*'CAREER_FAIR'", "platform: ApplicationPlatform.CAREER_FAIR"
        $content = $content -replace "platform:\s*'OTHER'", "platform: ApplicationPlatform.OTHER"
        $content = $content -replace '"LINKEDIN"', 'ApplicationPlatform.LINKEDIN'
        $content = $content -replace '"COMPANY_WEBSITE"', 'ApplicationPlatform.COMPANY_WEBSITE'
        $content = $content -replace '"REFERRAL"', 'ApplicationPlatform.REFERRAL'
        $content = $content -replace '"JOB_BOARD"', 'ApplicationPlatform.JOB_BOARD'
        $modified = $true
    }
    
    # Fix FeedbackTag enums
    if ($content -match "'RESUME'|'DSA'|'SYSTEM_DESIGN'|'COMMUNICATION'") {
        $content = $content -replace '\["DSA",\s*"SYSTEM_DESIGN"\]', '[FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN]'
        $content = $content -replace '\["DSA",\s*"COMMUNICATION"\]', '[FeedbackTag.DSA, FeedbackTag.COMMUNICATION]'
        $content = $content -replace '\["RESUME"\]', '[FeedbackTag.RESUME]'
        $content = $content -replace '\["COMMUNICATION"\]', '[FeedbackTag.COMMUNICATION]'
        $content = $content -replace '"DSA"', 'FeedbackTag.DSA'
        $content = $content -replace '"SYSTEM_DESIGN"', 'FeedbackTag.SYSTEM_DESIGN'
        $content = $content -replace '"RESUME"', 'FeedbackTag.RESUME'
        $content = $content -replace '"COMMUNICATION"', 'FeedbackTag.COMMUNICATION'
        $modified = $true
    }
    
    # Fix FeedbackPriority enums
    if ($content -match "'LOW'|'MEDIUM'|'HIGH'") {
        $content = $content -replace "priority:\s*'LOW'", "priority: FeedbackPriority.LOW"
        $content = $content -replace "priority:\s*'MEDIUM'", "priority: FeedbackPriority.MEDIUM"
        $content = $content -replace "priority:\s*'HIGH'", "priority: FeedbackPriority.HIGH"
        $content = $content -replace '"LOW"', 'FeedbackPriority.LOW'
        $content = $content -replace '"MEDIUM"', 'FeedbackPriority.MEDIUM'
        $content = $content -replace '"HIGH"', 'FeedbackPriority.HIGH'
        $modified = $true
    }
    
    # Fix NotificationType enums
    if ($content -match "'FEEDBACK_RECEIVED'|'APPLICATION_STATUS_CHANGED'|'MENTOR_ASSIGNED'|'SYSTEM_ANNOUNCEMENT'") {
        $content = $content -replace "type:\s*'FEEDBACK_RECEIVED'", "type: NotificationType.FEEDBACK_RECEIVED"
        $content = $content -replace "type:\s*'APPLICATION_STATUS_CHANGED'", "type: NotificationType.APPLICATION_STATUS_CHANGED"
        $content = $content -replace "type:\s*'MENTOR_ASSIGNED'", "type: NotificationType.MENTOR_ASSIGNED"
        $content = $content -replace "type:\s*'SYSTEM_ANNOUNCEMENT'", "type: NotificationType.SYSTEM_ANNOUNCEMENT"
        $content = $content -replace '"FEEDBACK_RECEIVED"', 'NotificationType.FEEDBACK_RECEIVED'
        $content = $content -replace '"APPLICATION_STATUS_CHANGED"', 'NotificationType.APPLICATION_STATUS_CHANGED'
        $content = $content -replace '"MENTOR_ASSIGNED"', 'NotificationType.MENTOR_ASSIGNED'
        $content = $content -replace '"SYSTEM_ANNOUNCEMENT"', 'NotificationType.SYSTEM_ANNOUNCEMENT'
        $modified = $true
    }
    
    # Replace null with undefined for optional properties
    $content = $content -replace "deadline:\s*null", "deadline: undefined"
    $content = $content -replace "resumeUrl:\s*null", "resumeUrl: undefined"
    $content = $content -replace "appliedDate:\s*null", "appliedDate: undefined"
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Enum fixes complete!"
