![alt text](https://signal.org/assets/header/logo-f7ef605fe417d5520d38d546b3b774b4261c75220b9904da4d8b2ffc19a761ff.png)

# Signal Desktop Builder

This project builds Signal Desktop for Mobian on Arm64, currently targeting branch 5.9.x,
but the aim is to keep up with the standard release schedule +1 day for build time.

This is the release for 5.9.0, `builds/release/signal-desktop_5.9.0_arm64.deb`.

## Current Status:
* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] zkgroup builds
* [x] ringrtc builds
* [x] Bundle all builds and outputs

## Usage:
1. Build with docker: `sudo ./buildscript.sh`, it takes about 3.5 hours.
2. Copy `builds/release/signal-desktop_5.9.x_arm64.deb` to your device and install.

## See also:
* Included buildscript-demo.cast, it's an asciinema demo file.
* https://wiki.mobian-project.org/doku.php?id=signal
* https://gitlab.com/undef1/Snippets/-/snippets/2100495
* https://gitlab.com/ohfp/pinebookpro-things/-/tree/master/signal-desktop

## Successful builds:
* 5.7.1
* 5.8.0
* 5.9.0
