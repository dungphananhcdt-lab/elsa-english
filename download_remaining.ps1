$destDir = Join-Path $PSScriptRoot "Image"

$items = @(
    @{ File = "anna_3d.png"; Url = "https://upload.wikimedia.org/wikipedia/en/8/8a/Anna_Frozen.png" },
    @{ File = "olaf_3d.png"; Url = "https://upload.wikimedia.org/wikipedia/en/6/6d/Olaf_from_Disney%27s_Frozen.png" },
    @{ File = "sven_3d.png"; Url = "https://upload.wikimedia.org/wikipedia/en/c/ce/Sven_from_Frozen.png" },
    @{ File = "kristoff_3d.png"; Url = "https://upload.wikimedia.org/wikipedia/en/2/2e/Kristoff_Bjorgman.png" },
    @{ File = "frozen_characters.jpg"; Url = "https://upload.wikimedia.org/wikipedia/en/f/fe/Frozen2013Characters.jpg" },
    @{ File = "frozen_poster.jpg"; Url = "https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg" },
    @{ File = "elsa_anna_royal.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/e/ef/ElsaAnnaFrozen.jpg" },
    @{ File = "elsa_portrait.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/e/ec/ElsaFrozen.jpg" }
)

foreach ($item in $items) {
    $outPath = Join-Path $destDir $item.File
    if (Test-Path $outPath) { 
        Write-Host "$($item.File) already exists, skipping." -ForegroundColor Yellow
        continue 
    }
    Write-Host "Downloading $($item.File)..." -ForegroundColor Cyan
    try {
        Start-Sleep -Seconds 2
        $req = [System.Net.HttpWebRequest]::Create($item.Url)
        $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        $req.Headers.Add("Accept-Language", "en-US,en;q=0.9")
        $req.Referer = "https://en.wikipedia.org/"
        $res = $req.GetResponse()
        $stream = $res.GetResponseStream()
        $fs = [System.IO.File]::Create($outPath)
        $stream.CopyTo($fs)
        $fs.Close()
        $stream.Close()
        $res.Close()
        $len = (Get-Item $outPath).Length
        Write-Host "  Success! Size: $len bytes" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Sync to assets/images
Get-ChildItem -Path $destDir | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $PSScriptRoot "assets\images") -Force
}

