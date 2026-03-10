# Neuhaus-IT – Grav CMS Theme & Inhalte

Grav-Theme und Seiteninhalte für neuhaus-it.de.
Das Designsystem ist als Git-Submodul eingebunden.

## Projektstruktur

```
user/
  themes/neuhaus-it/
    design-system/    ← Git-Submodul (neuhaus-it-design-system)
    templates/        ← Twig-Templates
    css/custom.css    ← Theme-spezifisches CSS
    js/app.js         ← Navigation, Hamburger, aktiver Link
    blueprints.yaml   ← Theme-Metadaten
    neuhaus-it.yaml   ← Konfiguration (Nav, Kontakt, Footer)
  pages/              ← Markdown-Inhalte (eine Datei pro Seite)
  config/             ← Grav-Systemkonfiguration
  plugins/            ← Grav-Plugins (nicht eingecheckt)
```

## Grav-Templates

| Template | Route | Zweck |
|---|---|---|
| `home.html.twig` | `/` | Startseite |
| `terminbuchungen.html.twig` | `/terminbuchungen` | Terminbuchung (ersetzt `/termine`) |
| `preise.html.twig` | `/preise` | Preisliste |
| `kontakt.html.twig` | `/kontakt-und-impressum` | Kontakt + Impressum |
| `fernwartung.html.twig` | `/fernwartung` | RustDesk-Downloads |
| `notepadplusplus.html.twig` | `/notepadplusplus` | Security Checks + Copy-Button |
| `default.html.twig` | alle anderen | Standard-Unterseite |
| `error.html.twig` | Fehlerseiten | 404 etc. |

## Deployment auf Uberspace

```bash
# 1. Grav herunterladen und entpacken
wget https://getgrav.org/download/core/grav/latest -O grav.zip
unzip grav.zip -d ~/html

# 2. Dieses Repo als user/-Verzeichnis einhängen
cd ~/html/grav
rm --recursive --force user/
git clone <repo-url> user/
cd user/
git -c protocol.file.allow=always submodule update --init --recursive

# 3. Grav-Cache leeren
cd ~/html/grav
php bin/grav clearcache
```

## Konfiguration anpassen

Alle seitenweiten Daten (Kontakt, Navigation, Footer) werden in
`user/themes/neuhaus-it/neuhaus-it.yaml` gepflegt.

## Designsystem aktualisieren

```bash
cd user/themes/neuhaus-it/design-system
git pull origin main
cd ../../..
git add user/themes/neuhaus-it/design-system
git commit --message "Designsystem aktualisiert"
```

## Lizenz

CC BY-NC-SA 4.0 or later – Neuhaus-IT (Inh. Till Neuhaus)
