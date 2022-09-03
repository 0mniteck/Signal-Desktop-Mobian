![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder For Mobian

## stable: signal-desktop_5.57.0_arm64.deb

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting release `5.57.x`.

This is the signed release: `builds/release/signal-desktop_5.xx.x_arm64.deb`.

Signature: `builds/release/signal-desktop_5.xx.x_arm64.deb.sig`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Build with docker: `sudo ./buildscript.sh`, it takes about 1 hour.
3. Copy the `.deb` to your device and `sudo apt install ./signal-desktop_5.xx.x_arm64.deb`.

## Current Status:

* [x] Built with mobian:bookworm gitlab.com/0mniteck/docker-images/
* [x] Signal Desktop builds
* [x] better-sqlite3 builds natively
* [x] Bundle all builds and outputs
* [x] Sign `.deb` with keypair

## Working Builds:

  `+` 33 releases

* [x] 5.45.0
* [x] 5.56.0
* [x] 5.57.0

## See also:

* Included buildscript-demo.cast, it's an asciinema demo file.
* https://gitlab.com/0mniteck/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://wiki.mobian-project.org/doku.php?id=signaldesktop
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
