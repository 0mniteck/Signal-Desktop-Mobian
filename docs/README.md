![alt text](https://camo.githubusercontent.com/6ee80e407ef4695e3c0f57bd7b9efc598c2d6629558a010b1a77ddf9803e2ea8/68747470733a2f2f7369676e616c2e6f72672f6173736574732f6865616465722f6c6f676f2d663765663630356665343137643535323064333864353436623362373734623432363163373532323062393930346461346438623266666331396137363166662e706e67)

# Signal Desktop Builder For Mobian

## signal-desktop_6.48.1_arm64.deb

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting tag `v6.48.1`.

This is the signed release: `builds/release/signal-desktop_6.xx.x_arm64.deb`.

Signature: `builds/release/signal-desktop_6.xx.x_arm64.deb.sig`.

Sha512Sum: `builds/release/release.sha512sum`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Clone the repo and build: `git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh`
3. Copy the `.deb` to your device, verify sha512sum, then: `sudo apt install ./signal-desktop_6.xx.x_arm64.deb`.

## Current Status:

* [x] Built with mobian:bookworm https://salsa.debian.org/Mobian-team/docker-images/
* [x] Signal Desktop builds
* [x] Sign `.deb` with keypair

## See also:

* https://wiki.debian.org/Mobian
* https://salsa.debian.org/mobian-team/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
