# PowerShell ile basit ikon oluşturma
Add-Type -AssemblyName System.Drawing

# 256x256 bitmap oluştur
$bitmap = New-Object System.Drawing.Bitmap(256, 256)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Anti-aliasing aktif et
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Discord renkleri
$discordBlue = [System.Drawing.Color]::FromArgb(88, 101, 242)
$discordPurple = [System.Drawing.Color]::FromArgb(114, 137, 218)
$white = [System.Drawing.Color]::White

# Gradient arka plan
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new(256, 256),
    $discordBlue,
    $discordPurple
)

# Yuvarlak dikdörtgen çiz
$rect = New-Object System.Drawing.Rectangle(0, 0, 256, 256)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 32
$path.AddArc($rect.X, $rect.Y, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($rect.Right - $radius * 2, $rect.Y, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($rect.Right - $radius * 2, $rect.Bottom - $radius * 2, $radius * 2, $radius * 2, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $radius * 2, $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()

$graphics.FillPath($brush, $path)

# Müzik sembolü çiz
$font = New-Object System.Drawing.Font("Segoe UI Emoji", 80, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush($white)
$text = "🎵"
$textSize = $graphics.MeasureString($text, $font)
$x = (256 - $textSize.Width) / 2
$y = (256 - $textSize.Height) / 2 - 20

$graphics.DrawString($text, $font, $textBrush, $x, $y)

# Alt kısımda "YM" yazısı
$smallFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$smallText = "YM"
$smallTextSize = $graphics.MeasureString($smallText, $smallFont)
$smallX = (256 - $smallTextSize.Width) / 2
$smallY = 200

$graphics.DrawString($smallText, $smallFont, $textBrush, $smallX, $smallY)

# PNG olarak kaydet
$bitmap.Save("app-icon-256x256.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Temizlik
$graphics.Dispose()
$bitmap.Dispose()
$brush.Dispose()
$textBrush.Dispose()
$font.Dispose()
$smallFont.Dispose()

Write-Host "✅ İkon oluşturuldu: app-icon-256x256.png"
Write-Host "💡 Bu PNG dosyasını online ico converter ile .ico'ya çevirin"
Write-Host "🌐 Önerilen site: https://convertio.co/png-ico/"