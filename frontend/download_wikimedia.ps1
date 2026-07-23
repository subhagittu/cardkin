$dest = 'C:\Users\subha\Downloads\CardKin_1\frontend\public\logos'
$headers = @{
  'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  'Accept' = 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  'Accept-Language' = 'en-US,en;q=0.9'
  'Referer' = 'https://en.wikipedia.org/'
  'sec-fetch-dest' = 'image'
  'sec-fetch-mode' = 'no-cors'
  'sec-fetch-site' = 'cross-site'
}

$logos = @(
  # Axis Bank - currently visible in browser
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/330px-Axis_Bank_logo.svg.png'; file='axis.png' },
  # Kotak Mahindra Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Kotak_Mahindra_Bank_Logo.svg/320px-Kotak_Mahindra_Bank_Logo.svg.png'; file='kotak.png' },
  # PNB
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/PNB_logo.svg/320px-PNB_logo.svg.png'; file='pnb.png' },
  # Federal Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Federal_Bank_Logo.svg/320px-Federal_Bank_Logo.svg.png'; file='federal.png' },
  # SBI - better quality
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/320px-SBI-logo.svg.png'; file='sbi.png' },
  # HDFC Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/320px-HDFC_Bank_Logo.svg.png'; file='hdfc2.png' },
  # ICICI Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/320px-ICICI_Bank_Logo.svg.png'; file='icici2.png' },
  # Yes Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Yes_Bank_Logo.svg/320px-Yes_Bank_Logo.svg.png'; file='yes2.png' },
  # IndusInd Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/IndusInd_Bank_logo.svg/320px-IndusInd_Bank_logo.svg.png'; file='indusind2.png' },
  # RBL Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/RBL_Bank_logo.svg/320px-RBL_Bank_logo.svg.png'; file='rbl2.png' },
  # Bank of Baroda
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bank_of_Baroda_logo.svg/320px-Bank_of_Baroda_logo.svg.png'; file='bob2.png' },
  # Canara Bank
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Canara_Bank_Logo.svg/320px-Canara_Bank_Logo.svg.png'; file='canara2.png' }
)

foreach ($logo in $logos) {
  $out = Join-Path $dest $logo.file
  try {
    Invoke-WebRequest -Uri $logo.url -OutFile $out -Headers $headers -TimeoutSec 20 -ErrorAction Stop
    $b = [System.IO.File]::ReadAllBytes($out)
    $sig = ($b[0..2] | ForEach-Object { '{0:X2}' -f $_ }) -join '-'
    Write-Host "OK: $($logo.file) ($($b.Length) bytes) sig=$sig"
  } catch {
    Write-Host "FAIL: $($logo.file) - $($_.Exception.Message)"
  }
}
