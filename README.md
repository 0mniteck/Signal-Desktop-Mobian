![alt text](https://signal.org/assets/images/header/logo.png)

# Signal Desktop Builder For Mobian
### Bug currently affecting electron https://github.com/electron/electron/issues/43580 preventing build
## signal-desktop_7.23.0_arm64.deb

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting tag `7.23.x`.

Now with an optional update client: `auto-update-cron.sh`

This is the signed release: `builds/release/signal-desktop_7.xx.x_arm64.deb`

Sha512Sum: `builds/release/release.sha512sum`

Vigilant Mode is on for this repo so all remote pushes should be signed with a trusted key or Github's key.

Github's GPG Key ID: B5690EEEBB952194

0mniteck's Current GPG Key ID: 287EE837E6ED2DD3

## Usage:

1. (optional) Clone the repo and build: `git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh`
2. Copy the `.deb` to your device, verify sha512sum, then: `sudo apt install ./signal-desktop_7.xx.x_arm64.deb`
3. (optional) To install updater download and run: `sudo ./auto-update-cron.sh`

## Current Status:

* [x] Built with mobian:bookworm https://salsa.debian.org/Mobian-team/docker-images/
* [x] Signal Desktop builds
* [x] Sign `.deb` with keypair
* [x] Auto-Update script

## See also:

* https://wiki.debian.org/Mobian
* https://salsa.debian.org/mobian-team/docker-images/container_registry/
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
