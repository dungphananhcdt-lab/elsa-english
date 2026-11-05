$src = $PSScriptRoot
$desktop = [Environment]::GetFolderPath('Desktop')
$zipPath = Join-Path $desktop 'ElsaEnglish_TronGoi.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem

$exclude = @('.git', 'build', 'ElsaEnglish.ipa', 'ElsaEnglish_TronGoi.zip')
$tempDir = Join-Path $env:TEMP ("elsa_pack_" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Get-ChildItem -Path $src | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempDir -Recurse -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Remove-Item -Path $tempDir -Recurse -Force

$size = (Get-Item $zipPath).Length
$mb = [math]::Round($size / 1MB, 2)
Write-Host "==> DA TAO FILE NEN THANH CONG!" -ForegroundColor Green
Write-Host "File duoc luu tai: $zipPath" -ForegroundColor Yellow
Write-Host "Dung luong: $mb MB" -ForegroundColor Cyan

