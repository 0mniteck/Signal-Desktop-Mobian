# Signal Desktop Builder
This project builds Signal Desktop for Mobian on Arm64, targeting release 5.7.x. The goal of this project is to provide a working .deb package.

## Current Status:
* [x] Signal Desktop builds
* [x] libsignal-client builds
* [x] better-sqlite3 builds
* [x] zkgroup builds
* [x] ringrtc builds(or use prebuild provided)
* [x] Bundle all builds and outputs
* [ ] Launcher works

## Usage:
1. Build docker container: `sudo ./buildscript.sh` about 10 minutes.
2. Build ringrtc: `/ringrtc-buildscript.sh` then `exit` about 1 hour.
3. Build signal-desktop: `/signal-buildscript.sh` then `exit` about 2 hours.
4. Copy the output from `builds/release/` to your Mobian Arm64 device.

## Launcher: ( Testing )
The included `signal` shell script provides both a launcher and sandboxing with Bubblewrap, but needs to be tested.

## See also:
* https://wiki.mobian-project.org/doku.php?id=signal
* https://gitlab.com/undef1/Snippets/-/snippets/2100495
* https://gitlab.com/ohfp/pinebookpro-things/-/tree/master/signal-desktop

## Successful builds:
* 5.7.1 (Testing)
