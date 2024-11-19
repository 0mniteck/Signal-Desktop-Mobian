[![image](https://github.com/user-attachments/assets/202613c2-97b8-4b54-b72c-6f8e110f0ff4)](https://signal.org)

# Signal Desktop Builder For Mobian
### [signal-desktop_7.33.0_arm64.deb](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.33.0_arm64.deb)

This project reproducibly builds Signal Desktop for Debian Bookworm on ARM64, currently targeting tag `7.33.x`

Now with an optional update client: [`auto-update-cron.sh`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/auto-update-cron.sh)

This is the latest release: [`builds/release/signal-desktop_7.33.0_arm64.deb`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/signal-desktop_7.33.0_arm64.deb)

Sha512Sum: [`builds/release/release.sha512sum`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/release.sha512sum)

SBOM: [`builds/release/manifest.spdx.json`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/manifest.spdx.json)

Vuln Scan: [`builds/release/manifest.grype.json`](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/manifest.grype.json)

0mniteck's Current GPG Key ID: `287EE837E6ED2DD3`

<sup><sup>*Vigilant Mode is on for this repo so all remote pushes/tags should be signed with a verified key.</sup></sup>

## Build Instructions/Usage:

### Build:

```
buildscript.sh:
  -i {Increment: .version}
  -d {Date: source_date_epoch}
  -m {Mount /dev/mmcblk1: yes/no}
  -p {Push-branch: debug}
  -r {Release-tag: tagname}
  -t {run-Tests: yes/no}
```
A. To build later releases run:

```
sudo su && \
git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git && \
cd Signal-Desktop-Mobian && \
./buildscript.sh -i .01 -p canary -r 7.32.0 -t yes
```

B. To build the current release for reproducibility:

```
sudo su && \
git clone git@github.com:0mniteck/Signal-Desktop-Mobian.git -b 7.33.0 && \
cd Signal-Desktop-Mobian && \
./buildscript.sh
```

### Usage:

[Download the `.deb`](https://github.com/0mniteck/Signal-Desktop-Mobian/raw/master/builds/release/signal-desktop_7.33.0_arm64.deb) to your device, verify the sha512sum, then install:

[[Current Sha512sum]](https://github.com/0mniteck/Signal-Desktop-Mobian/blob/master/builds/release/release.sha512sum#L1)
(https://github.com/0mniteck/Signal-Desktop-Mobian/blob/a63f8d6bea7ccc362a05b130873c64f798ae9abb/builds/release/release.sha512sum#L1)

```sha512sum signal-desktop_7.33.0_arm64.deb```

```sudo apt install ./signal-desktop_7.33.0_arm64.deb```

### Optional Updater:

Install updater `auto-update-cron.sh` by running:

```
sudo su && \
curl -o- https://raw.githubusercontent.com/0mniteck/Signal-Desktop-Mobian/master/auto-update-cron.sh | bash
```

## Current Status:‎‎‏‏‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎[![C I](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml/badge.svg)](https://github.com/signalapp/Signal-Desktop/actions/workflows/ci.yml)<sub><sup> signalapp/Signal-Desktop</sup></sub>

* [x] Built with [0mniteck/debian:2024-11-11](https://hub.docker.com/r/0mniteck/tags)
* [x] Signal Desktop builds
* [x] Auto-Update script
* [x] Reproducible builds
* [x] Generate/Scan SBOM at buildtime

## See also:

* https://snapshot.debian.org
* https://hub.docker.com/_/debian/tags
* https://hub.docker.com/r/0mniteck/tags
* https://github.com/signalapp/Signal-Desktop/blob/main/reproducible-builds/README.md
* https://github.com/signalapp/Signal-Desktop/blob/development/CONTRIBUTING.md
