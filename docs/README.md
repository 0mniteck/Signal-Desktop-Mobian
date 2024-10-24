![image](https://github.com/user-attachments/assets/202613c2-97b8-4b54-b72c-6f8e110f0ff4)

# Signal Desktop Builder For Mobian
[![CI](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml/badge.svg)](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml)
### [signal-desktop_7.23.0_arm64.deb](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.23.0_arm64.deb)

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting tag `7.23.x`

Now with an optional update client: [`auto-update-cron.sh`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/auto-update-cron.sh)

This is the latest release: [`builds/release/signal-desktop_7.23.0_arm64.deb`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.23.0_arm64.deb)

Sha512Sum: [`builds/release/release.sha512sum`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/release.sha512sum)

SBOM: [`builds/release/manifest.spdx.json`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/manifest.spdx.json)

Github's GPG Key ID: `B5690EEEBB952194`

0mniteck's Current GPG Key ID: `287EE837E6ED2DD3`

<sup><sup>*Vigilant Mode is on for this repo so all remote pushes should be signed with a verified key or Github's key.</sup></sup>

## Usage:

1. (optional) Clone the repo and build: `git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh`
2. Copy the `.deb` to your device, verify sha512sum, then: `sudo apt install ./signal-desktop_7.xx.x_arm64.deb`
3. (optional) To install updater download and run: `sudo ./auto-update-cron.sh`

## Current Status:

* [x] Built with [mobian:bookworm](https://salsa.debian.org/Mobian-team/docker-images/)
* [x] Signal Desktop builds
* [x] Auto-Update script
* [x] Reproducible builds
* [x] Generate SBOM at buildtime

## See also:

* https://wiki.debian.org/Mobian
* https://github.com/signalapp/Signal-Desktop/blob/main/reproducible-builds/README.md
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
* https://salsa.debian.org/mobian-team/docker-images/container_registry/
