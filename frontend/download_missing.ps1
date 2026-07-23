$dest = 'C:\Users\subha\Downloads\CardKin_1\frontend\public\logos'
$headers = @{
  'User-Agent' = 'Mozilla/5.0 (compatible; CardKinApp/1.0; +https://cardkin.in/)'
  'Referer' = 'https://en.wikipedia.org/'
}

$logos = @(
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Kotak_Mahindra_Bank_Logo.svg/320px-Kotak_Mahindra_Bank_Logo.svg.png'; file='kotak.png' },
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/PNB_logo.svg/320px-PNB_logo.svg.png'; file='pnb.png' },
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Federal_Bank_Logo.svg/320px-Federal_Bank_Logo.svg.png'; file='federal.png' },
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/320px-SBI-logo.svg.png'; file='sbi.png' },
  @{ url='https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/320px-HDFC_Bank_Logo.svg.png'; file='hdfc2.png' }
)

foreach ($logo in $logos) {
  $out = Join-Path $dest $logo.file
  try {
    $r = Invoke-WebRequest -Uri $logo.url -OutFile $out -Headers $headers -TimeoutSec 15 -ErrorAction Stop
    $b = [System.IO.File]::ReadAllBytes($out)
    Write-Host "OK: $($logo.file) ($($b.Length) bytes)"
  } catch {
    Write-Host "FAIL: $($logo.file) - $($_.Exception.Message)"
  }
}
