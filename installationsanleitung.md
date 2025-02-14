# Installationsanleitung

> Copyright 2016 - present [Jürgen Zimmermann](mailto:Juergen.Zimmermann@h-ka.de), Hochschule Karlsruhe
>
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU General Public License as published by
> the Free Software Foundation, either version 3 of the License, or
> at your option any later version
>
> This program is distributed in the hope that it will be useful
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
> GNU General Public License for more details
>
> You should have received a copy of the GNU General Public License
> along with this program. If not, see <https://www.gnu.org/licenses/>

> Mit Chrome und der Erweiterung _Markdown Viewer_ https://chromewebstore.google.com/detail/markdown-viewer/ckkdlimhmcjmikdlpkmbgfkaikojcbjk?hl=de&pli=1
> kann man Markdown-Dateien mit der Endung `.md` schön lesen.
> Für diese Erweiterung muss man die Option _Zugriff auf Datei-URLs zulassen_
> aktivieren.

Allgemeine Hinweise:

- 16 GB RAM sind für eine _vernünftige_ Projektarbeit (d.h. für _Klausurpunkte_)
  sinnvoll. Bei Bedarf kann ein Notebook der Fakultät ausgeliehen werden.
- Nur in den ersten beiden Vorlesungswochen kann es Unterstützung bei
  Installationsproblemen geben.
- Diese Anleitung ist für _Windows 11_, damit jede/r Studierende auf dem
  eigenen oder einem ausgeliehenen Notebook flexibel arbeiten kann und nicht
  an die Poolräume gebunden ist. Für die Installation von Windows Home
  gibt es eine separate Installationsanleitung.
- Für _andere Betriebssysteme_ oder irgendwelche _Windows-Emulationen_
  sind Anpassungen notwendig.
  Bei über 160 Studenten (3. und 4. Semester sowie 3 Wahlpflichtfächer)
  kann es dafür leider **keine** Unterstützung geben:
  Welche Linux-Distribution? Welche Linux-Version? Welche macOS-Version?
  Ggf. gibt es genügend Notebooks zur Ausleihe.
- Die Installation sämtlicher Software erfolgt im Pfad `C:\Zimmermann`,
  damit sie in späteren Semestern leicht entfernt werden kann.
- In einem Webbrowser kann man z.B. mit der URL https://speed.cloudflare.com die
  Download- und die Upload-Geschwindigkeit testen.

## Windows 11 23H2

Für _WSL 2_ und Docker Desktop (s.u.) ist Windows 11 23H2 notwendig. Die
aktuelle Version von Windows kann man ermitteln, indem man die [Windows-Taste]
drückt und `PC-Infos` eingibt. Dann sieht man die installierte Versionsnummer
im Feld _Version_. Mit dem Link
`https://www.microsoft.com/de-de/software-download/windows11`
kann man dann ggf. Windows aktualisieren.

Nachdem Windows (scheinbar) aktualisiert ist, muss man noch die Updates
installieren, die seit dem Erscheinen der gerade installierten Windows Version
zusätzlich erschienen sind. Die Updates kann man über das Windows-Menü in der
linken unteren Ecke des Desktops installieren.

Bevor man _PowerShell_, _Terminal_, _WSL 2_ usw. installiert, ist
ein Neustart des Rechners empfehlenswert.

## Update der Powershell

`PowerShell-7...-win-x64.msi` kann man von https://github.com/PowerShell/PowerShell/releases
herunterladen und installieren. Dabei wird die Umgebungsvariable `PATH` um den
Eintrag `C:\Program Files\PowerShell\7` ergänzt. Das kann man überprüfen,
indem man in einem _neuen_ Powershell-Fenster `$env:PATH` eingibt.

Jetzt sollte man die Umgebungsvariable `PATH` so setzen, dass `C:\Program Files\PowerShell\7`
_VOR_ dem Eintrag für Powershell Version 1 kommt. Dazu betätigt man die
`[Windows-Taste]` und gibt als Suchstring `Systemumgebungsvariablen bearbeiten`
ein.

## Terminal

_Terminal_ kann man von https://aka.ms/terminal-preview herunterladen und
installieren.

Alternativ kann man auch den Microsoft Store durch https://www.microsoft.com/de-de/store/top-free/apps/pc
benutzen oder über die [Windows-Taste] aus der Liste der Apps _Microsoft Store_
auswählen und nach _Terminal_ suchen.

## Update auf WSL 2

In einer Powershell als _Administrator_ gibt man folgendes Kommando ein, wofür
eine Internet-Verbindung notwendig ist. Anschließend empfiehlt sich ein Neustart.

```powershell
wsl --install
wsl --update
```

### Bei Bedarf: Manuelles Update auf WSL 2

Falls das Update auf WSL 2 **nicht** funktioniert hat, kann man ein manuelles
Update durchführen, siehe https://docs.microsoft.com/windows/wsl/install-manual.
Dazu gibt man folgende Kommandos ein, wobei nach dem 1. Kommando ein Neustart
des Rechners erforderlich sein kann. Nach dem 2. Kommando ist ein Neustart
des Rechners auf jeden Fall empfehlenswert.

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Als nächstes setzt man die Default-Version des _Windows Subsystem Linux_
durch `wsl --set-default-version 2`. Evtl erscheint eine Fehlermeldung
_"WSL 2 erfordert ein Update der Kernelkomponente ..."_. Dann muss der
Kernel auf V2 aktualisiert werden, indem von https://aka.ms/wsl2kernel
das Update-Paket beim entsprechenden Link heruntergeladen und installiert
wird.

### Nacharbeiten zu WSL 2

Nachdem WSL 2 installiert ist, kann man sich z.B. durch `wsl --list` die
(leere) Liste der installierten Linux-Distributionen anzeigen lassen.
Hier würde z.B. angezeigt werden, sobald _Docker Desktop_ installiert ist.

Ggf. kann man noch die Konfigurationsdatei `.wslconfig` im Verzeichnis
`C:\Users\<<MEINE_KENNUNG>>` mit z.B. folgendem Inhalt anlegen:

```powershell
[wsl2]
memory=8GB # max 8 GB RAM für die VM von WSL2
processors=4
```

## Umgebungsvariable

Vorab werden die notwendigen Umgebungsvariable gesetzt, damit nicht bei jeder
nachfolgenden Installation immer wieder einzelne Umgebungsvariable gesetzt werden
müssen.

`[Windows-Taste]` betätigen, dann als Suchstring `Systemumgebungsvariablen bearbeiten`
eingeben und auswählen.

Bei _Systemvariable_ (**nicht** bei _Benutzervariable_) folgende Umgebungsvariable mit den
jeweiligen Werten eintragen. Die Werte für `PATH` _vor_ Pfaden mit Leerzeichen
eintragen.

| Name der Umgebungsvariable | Wert der Umgebungsvariable
|----------------------------|-
| `GIT_HOME` | `C:\Zimmermann\git`
| `GRAPHVIZ_DOT` | `C:\Zimmermann\Graphviz\bin\dot.exe`
| `HOME` | `C:\Users\<<MEINE_KENNUNG>>`
| `NPM_CONFIG_PREFIX` | `C:\Zimmermann\npm-config`
| `PATH` | `%NPM_CONFIG_PREFIX%` <br /> `C:\Zimmermann\node` <br /> `%GIT_HOME%\cmd` <br /> `%GIT_HOME%\bin` <br /> `C:\Zimmermann\Python` <br /> `C:\Zimmermann\Graphviz\bin`

## ZIP-Datei

`C:\Zimmermann\Git`, `C:\Zimmermann\node`, `C:\Zimmermann\npm-cache` und
`C:\Zimmermann\npm-config` löschen, falls sie noch von letztem Semester vorhanden
sind. Von ILIAS packt man die ZIP-Datei `Zimmermann.zip` unter `C:\Zimmermann` aus
und benennt ggf. `C:\Zimmermann\volumes.SWE` in `C:\Zimmermann\volumes` um.

`C:\Zimmermann\volumes\mysql\phpmyadmin-etc\config.inc.phpXXX` muss man noch
umbenennen in `C:\Zimmermann\volumes\mysql\phpmyadmin-etc\config.inc.php`.

## Docker Desktop

### Docker Desktop deinstallieren

Falls aus bereits eine alte Version von Docker Desktop installiert ist, sollte
man diese zuerst deinstallieren:

```powershell
# Ueberpruefen, dass keine Container laufen:
docker ps --all

# vorhandene Container ggf. beenden und entfernen:
docker kill <container-id>
docker rm <container-id>

# Alle Images und alle anonymen Volumes loeschen
docker system prune --volumes --all
```

Jetzt kann man über `[Windows-Taste]` und `Apps und Features` das Produkt
Docker Desktop deinstallieren.

Dabei bleiben evtl. alte (Konfigurations-) Dateien erhalten, die man entfernen
sollte, um mit einem sauberen Entwicklungsstand zu starten. Dazu muss man über
den _Task-Manager_ (`<Strg><Alt><Delete>`) evtl. den Dienst _Docker Desktop_ und
sonstige Dienste, bei denen im Namen "docker" enthalten ist, beenden. Nun kann
man mit den nachfolgenden Kommandos noch evtl. vorhandene Verzeichnisse löschen:

```powershell
Remove-Item -Force $env:USERPROFILE\.docker -Recurse
Remove-Item -Force $env:USERPROFILE\.kube -Recurse
Remove-Item -Force $env:LOCALAPPDATA\Docker -Recurse
Remove-Item -Force $env:APPDATA\Docker -Recurse
Remove-Item -Force $env:APPDATA\'Docker Desktop' -Recurse
```

Für weitere Verzeichnisse sind Administrator-Rechte notwendig und es wird
angenommen, dass der Administrator-User, mit dem ursprünglich Docker Desktop
installiert wurde, `Administrator` heißt. Dann kann man in einer PowerShell
unter dem User `Administrator` folgende Kommandos absetzen:

```powershell
Remove-Item -Force 'C:\Program Files\Docker' -Recurse
Remove-Item -Force C:\ProgramData\DockerDesktop -Recurse
Remove-Item -Force C:\ProgramData\Docker
Remove-Item -Force C:\Users\Administrator\.docker -Recurse
Remove-Item -Force C:\Users\Administrator\.kube
Remove-Item -Force C:\Users\Administrator\AppData\Local\Docker -Recurse
Remove-Item -Force C:\Users\${env:USERNAME}\AppData\Local\'Docker Desktop Installer'
Remove-Item -Force C:\Users\Administrator\AppData\Roaming\Docker -Recurse
Remove-Item -Force C:\Users\Administrator\AppData\Roaming\'Docker Desktop' -Recurse
Remove-Item -Force C:\Users\${env:USERNAME}\Desktop\'Docker Desktop.lnk'
```

### Docker Desktop installieren und konfigurieren

Die _Community Edition_ von _Docker Desktop for Windows_ kann man von
https://docs.docker.com/desktop/windows/install herunterladen
und installieren. Dabei wird die Umgebungsvariable `PATH` um den Eintrag
`C:\Program Files\Docker\Docker\resources\bin` ergänzt.

Über das Settings-Icon in der Menüleiste sollte man dann im Unterpunkt
_General_ den Haken bei _Use Docker Compose V2_ setzen,
damit die neue Go-Implementierung statt der alten Python-Implementierung
genutzt wird.

### Docker Desktop starten und testen

_Docker Desktop_ startet man folgendermaßen:

- Im Explorer in das Verzeichnis `C:\Program Files\Docker\Docker` wechseln.
- `Docker Desktop.exe` als `Administrator` ausführen, d.h. Doppelklick, falls
  man eine Benutzerkennung mit Administrator-Rechten benutzt oder die rechte
  Maustaste für das Kontextmenü benutzen und _Als Administrator ausführen_
  auswählen.

Im _System Tray_ (rechts unten in der _Taskleiste_) ist nun das Docker-Icon
(_Whale_) zu sehen. Es ist empfehlenswert, eine Verknüpfung zu
`Docker Desktop.exe` in der Taskleiste oder im Startmenü einzurichten.

Jetzt kann man mit dem nachfolgenden Kommando einen einfachen Test
durchführen und sich Informationen zur installierten Version einschließlich
Docker Compose ausgeben lassen:

```powershell
Get-Command docker
docker version
docker info
docker run --rm hello-world
docker compose version
docker buildx version
docker scout version
```

`docker info` zeigt dabei u.a. die Plugins _buildx_, _compose_ und _sbom_ an.

Mit dem nachfolgenden Kommando wird ein Docker-Container mit dem Docker-Image
für das Betriebssystem _Alpine Linux_ gestartet und durch das Linux-Kommando
`uname -a` wird die Information zum (Unix-) Betriebssystem ermittelt und
abschließend der Container beendet:

```powershell
docker run --rm busybox:1.36.1 uname -a
```

### Docker Images

Die nachfolgenden Kommandos werden in einer neuen Powershell abgesetzt, um Images
zu installieren:

```powershell
docker pull docker/dockerfile:1.10.0
docker pull hadolint/hadolint:2.12.1-beta-debian
docker pull wagoodman/dive:v0.12.0
docker pull node:22.9.0-bookworm-slim
docker pull node:22.9.0-alpine3.20
docker pull postgres:16.4-bookworm
docker pull dpage/pgadmin4:8.12.0
docker pull mysql:9.0.1-oracle
docker pull phpmyadmin:5.2.1
docker pull quay.io/keycloak/keycloak:25.0.6-0
docker pull jenkins/jenkins:2.478-jdk21
docker pull docker:27.3.1-dind
docker pull sonarqube:10.6.0-community
docker pull gessnerfl/fake-smtp-server:2.4.0
```

### Docker Dashboard

Falls man das _Docker Dashboard_ geschlossen hat, kann man es wieder öffnen,
indem man das Whale-Icon (s.o.) im _System Tray_ anklickt. Im Menüpunkt
_Images_ kann man die oben installierten Images sehen, wie z.B. das Image
für gcr.io/paketo-buildpacks/nodejs.

## Build Tools für Visual Studio 2022

Die _Build Tools_ mit insbesondere dem C++ Compiler sind für _node-gyp_, _re2_
und _argon2_ erforderlich.

_Build Tools_ kann man von https://visualstudio.microsoft.com/de/downloads herunterladen.
Wenn man die heruntergeladene `.exe`-Datei ausführt, wählt man _Desktopentwicklung mit C++_,
_Windows 11 SDK_ und _Windows 10 SDK_ aus, indem man den Haken in der jeweiligen Checkbox
setzt und auf den Button _Installieren_ klickt.

## Git

### .gitconfig

Falls es die Datei `C:\Users\<<MEINE_KENNUNG>>\.gitconfig` nicht gibt,
wird sie durch diese beiden Kommandos in der Powershell erstellt und verwendet
dabei den eigenen Namen und die eigene Email-Adresse:

```powershell
git config --global user.name "Max Mustermann"
git config --global user.email Max.Mustermann@beispiel.de
```

Anschließend kann man `C:\Users\<<MEINE_KENNUNG>>\.gitconfig`
in einem Editor ggf. um folgende Zeilen ergänzen:

```text
[push]
    default = simple
```

### Git testen

In einer neuen Powershell folgendes Kommando eingeben:

```powershell
Get-Command git
git --version
```

## Node

In einer Powershell die nachfolgenden Kommandos eingeben:

```powershell
Get-Command node
node --version
Get-Command npm
npm --version
```

## Visual Studio Code

### Installation

Visual Studio Code kann man von https://code.visualstudio.com/Download herunterladen.

Natürlich kann auch WebStorm, IntelliJ IDEA, Visual Studio oder ... benutzt werden.

### Erweiterungen

Installation von _Erweiterungen_ (Menüpunkt am linken Rand), z.B.:

```text
Apollo GraphQL
AsciiDoc
Better Comments
Docker
DotENV
Error Lens
ESLint
German Language Pack for Visual Studio Code
GitLens
Git Graph
Git History
GraphQL: Language Feature Support
JavaScript and TypeScript Nightly
Jest Runner
MarkdownLint
Material Icon Theme
opensslutils
PlantUML
Postman
Prettier - Code formatter
Pretty TypeScript Errors
SQLite Viewer
TypeScript Importer
Version Lens
YAML
```

Dazu ein KI-Werkzeug, wie z.B.

```
IntelliCode
GitHub Copilot
ChatGPT - EasyCode
Tabnine AI Autocomplete for Javascript, Python, Typescript, PHP, Go, Java, Ruby & more
```

### Einstellungen

Man öffnet die Einstellungen über das Icon am linken Rand ganz unten und wählt den
Menüpunkt `Einstellungen` oder `Settings`. Danach im Suchfeld folgendes eingeben
und jeweils den Haken setzen:

- editor.foldingImportsByDefault
- eslint.enable
- typescript.inlayHints.variableTypes.enabled
- typescript.inlayHints.propertyDeclarationTypes.enabled
- typescript.inlayHints.parameterTypes.enabled
- typescript.inlayHints.functionLikeReturnTypes.enabled

## Postman

Um _Postman_ für z.B. interaktive REST- oder GraphQL-Requests zu nutzen, muss
man sich bei https://www.postman.com registrieren und kann danach die
Desktop-Application _Postman_ von https://www.postman.com/downloads herunterladen
und installieren.
