$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repo

$env:HOST = "127.0.0.1"
$env:PORT = "4173"
$env:AUTO_PUSH_CATALOG = "1"
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
Remove-Item Env:DATA_DIR -ErrorAction SilentlyContinue

$server = Start-Process -FilePath "node" -ArgumentList "server.cjs" -WorkingDirectory $repo -WindowStyle Hidden -PassThru

try {
  Start-Sleep -Milliseconds 900
  $health = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:4173/healthz" -TimeoutSec 5
  if ($health.StatusCode -ne 200) { throw "El servidor no respondió correctamente." }

  Start-Process "http://127.0.0.1:4173/admin"
  Write-Host ""
  Write-Host "Delicias Urbanas Admin está abierto en el navegador." -ForegroundColor Green
  Write-Host "Cada vez que guardes, catalog.json se subirá a GitHub y GitHub Pages desplegará producción." -ForegroundColor Cyan
  Write-Host ""
  Read-Host "Presioná Enter para cerrar el servidor del panel"
}
finally {
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  }
}
