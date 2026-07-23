$dest = 'C:\Users\subha\Downloads\CardKin_1\frontend\public\logos'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }

$logos = @(
  @{ url='https://companieslogo.com/img/orig/HDB-bb6241fe.png?t=1720244492'; file='hdfc.png' },
  @{ url='https://companieslogo.com/img/orig/IBN-af38b5c0.png?t=1720244492'; file='icici.png' },
  @{ url='https://p1.hiclipart.com/preview/2/386/542/bank-axis-bank-logo-credit-card-symbol-mutual-fund-watermark-purple-png-clipart.jpg'; file='axis.png' },
  @{ url='https://thebranvetica.com/assets/img/SBI_Logo.webp'; file='sbi.webp' },
  @{ url='https://e7.pngegg.com/pngimages/851/1003/png-clipart-kotak-mahindra-bank-mobile-banking-private-sector-banks-in-india-banking-in-india-insurance-company-text-thumbnail.png'; file='kotak.png' },
  @{ url='https://www.clipartmax.com/png/middle/241-2415990_about-us-indusind-bank-ltd-logo.png'; file='indusind.png' },
  @{ url='https://companieslogo.com/img/orig/YESBANK.NS-a31ff15a.png?t=1720244494'; file='yes.png' },
  @{ url='https://static.vecteezy.com/system/resources/previews/020/190/451/non_2x/punjab-national-bank-pnb-bank-logo-free-free-vector.jpg'; file='pnb.jpg' },
  @{ url='https://logoeps.com/wp-content/uploads/2014/01/bank-of-baroda-vector-logo.png'; file='bob.png' },
  @{ url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6TkS3gEFrUzoBkGgImIiEK2kJGymMlhckGhwO2gyy4Q&s'; file='canara.jpg' },
  @{ url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkkyWTSSC5HhuWIw2Q1eKqwSIM3EK-y2uXpr5Ozy6iGA&s'; file='rbl.jpg' }
)

foreach ($logo in $logos) {
  $out = Join-Path $dest $logo.file
  try {
    Invoke-WebRequest -Uri $logo.url -OutFile $out -Headers $headers -TimeoutSec 20 -ErrorAction Stop
    $size = (Get-Item $out).Length
    Write-Host "OK: $($logo.file) ($size bytes)"
  } catch {
    Write-Host "FAIL: $($logo.file) - $_"
  }
}
