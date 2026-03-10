---
title: "Notepad++ Security Check"
description: "Schnelle Prüfungen zum Notepad++ Security Incident (Chrysalis Backdoor / Lotus Blossom)"
hero_description: "Schnelle Prüfungen zum Notepad++ Security Incident – basierend auf den Indicators of Compromise der Chrysalis-Backdoor-Analyse."
---

## Check 1 – Verstecktes Bluetooth-Verzeichnis (Kritisch)

```powershell
if (Test-Path "$env:APPDATA\Bluetooth") {
    Write-Host "KRITISCH: Bluetooth-Verzeichnis gefunden!" -ForegroundColor Red
    Get-ChildItem "$env:APPDATA\Bluetooth" -Force
} else {
    Write-Host "OK: Kein Bluetooth-Verzeichnis gefunden." -ForegroundColor Green
}
```

## Check 2 – BluetoothService.exe (Kritisch)

```powershell
Get-Process -Name "BluetoothService" -ErrorAction SilentlyContinue |
    Select-Object Name, Id, Path
```

## Check 3 – log.dll im Bluetooth-Verzeichnis (Kritisch)

```powershell
if (Test-Path "$env:APPDATA\Bluetooth\log.dll") {
    Write-Host "KRITISCH: log.dll gefunden!" -ForegroundColor Red
} else {
    Write-Host "OK: log.dll nicht gefunden." -ForegroundColor Green
}
```

## Check 4 – Notepad++ Plugin-Verzeichnis (Hoch)

```powershell
$pluginPath = "$env:PROGRAMFILES\Notepad++\plugins"
Get-ChildItem $pluginPath -Recurse -Filter "*.dll" |
    Select-Object Name, LastWriteTime, Length | Format-Table -AutoSize
```

## Check 5 – Laufende verdächtige Prozesse (Hoch)

```powershell
Get-Process | Where-Object {
    $_.Name -match "BluetoothService|btservice|log"
} | Select-Object Name, Id, Path | Format-Table -AutoSize
```

## Check 6 – Autostart-Einträge (Hoch)

```powershell
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" |
    Select-Object * -ExcludeProperty PS* | Format-List
```

## Check 7 – Geplante Aufgaben mit verdächtigen Namen (Hoch)

```powershell
Get-ScheduledTask | Where-Object {
    $_.TaskName -match "Bluetooth|btservice"
} | Select-Object TaskName, State, TaskPath | Format-Table -AutoSize
```

## Check 8 – Dienste mit Bluetooth im Namen (Mittel)

```powershell
Get-Service | Where-Object {
    $_.DisplayName -match "Bluetooth" -and
    $_.StartType -ne "Disabled"
} | Select-Object DisplayName, Status, StartType | Format-Table -AutoSize
```

## Check 9 – Netzwerkverbindungen von verdächtigen Prozessen (Mittel)

```powershell
Get-NetTCPConnection -State Established |
    ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        [PSCustomObject]@{
            LocalPort  = $_.LocalPort
            RemoteAddr = $_.RemoteAddress
            RemotePort = $_.RemotePort
            Process    = $proc.Name
            PID        = $_.OwningProcess
        }
    } | Where-Object { $_.Process -match "notepad|Bluetooth" } |
    Format-Table -AutoSize
```

## Check 10 – SHA256-Hash der Notepad++-Hauptdatei prüfen (Mittel)

```powershell
$nppPath = "$env:PROGRAMFILES\Notepad++\notepad++.exe"
if (Test-Path $nppPath) {
    (Get-FileHash $nppPath -Algorithm SHA256).Hash
} else {
    Write-Host "Notepad++ nicht unter Standardpfad gefunden." -ForegroundColor Yellow
}
```

## Check 11 – Datei-Metadaten der Notepad++-DLLs (Mittel)

```powershell
Get-ChildItem "$env:PROGRAMFILES\Notepad++" -Filter "*.dll" |
    Select-Object Name, LastWriteTime, Length |
    Sort-Object LastWriteTime -Descending |
    Format-Table -AutoSize
```

---

> **Warnung:** Der stärkste Einzelindikator ist das versteckte `%APPDATA%\Bluetooth`-Verzeichnis mit `BluetoothService.exe` und `log.dll` darin. Bei Fund: System isolieren und professionelle Analyse einleiten.
