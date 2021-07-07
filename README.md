# Signal Desktop Builder
This project builds Signal Desktop for Mobian on Arm64, targeting release 5.7.x.

This is it the official release 5.7.1, provided by builds/release/signal-desktop_5.7.1_arm64.deb.

## Current Status:
* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] zkgroup builds
* [x] ringrtc builds(or use prebuild provided)
* [x] Bundle all builds and outputs

## Usage:
1. Build docker container: `sudo ./buildscript.sh` about 10 minutes.
2. Build ringrtc: `/ringrtc-buildscript.sh` then `exit` about 1 hour.
3. Build signal-desktop: `/signal-buildscript.sh` then `exit` about 2 hours.
4. Copy the output from `builds/release/` to your device and install.
5. Copy launcher to `/usr/bin/signal` on your device, and launch by running `signal`.

## See also:
* Included buildscript-demo.cast file is an asciinema demo file, watch it if you need help.
* https://wiki.mobian-project.org/doku.php?id=signal
* https://gitlab.com/undef1/Snippets/-/snippets/2100495
* https://gitlab.com/ohfp/pinebookpro-things/-/tree/master/signal-desktop

## Successful builds:
* 5.7.1
