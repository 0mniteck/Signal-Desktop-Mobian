![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder For Mobian

## stable: signal-desktop_6.12.0_arm64.deb

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting release `6.12.x`.

This is the signed release: `builds/release/signal-desktop_6.xx.x_arm64.deb`.

Signature: `builds/release/signal-desktop_6.xx.x_arm64.deb.sig`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Build with docker: `sudo ./buildscript.sh`, it takes about 1 hour.
3. Copy the `.deb` to your device and `sudo apt install ./signal-desktop_6.xx.x_arm64.deb`.

## Current Status:

* [x] Built with mobian:bookworm https://salsa.debian.org/Mobian-team/docker-images/
* [x] Signal Desktop builds
* [x] Sign `.deb` with keypair

## Working Builds:

  `+` 41 releases

* [ ] 6.4.1
* [ ] 6.5.0
* [ ] 6.10.0
* [ ] 6.11.0
* [ ] 6.12.0

* [x] = tested

## See also:

* Included buildscript-demo.cast, it's an asciinema demo file.
* https://salsa.debian.org/mobian-team/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://wiki.mobian-project.org/doku.php?id=signaldesktop
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
