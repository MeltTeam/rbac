#Requires -RunAsAdministrator

$DownloadDir = "$env:USERPROFILE\Downloads\AMD-Fix"

# 1. Detect AMD GPU
Write-Host ""
Write-Host "[1/5] Detecting AMD GPU..." -ForegroundColor Cyan

$gpu = Get-CimInstance -ClassName Win32_VideoController |
    Where-Object { $_.Name -match "AMD|Radeon" } |
    Select-Object -First 1

if (-not $gpu) {
    Write-Host "  No AMD GPU found. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "  GPU: $($gpu.Name)" -ForegroundColor Green
Write-Host "  Driver: $($gpu.DriverVersion)" -ForegroundColor Green

# 2. Download DDU
Write-Host ""
Write-Host "[2/5] Downloading DDU..." -ForegroundColor Cyan

if (-not (Test-Path $DownloadDir)) {
    New-Item -ItemType Directory -Path $DownloadDir -Force | Out-Null
}

$dduUrl = "https://www.wagnardsoft.com/DDU/Display%20Driver%20Uninstaller%20DDU%20v18.0.7.5.exe"
$dduPath = "$DownloadDir\DDU.exe"

if (Test-Path $dduPath) {
    Write-Host "  DDU already exists, skip download." -ForegroundColor Yellow
} else {
    Write-Host "  Downloading DDU (~1.5MB)..."
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $dduUrl -OutFile $dduPath -UseBasicParsing
        Write-Host "  Download complete." -ForegroundColor Green
    } catch {
        Write-Host "  Auto download failed. Please download DDU manually:" -ForegroundColor Yellow
        Write-Host "  https://www.guru3d.com/download/display-driver-uninstaller-download" -ForegroundColor Yellow
        Write-Host "  Save to: $dduPath" -ForegroundColor Yellow
    }
}

# 3. AMD driver download hint
Write-Host ""
Write-Host "[3/5] AMD driver download..." -ForegroundColor Cyan

$gpuName = $gpu.Name -replace "Radeon\s+", "" -replace "\s+", " "
Write-Host "  Please download the latest Adrenalin driver:" -ForegroundColor Yellow
Write-Host "  1. Open: https://www.amd.com/zh-hans/support" -ForegroundColor White
Write-Host "  2. Search: $gpuName" -ForegroundColor White
Write-Host "  3. Save to: $DownloadDir" -ForegroundColor White

# 4. Configure safe boot
Write-Host ""
Write-Host "[4/5] Configuring safe boot..." -ForegroundColor Cyan

$bcdTarget = "{current}"
$result = cmd /c "bcdedit /set $bcdTarget safeboot minimal" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Safe boot configured." -ForegroundColor Green
} else {
    Write-Host "  Failed to configure safe boot: $result" -ForegroundColor Red
    Write-Host "  Manual: Settings > Recovery > Advanced Startup > Restart" -ForegroundColor Yellow
}

# 5. Confirm restart
Write-Host ""
Write-Host "[5/5] Restart confirmation" -ForegroundColor Cyan
Write-Host ""
Write-Host "  System will restart into safe mode and auto-run DDU." -ForegroundColor Yellow
Write-Host "  After DDU cleanup, system restarts again." -ForegroundColor Yellow
Write-Host "  Then install the AMD driver you downloaded." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "  Type Y to restart now (N to cancel)"

if ($confirm -eq "Y" -or $confirm -eq "y") {

    # Write the DDU cleanup script (runs in safe mode)
    $cleanupScript = "$DownloadDir\ddu-cleanup.ps1"
    $cleanupContent = @"
`$dduPath = "$DownloadDir\DDU.exe"

if (Test-Path `$dduPath) {
    Write-Host "Running DDU to clean AMD drivers..." -ForegroundColor Cyan
    Start-Process -FilePath `$dduPath -ArgumentList "/clean /cleandriverstore /noreboot" -Wait
} else {
    Write-Host "DDU not found: `$dduPath" -ForegroundColor Red
}

cmd /c "bcdedit /deletevalue $bcdTarget safeboot"
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "AMD_DDU_Cleanup" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "DDU cleanup done! Restarting in 30 seconds..." -ForegroundColor Green
Write-Host "Please install AMD driver after restart." -ForegroundColor Yellow

Start-Sleep -Seconds 30
Restart-Computer -Force
"@
    $cleanupContent | Out-File -FilePath $cleanupScript -Encoding UTF8 -Force

    # Registry Run key for safe mode auto-start
    $runKey = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
    $runCmd = "powershell.exe -ExecutionPolicy Bypass -WindowStyle Normal -File `"$cleanupScript`""
    Set-ItemProperty -Path $runKey -Name "AMD_DDU_Cleanup" -Value $runCmd -Force

    Write-Host ""
    Write-Host "  Safe mode auto-run configured." -ForegroundColor Green
    Write-Host "  Restarting in 5 seconds..." -ForegroundColor Yellow

    Start-Sleep -Seconds 5
    Restart-Computer -Force

} else {
    Write-Host ""
    Write-Host "Cancelled. Manual steps:" -ForegroundColor Yellow
    Write-Host "  1. Settings > Recovery > Advanced Startup > Restart" -ForegroundColor White
    Write-Host "  2. Run DDU in safe mode" -ForegroundColor White
    Write-Host "  3. Install AMD driver after restart" -ForegroundColor White
    Write-Host ""
    Write-Host "To cancel safe boot mode, run:" -ForegroundColor Yellow
    Write-Host "  bcdedit /deletevalue {current} safeboot" -ForegroundColor White
}
