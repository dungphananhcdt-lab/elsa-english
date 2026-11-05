# Elsa English Server for iPad and iPhone (Zero-dependency PowerShell)
$port = 8080
$folder = $PSScriptRoot

# Get local IP address (Wi-Fi or Ethernet)
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" 
} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    $localIP = "localhost"
}

$appUrl = "http://" + $localIP + ":" + $port + "/"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  *** ELSA ENGLISH - APP CHO IPAD VA IPHONE ***  " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " [1] Dam bao iPad / iPhone va may tinh bat CHUNG MANG WI-FI." -ForegroundColor Yellow
Write-Host " [2] Mo trinh duyet Safari tren iPad / iPhone va vao dia chi:" -ForegroundColor Yellow
Write-Host "     ==> $appUrl" -ForegroundColor Green
Write-Host ""
Write-Host " [3] CACH CAI VAO MAN HINH CHINH IPAD (CHAY OFFLINE 100%):" -ForegroundColor Magenta
Write-Host "     - Tren Safari iPad, bam vao nut 'Chia se' (Bieu tuong o vuong mui ten len)." -ForegroundColor White
Write-Host "     - Chon: 'Them vao MH chinh' (Add to Home Screen)." -ForegroundColor White
Write-Host "     - Bam 'Them' (Add) o goc tren ben phai." -ForegroundColor White
Write-Host "     ==> Icon Elsa English se xuat hien tren man hinh chinh iPad!" -ForegroundColor Green
Write-Host "     ==> App chay OFFLINE 100% khong can mang!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dang chay may chu tren cong $port... (Bam Ctrl + C de dung)" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

# Open preview in local browser
Start-Process "http://localhost:${port}/"

# Start pure .NET HttpListener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:${port}/")
try {
    $listener.Start()
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:${port}/")
    $listener.Start()
    Write-Host "Dang chay o che do localhost. De iPad truy cap qua Wi-Fi, hay mo PowerShell voi quyen 'Run as Administrator'." -ForegroundColor Red
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".webmanifest" = "application/manifest+json"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".mp3"  = "audio/mpeg"
    ".ogg"  = "audio/ogg"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "/index.html"
        }

        $cleanPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $folder $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Accept-Ranges", "bytes")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
