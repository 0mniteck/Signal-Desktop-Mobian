![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder For Mobian

## signal-desktop_5.37.0_arm64/stable

This project builds Signal Desktop for Mobian/stable on Arm64, currently targeting release `5.37.x`.

This is the signed release: `builds/release/signal-desktop_5.xx.x_arm64.deb`.

Signature: `builds/release/signal-desktop_5.xx.x_arm64.deb.sig`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Build with docker: `sudo ./buildscript.sh`, it takes about 2.5 hours.
2. Copy the `.deb` to your device and `sudo apt install ./signal-desktop_5.xx.x_arm64.deb`.

## Current Status:

* [x] Built Mobian/stable gitlab.com/0mniteck/docker-images/
* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] ringrtc builds
* [x] Bundle all builds and outputs
* [x] Sign `.deb` with keypair

## Successful Builds:

  `+` 22 releases
  
* [x] 5.32.0
* [x] 5.34.0
* [x] 5.35.0
* [x] 5.36.0
* [x] 5.37.0

## See also:

* Included buildscript-demo.cast, it's an asciinema demo file.
* https://gitlab.com/0mniteck/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://wiki.mobian-project.org/doku.php?id=signaldesktop
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
