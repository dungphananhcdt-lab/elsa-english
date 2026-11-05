# Download authentic 3D movie characters & backgrounds into Image/
$destDir = Join-Path $PSScriptRoot "Image"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "ElsaEnglishApp/1.0 (learning.app; contact@elsa.local)")

$items = @(
    @{
        File = "elsa_3d.png"
        Url = "https://upload.wikimedia.org/wikipedia/en/5/5e/Elsa_from_Disney%27s_Frozen.png"
    },
    @{
        File = "anna_3d.png"
        Url = "https://upload.wikimedia.org/wikipedia/en/8/8a/Anna_Frozen.png"
    },
    @{
        File = "olaf_3d.png"
        Url = "https://upload.wikimedia.org/wikipedia/en/6/6d/Olaf_from_Disney%27s_Frozen.png"
    },
    @{
        File = "sven_3d.png"
        Url = "https://upload.wikimedia.org/wikipedia/en/c/ce/Sven_from_Frozen.png"
    },
    @{
        File = "kristoff_3d.png"
        Url = "https://upload.wikimedia.org/wikipedia/en/2/2e/Kristoff_Bjorgman.png"
    },
    @{
        File = "frozen_characters.jpg"
        Url = "https://upload.wikimedia.org/wikipedia/en/f/fe/Frozen2013Characters.jpg"
    },
    @{
        File = "frozen_poster.jpg"
        Url = "https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg"
    },
    @{
        File = "elsa_anna_royal.jpg"
        Url = "https://upload.wikimedia.org/wikipedia/commons/e/ef/ElsaAnnaFrozen.jpg"
    },
    @{
        File = "elsa_portrait.jpg"
        Url = "https://upload.wikimedia.org/wikipedia/commons/e/ec/ElsaFrozen.jpg"
    }
)

foreach ($item in $items) {
    $outPath = Join-Path $destDir $item.File
    Write-Host "Downloading $($item.File)..." -ForegroundColor Cyan
    try {
        $wc.DownloadFile($item.Url, $outPath)
        $len = (Get-Item $outPath).Length
        Write-Host "  OK! Size: $len bytes" -ForegroundColor Green
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Also copy to assets/images so the app can use them immediately
$assetsImg = Join-Path $PSScriptRoot "assets\images"
Get-ChildItem -Path $destDir | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $assetsImg -Force
}
Write-Host "Copied all images to assets/images/" -ForegroundColor Green

