$url = "https://archive.org/download/tvtunes_27307/Frozen%20-%20Let%20it%20Go.mp3"
$dest = Join-Path $PSScriptRoot "Image\let_it_go_song.mp3"

$req = [System.Net.HttpWebRequest]::Create($url)
$req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
$res = $req.GetResponse()
$stream = $res.GetResponseStream()
$fs = [System.IO.File]::Create($dest)
$stream.CopyTo($fs)
$fs.Close()
$stream.Close()
$res.Close()

$len = (Get-Item $dest).Length
Write-Host "Downloaded Let It Go song! Size: $len bytes" -ForegroundColor Green

# Also copy to assets/images/
Copy-Item $dest (Join-Path $PSScriptRoot "assets\images\let_it_go_song.mp3") -Force

