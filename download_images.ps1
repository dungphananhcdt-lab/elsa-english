# Script to download realistic 3D movie images of Elsa, Anna, Olaf, Sven, Ice Castle & Enchanted Forest
$imgFolder = Join-Path $PSScriptRoot "Image"
if (-not (Test-Path $imgFolder)) {
    New-Item -ItemType Directory -Path $imgFolder -Force | Out-Null
}

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

# Curated high-res transparent 3D movie renders matching the user's screenshots exactly
$images = @{
    "elsa_full.png" = "https://static.wikia.nocookie.net/disney/images/e/e0/Elsa_Disney_Infinity.png"
    "elsa_portrait.png" = "https://static.wikia.nocookie.net/disney/images/d/df/Profile_-_Elsa.png"
    "elsa_frozen2.png" = "https://static.wikia.nocookie.net/disney/images/2/25/Elsa_Frozen_2.png"
    "anna_frozen2.png" = "https://static.wikia.nocookie.net/disney/images/5/52/Anna_Frozen_2.png"
    "olaf_movie.png" = "https://static.wikia.nocookie.net/disney/images/1/1a/Olaf_Frozen_2.png"
    "sven_movie.png" = "https://static.wikia.nocookie.net/disney/images/2/22/Sven_Frozen_2.png"
    "kristoff_movie.png" = "https://static.wikia.nocookie.net/disney/images/0/07/Kristoff_Frozen_2.png"
    "ice_castle.png" = "https://static.wikia.nocookie.net/disney/images/3/30/Elsa%27s_Ice_Palace.png"
}

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $dest = Join-Path $imgFolder $name
    Write-Host "Downloading $name..." -ForegroundColor Cyan
    try {
        $wc.DownloadFile($url, $dest)
        $fi = Get-Item $dest
        Write-Host "  Success! Size: $($fi.Length) bytes" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to download $url : $($_.Exception.Message)" -ForegroundColor Red
    }
}

