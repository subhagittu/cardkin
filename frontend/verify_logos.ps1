$logos = 'C:\Users\subha\Downloads\CardKin_1\frontend\public\logos'
$files = @('hdfc.png','icici.png','sbi.webp','indusind.png','yes.png','bob.png','canara.jpg','rbl.jpg')
foreach ($f in $files) {
  $p = Join-Path $logos $f
  if (Test-Path $p) {
    $b = [System.IO.File]::ReadAllBytes($p)
    $sig = ($b[0..3] | ForEach-Object { '{0:X2}' -f $_ }) -join '-'
    Write-Host "$f : $($b.Length) bytes | sig=$sig"
  } else { Write-Host "MISSING: $f" }
}
