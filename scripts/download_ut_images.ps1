$images = @(
    # Hardware
    @{ url = "https://cs50.harvard.edu/technology/notes/1/ascii.png"; dest = "public/images/understanding-technology/hardware/ascii.png" },
    @{ url = "https://twemoji.maxcdn.com/v/14.0.2/72x72/1f632.png"; dest = "public/images/understanding-technology/hardware/unicode-emoji.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/intel.png"; dest = "public/images/understanding-technology/hardware/intel-cpu.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/pi.png"; dest = "public/images/understanding-technology/hardware/raspberry-pi-soc.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/ram.png"; dest = "public/images/understanding-technology/hardware/ram-module.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/windows.png"; dest = "public/images/understanding-technology/hardware/windows-taskmgr.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/mac.png"; dest = "public/images/understanding-technology/hardware/mac-system-profiler.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/hddout.png"; dest = "public/images/understanding-technology/hardware/hdd-exterior.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/hddinside.png"; dest = "public/images/understanding-technology/hardware/hdd-interior-platters.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/ssdout.png"; dest = "public/images/understanding-technology/hardware/ssd-exterior.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/ssdinside.png"; dest = "public/images/understanding-technology/hardware/ssd-interior-flash.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/funnel.png"; dest = "public/images/understanding-technology/hardware/memory-funnel.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/tradeoff.png"; dest = "public/images/understanding-technology/hardware/memory-tradeoff.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/display.png"; dest = "public/images/understanding-technology/hardware/display-connectors.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/1/usb.png"; dest = "public/images/understanding-technology/hardware/usb-types.png" },

    # Internet
    @{ url = "https://cs50.harvard.edu/technology/notes/2/homenetwork.png"; dest = "public/images/understanding-technology/internet/homenetwork.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/happycat.jpg"; dest = "public/images/understanding-technology/internet/happycat-packets.jpg" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/mac.png"; dest = "public/images/understanding-technology/internet/mac-network-settings.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/macadv.png"; dest = "public/images/understanding-technology/internet/mac-advanced-tcpip.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/windows.png"; dest = "public/images/understanding-technology/internet/windows-network-settings.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/network.png"; dest = "public/images/understanding-technology/internet/network-mesh-routers.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/traceroutegoogle.png"; dest = "public/images/understanding-technology/internet/traceroute-google.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/tracerouteberkeley.png"; dest = "public/images/understanding-technology/internet/traceroute-berkeley.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/traceroutemit.png"; dest = "public/images/understanding-technology/internet/traceroute-mit.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/2/traceroutejp.png"; dest = "public/images/understanding-technology/internet/traceroute-japan.png" },

    # Multimedia
    @{ url = "https://cs50.harvard.edu/technology/notes/3/garageband.png"; dest = "public/images/understanding-technology/multimedia/garageband-midi.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/smile.png"; dest = "public/images/understanding-technology/multimedia/pixel-grid-smile.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/xp.png"; dest = "public/images/understanding-technology/multimedia/windows-xp-bliss.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/xpzoom.png"; dest = "public/images/understanding-technology/multimedia/windows-xp-pixelated.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/apples.png"; dest = "public/images/understanding-technology/multimedia/lossless-compression-apples.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/sunflower1.png"; dest = "public/images/understanding-technology/multimedia/lossy-sunflower-original.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/sunflower2.png"; dest = "public/images/understanding-technology/multimedia/lossy-sunflower-compressed.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/nyan.gif"; dest = "public/images/understanding-technology/multimedia/nyan-cat.gif" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/interframe.png"; dest = "public/images/understanding-technology/multimedia/video-interframe-compression.png" },
    @{ url = "https://cs50.harvard.edu/technology/notes/3/sanders.png"; dest = "public/images/understanding-technology/multimedia/sanders-theatre-360-vr.png" }
)

foreach ($item in $images) {
    $parent = Split-Path -Parent $item.dest
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    if (-not (Test-Path $item.dest) -or (Get-Item $item.dest).Length -eq 0) {
        Write-Host "Downloading: $($item.dest)..."
        & curl.exe -s -L -o $item.dest $item.url
    } else {
        Write-Host "Already exists: $($item.dest)"
    }
}
Write-Host "All downloads done!"
