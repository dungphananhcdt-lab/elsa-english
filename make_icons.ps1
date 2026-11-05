Add-Type -AssemblyName System.Drawing
$size = 180
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$c1 = [System.Drawing.Color]::FromArgb(255, 72, 202, 228)
$c2 = [System.Drawing.Color]::FromArgb(255, 2, 62, 138)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 0,0), (New-Object System.Drawing.Point $size,$size), $c1, $c2
$g.FillRectangle($brush, 0, 0, $size, $size)
$brush.Dispose()

$src = "C:\Users\admin\Desktop\IOS\Image\elsa_3d.png"
if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile($src)
    $h = [int]($size * 0.92)
    $w = [int]($img.Width * ($h / $img.Height))
    $x = [int](($size - $w) / 2)
    $y = [int]($size - $h)
    $g.DrawImage($img, $x, $y, $w, $h)
    $img.Dispose()
}

$bmp.Save("C:\Users\admin\Desktop\IOS\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("C:\Users\admin\Desktop\IOS\assets\icons\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("C:\Users\admin\Desktop\IOS\assets\icons\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("C:\Users\admin\Desktop\IOS\assets\icons\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Host "GENERATED ALL ICONS SUCCESSFULLY"

