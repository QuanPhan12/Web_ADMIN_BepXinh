param([switch]$Demo, [switch]$ServerOnly, [ValidateRange(1024,65535)][int]$Port = 5173)
$ErrorActionPreference = 'Stop'
$adminRoot = Split-Path -Parent $PSScriptRoot
$appRoot = [System.IO.Path]::GetFullPath((Join-Path $adminRoot '../app_bep_xinh'))

if (!(Test-Path (Join-Path $appRoot 'functions/node_modules/firebase-admin'))) {
  throw 'Run npm.cmd --prefix ../app_bep_xinh/functions ci first.'
}
if (!(Test-Path (Join-Path $adminRoot 'node_modules/vite'))) {
  throw 'Run npm.cmd ci in admin_bep_xinh first.'
}

# Dung Java local da tai cho emulator neu may chua cau hinh JAVA_HOME.
$cachedJava = Join-Path $appRoot 'build/report_temp/java21/jdk-21.0.13+9-jre'
if ($Demo -and !$env:JAVA_HOME -and (Test-Path (Join-Path $cachedJava 'bin/java.exe'))) {
  $env:JAVA_HOME = $cachedJava
}
if ($env:JAVA_HOME) { $env:PATH = (Join-Path $env:JAVA_HOME 'bin') + ';' + $env:PATH }
if ($Demo -and !(Get-Command java -ErrorAction SilentlyContinue)) {
  throw 'Install Java 21+ and set JAVA_HOME before starting Firebase emulators.'
}

Push-Location $appRoot
try {
  node functions/tool/init-local.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Cannot initialize local AI encryption key.' }
  if ($Demo) {
    npm.cmd exec --package=firebase-tools@15.34.2 -- firebase emulators:exec --only auth,firestore,functions --project demo-bepxinh --config firebase.ai.local.json 'node ../admin_bep_xinh/tool/ai-local-session.mjs'
  } else {
    # Auth va Firestore that: khong cho bien emulator cu am tham chuyen sang demo.
    if ($env:FIRESTORE_EMULATOR_HOST -or $env:FIREBASE_AUTH_EMULATOR_HOST -or $env:GOOGLE_APPLICATION_CREDENTIALS) {
      throw 'Clear emulator variables and GOOGLE_APPLICATION_CREDENTIALS in this terminal. Real mode uses the approved Firebase CLI account.'
    }
    Write-Host 'REAL DATA: Firebase Auth/Firestore bepxinh-b0be7; only the AI server runs locally.'
    if ($ServerOnly) {
      npm.cmd exec --package=firebase-tools@15.34.2 -- firebase emulators:start --only functions --project bepxinh-b0be7 --account phuckk2101@gmail.com --config firebase.ai.real-local.json
    } else {
      $env:BX_ADMIN_PORT = "$Port"
      npm.cmd exec --package=firebase-tools@15.34.2 -- firebase emulators:exec --only functions --project bepxinh-b0be7 --account phuckk2101@gmail.com --config firebase.ai.real-local.json 'node ../admin_bep_xinh/tool/ai-local-session.mjs --real'
    }
  }
  if ($LASTEXITCODE -ne 0) { throw 'Local AI stopped with an error. Check the emulator output above.' }
} finally {
  Pop-Location
}
