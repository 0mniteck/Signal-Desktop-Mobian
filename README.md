![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder

## signal-desktop_5.23.0_arm64/unstable

This project builds Signal Desktop for Mobian/unstable on Arm64, currently targeting release `5.23.0`.

This is the signed release: `builds/release/signal-desktop_5.xx.0_arm64.deb`.

Signature: `builds/release/signal-desktop_5.xx.0_arm64.deb.sig`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:

1. Build with docker: `sudo ./buildscript.sh`, it takes about 3 hours.
2. Switch to Mobian/unstable.
2. Copy the `.deb` to your device and `sudo apt install ./signal-desktop_5.xx.0_arm64.deb`.

## Current Status:

* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] zkgroup builds
* [x] ringrtc builds
* [x] Bundle all builds and outputs
* [x] Sign `.deb` with keypair

## Successful Builds:

* [x] 5.23.0

## See also:

* Included buildscript-demo.cast, it's an asciinema demo file.
* https://wiki.mobian-project.org/doku.php?id=signaldesktop
* https://gitlab.com/undef1/Snippets/-/snippets/2100495
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
