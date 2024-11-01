[![image](https://github.com/user-attachments/assets/202613c2-97b8-4b54-b72c-6f8e110f0ff4)](https://signal.org)

# Signal Desktop Builder For Mobian
### [signal-desktop_7.31.0_arm64.deb](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.31.0_arm64.deb)

This project builds Signal Desktop for Mobian Bookworm on Arm64, currently targeting tag `7.31.x`

Now with an optional update client: [`auto-update-cron.sh`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/auto-update-cron.sh)

This is the latest release: [`builds/release/signal-desktop_7.31.0_arm64.deb`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.31.0_arm64.deb)

Sha512Sum: [`builds/release/release.sha512sum`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/release.sha512sum)

SBOM: [`builds/release/manifest.spdx.json`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/manifest.spdx.json)

Github's GPG Key ID: `B5690EEEBB952194`

0mniteck's Current GPG Key ID: `287EE837E6ED2DD3`

<sup><sup>*Vigilant Mode is on for this repo so all remote pushes should be signed with a verified key or Github's key.</sup></sup>

## Build Instructions/Usage:

### Build:

A. To build later releases clone the repo and run - 

`buildscript.sh {version: +increment} {time: source_date_epoch} {yes/no: mount /dev/mmcblk1}`:

ex. ```sudo su && git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh .01 1723852093 no```

B. or to build the current release for reproducibility:

```sudo su && git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && cd Signal-Desktop-Mobian && ./buildscript.sh```

### Usage:

Copy the `.deb` to your device, verify the sha512sum, then install:

[[Current Sha512sum]](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/release.sha512sum#L1)
(https://github.com/0mniteck/Signal-Desktop-Mobian/blob/a63f8d6bea7ccc362a05b130873c64f798ae9abb/builds/release/release.sha512sum#L1)

```sha512sum signal-desktop_7.31.0_arm64.deb```

```sudo apt install ./signal-desktop_7.31.0_arm64.deb```

### Optional Updater:

Install updater `auto-update-cron.sh` by running:

```sudo su && curl -o- https://raw.githubusercontent.com/0mniteck/Signal-Desktop-Mobian/master/auto-update-cron.sh | bash```

## Current Status:‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‎‏‏‎ ‎[![C I](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml/badge.svg)](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml)<sub><sup> signalapp/Signal-Desktop</sup></sub>

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
