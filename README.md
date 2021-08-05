![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder

This project builds Signal Desktop for Mobian on Arm64, currently targeting branch `5.12.x`.

The aim is to keep up with the standard release schedule plus a few hours for build time.

This is the signed release for `5.12.2`: `builds/release/signal-desktop_5.12.2_arm64.deb`.

Signature: `builds/release/signal-desktop_5.12.2_arm64.deb.sig`.

Public Key: `0558260a88ff08f8dddf791fe73b9457917830506be3d8dbc1311e8d769c5ac777`

## Usage:
1. Build with docker: `sudo ./buildscript.sh`, it takes about 3 hours.
2. Copy the `.deb` to your device and `sudo apt install ./signal-desktop_5.12.2_arm64.deb`.

## Current Status:
* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] zkgroup builds
* [x] ringrtc builds
* [x] Bundle all builds and outputs
* [x] Sign `.deb` with keypair

## Successful Builds:
* `5.7.1`
* `5.8.0`
* `5.9.0`
* `5.10.0`
* `5.11.0` - (Signed)
* `5.12.0` - (Signed)
* `5.12.2` - (Signed)

## See also:
* Included buildscript-demo.cast, it's an asciinema demo file.
* https://wiki.mobian-project.org/doku.php?id=signaldesktop
* https://gitlab.com/undef1/Snippets/-/snippets/2100495
* https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/PKGBUILD
