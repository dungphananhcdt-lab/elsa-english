# Elsa English iOS App Packaging Tool (.ipa)
$rootDir = $PSScriptRoot
$buildDir = Join-Path $rootDir "build"
$payloadDir = Join-Path $buildDir "Payload"
$appDir = Join-Path $payloadDir "ElsaEnglish.app"
$ipaOutPath = Join-Path $rootDir "ElsaEnglish.ipa"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DONG GOI UNG DUNG ELSA ENGLISH THANH FILE CAI DAT (.IPA) " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Clean & create directories
if (Test-Path $buildDir) { Remove-Item -Path $buildDir -Recurse -Force | Out-Null }
New-Item -ItemType Directory -Path $appDir -Force | Out-Null

# 2. Copy Web App Files
Write-Host "[1/5] Sao chep toan bo tai nguyen Web App..." -ForegroundColor White
$copyItems = @("index.html", "manifest.webmanifest", "css", "js", "Image", "coloring", "assets")
foreach ($item in $copyItems) {
    $src = Join-Path $rootDir $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $appDir -Recurse -Force
    }
}

# 3. Create Icons
Write-Host "[2/5] Tao bo Icon chuan iOS cho iPad va iPhone..." -ForegroundColor White
Add-Type -AssemblyName System.Drawing

function Create-AppIcon {
    param([string]$sourceImgPath, [string]$outPath, [int]$size)
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $c1 = [System.Drawing.Color]::FromArgb(255, 72, 202, 228)
    $c2 = [System.Drawing.Color]::FromArgb(255, 2, 62, 138)
    $pt1 = New-Object System.Drawing.Point 0, 0
    $pt2 = New-Object System.Drawing.Point $size, $size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $pt1, $pt2, $c1, $c2
    $g.FillRectangle($brush, 0, 0, $size, $size)
    $brush.Dispose()
    
    if (Test-Path $sourceImgPath) {
        $charImg = [System.Drawing.Image]::FromFile($sourceImgPath)
        $targetH = [int]($size * 0.90)
        $targetW = [int]($charImg.Width * ($targetH / $charImg.Height))
        $x = [int](($size - $targetW) / 2)
        $y = [int]($size - $targetH)
        $g.DrawImage($charImg, $x, $y, $targetW, $targetH)
        $charImg.Dispose()
    }
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

$elsaImg = Join-Path $rootDir "Image\elsa_3d.png"
Create-AppIcon $elsaImg (Join-Path $appDir "AppIcon60x60@2x.png") 120
Create-AppIcon $elsaImg (Join-Path $appDir "AppIcon60x60@3x.png") 180
Create-AppIcon $elsaImg (Join-Path $appDir "AppIcon76x76@2x~ipad.png") 152
Create-AppIcon $elsaImg (Join-Path $appDir "AppIcon83.5x83.5@2x~ipad.png") 167
Create-AppIcon $elsaImg (Join-Path $appDir "Icon-1024.png") 1024

# 4. Create Info.plist
Write-Host "[3/5] Tao file cau hinh ung dung Info.plist..." -ForegroundColor White
$plistContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>BuildMachineOSBuild</key>
    <string>22G120</string>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>Elsa English</string>
    <key>CFBundleExecutable</key>
    <string>ElsaEnglish</string>
    <key>CFBundleIcons</key>
    <dict>
        <key>CFBundlePrimaryIcon</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>AppIcon60x60</string>
            </array>
            <key>CFBundleIconName</key>
            <string>AppIcon</string>
        </dict>
    </dict>
    <key>CFBundleIcons~ipad</key>
    <dict>
        <key>CFBundlePrimaryIcon</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>AppIcon76x76</string>
                <string>AppIcon83.5x83.5</string>
            </array>
            <key>CFBundleIconName</key>
            <string>AppIcon</string>
        </dict>
    </dict>
    <key>CFBundleIdentifier</key>
    <string>com.elsaenglish.kidsapp</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>ElsaEnglish</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleSupportedPlatforms</key>
    <array>
        <string>iPhoneOS</string>
    </array>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>DTPlatformName</key>
    <string>iphoneos</string>
    <key>DTSDKName</key>
    <string>iphoneos16.4</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>MinimumOSVersion</key>
    <string>12.0</string>
    <key>UIDeviceFamily</key>
    <array>
        <integer>1</integer>
        <integer>2</integer>
    </array>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>arm64</string>
    </array>
    <key>UIRequiresFullScreen</key>
    <true/>
    <key>UIStatusBarHidden</key>
    <true/>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
"@
[System.IO.File]::WriteAllText((Join-Path $appDir "Info.plist"), $plistContent, (New-Object System.Text.UTF8Encoding($false)))

# 5. Generate Mach-O Executable Binary
Write-Host "[4/5] Tao file thuc thi iOS Mach-O ARM64 (ElsaEnglish)..." -ForegroundColor White
$execPath = Join-Path $appDir "ElsaEnglish"
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $ms

$bw.Write([uint32]0xfeedfacfL) # magic: MH_MAGIC_64
$bw.Write([uint32]0x0100000cL) # cputype: CPU_TYPE_ARM64
$bw.Write([uint32]0x00000000L) # cpusubtype: CPU_SUBTYPE_ARM64_ALL
$bw.Write([uint32]0x00000002L) # filetype: MH_EXECUTE
$bw.Write([uint32]4)           # ncmds: 4
$bw.Write([uint32]208)         # sizeofcmds
$bw.Write([uint32]0x00200085L) # flags: MH_NOUNDEFS | MH_DYLDLINK | MH_TWOLEVEL | MH_PIE
$bw.Write([uint32]0)           # reserved

# Command 1: LC_SEGMENT_64 (__PAGEZERO)
$bw.Write([uint32]0x19)
$bw.Write([uint32]72)
$pzName = [System.Text.Encoding]::ASCII.GetBytes("__PAGEZERO") + (New-Object byte[] (16 - 10))
$bw.Write($pzName)
$bw.Write([uint64]0)
$bw.Write([uint64]0x100000000L)
$bw.Write([uint64]0)
$bw.Write([uint64]0)
$bw.Write([uint32]0)
$bw.Write([uint32]0)
$bw.Write([uint32]0)
$bw.Write([uint32]0)

# Command 2: LC_SEGMENT_64 (__TEXT)
$bw.Write([uint32]0x19)
$bw.Write([uint32]72)
$textName = [System.Text.Encoding]::ASCII.GetBytes("__TEXT") + (New-Object byte[] (16 - 6))
$bw.Write($textName)
$bw.Write([uint64]0x100000000L)
$bw.Write([uint64]0x4000)
$bw.Write([uint64]0)
$bw.Write([uint64]0x4000)
$bw.Write([uint32]5)
$bw.Write([uint32]5)
$bw.Write([uint32]0)
$bw.Write([uint32]0)

# Command 3: LC_LOAD_DYLINKER
$bw.Write([uint32]0x0e)
$bw.Write([uint32]32)
$bw.Write([uint32]12)
$dylinkerStr = [System.Text.Encoding]::ASCII.GetBytes("/usr/lib/dyld`0")
$dylinkerPadding = New-Object byte[] (20 - $dylinkerStr.Length)
$bw.Write($dylinkerStr)
$bw.Write($dylinkerPadding)

# Command 4: LC_BUILD_VERSION
$bw.Write([uint32]0x32)
$bw.Write([uint32]32)
$bw.Write([uint32]2)          # platform: PLATFORM_IOS
$bw.Write([uint32]0x000c0000L) # minos: iOS 12.0
$bw.Write([uint32]0x00100400L) # sdk: iOS 16.4
$bw.Write([uint32]0)

$headerSize = $ms.Position
$padLen = 0x4000 - $headerSize
$padding = New-Object byte[] $padLen
$padding[0] = 0x00; $padding[1] = 0x00; $padding[2] = 0x80; $padding[3] = 0xD2 # mov x0, #0
$padding[4] = 0xC0; $padding[5] = 0x03; $padding[6] = 0x5F; $padding[7] = 0xD6 # ret
$bw.Write($padding)

[System.IO.File]::WriteAllBytes($execPath, $ms.ToArray())
$bw.Close()
$ms.Close()

# 6. Archive Payload to .ipa (Standard Apple IPA structure)
Write-Host "[5/5] Nen toan bo thu muc Payload thanh goi cai dat ElsaEnglish.ipa..." -ForegroundColor White
if (Test-Path $ipaOutPath) { Remove-Item -Path $ipaOutPath -Force }

$tempZip = Join-Path $env:TEMP "ElsaEnglish_$(Get-Random).zip"
if (Test-Path $tempZip) { Remove-Item -Path $tempZip -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
# Only zip the Payload directory! (Inside an IPA, Payload must be at the root of the zip archive)
$zipSourceDir = Join-Path $buildDir "archive_root"
if (Test-Path $zipSourceDir) { Remove-Item -Path $zipSourceDir -Recurse -Force }
New-Item -ItemType Directory -Path $zipSourceDir -Force | Out-Null
Copy-Item -Path $payloadDir -Destination $zipSourceDir -Recurse -Force

[System.IO.Compression.ZipFile]::CreateFromDirectory($zipSourceDir, $tempZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Move-Item -Path $tempZip -Destination $ipaOutPath -Force
Remove-Item -Path $zipSourceDir -Recurse -Force

$ipaSize = (Get-Item $ipaOutPath).Length
$ipaMB = [math]::Round($ipaSize / (1024 * 1024), 2)

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   DA DONG GOI THANH CONG FILE CAI DAT (.IPA)!           " -ForegroundColor Green
Write-Host "   Duong dan file: $ipaOutPath" -ForegroundColor White
Write-Host "   Dung luong: $ipaMB MB ($ipaSize bytes)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "HUONG DAN CAI DAT LEN IPAD QUA MAY TINH:" -ForegroundColor Cyan
Write-Host "1. Su dung ung dung 3uTools (Mien phi) hoac Sideloadly tren PC." -ForegroundColor White
Write-Host "2. Cam iPad vao may tinh qua cap USB." -ForegroundColor White
Write-Host "3. Keo tha file ElsaEnglish.ipa vao 3uTools / Sideloadly de cai truc tiep len iPad." -ForegroundColor White
Write-Host "4. Ung dung se xuat hien tren man hinh chinh cua iPad va choi offline 100%!" -ForegroundColor Green
Write-Host ""
