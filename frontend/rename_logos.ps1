$logos = 'C:\Users\subha\Downloads\CardKin_1\frontend\public\logos'

# Canara and rbl downloaded as PNG despite .jpg extension
Rename-Item (Join-Path $logos 'canara.jpg') 'canara.png' -ErrorAction SilentlyContinue
Rename-Item (Join-Path $logos 'rbl.jpg') 'rbl.png' -ErrorAction SilentlyContinue
# indusind is a JPEG despite .png extension
Rename-Item (Join-Path $logos 'indusind.png') 'indusind.jpg' -ErrorAction SilentlyContinue

Write-Host "Done renaming"
Get-ChildItem $logos -File | Select-Object Name, Length | Format-Table -AutoSize
