![alt text](https://signal.org/assets/images/header/logo.png)

# Signal Desktop Builder For Mobian

## signal-desktop_7.5.1_arm64.deb

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting tag `7.5.x`.

This is the signed release: `builds/release/signal-desktop_7.xx.x_arm64.deb`.

Signature: `builds/release/signal-desktop_7.xx.x_arm64.deb.sig`.

Sha512Sum: `builds/release/release.sha512sum`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917.50506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Clone the repo and build: `git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh`
3. Copy the `.deb` to your device, verify sha512sum, then: `sudo apt install ./signal-desktop_7.xx.x_arm64.deb`.

## Current Status:

* [x] Built with mobian:bookworm https://salsa.debian.org/Mobian-team/docker-images/
* [x] Signal Desktop builds
* [x] Sign `.deb` with keypair

## See also:

* https://wiki.debian.org/Mobian
* https://salsa.debian.org/mobian-team/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
