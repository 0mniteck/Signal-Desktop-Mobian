# Signal Desktop Builder
This project allows building Signal Desktop for Debian 11 on ARM64.
It is currently a work in progress, with the goal of building a flatpak
which provides Signal Desktop.

## Current Status:
* [x] Signal Desktop building
    * Issue getting typescript module for libsignal-client
* [x] libsignal-client builds
    * Specific version from Signal-Desktops package.json
    * Force update neon dependancy.
* [x] zkgroup builds
    * No patching required. Current release builds fine on arm64
* [x] ringrtc builds (note: this is done on the host)
* [x] Bundle zxgroup with Signal-Desktop directory output
* [x] Bundle ringrtc with Signal-Desktop directory output
* [ ] flatpak
* [x] Wayland

## Usage
1. Build ringrtc in the ringrtc directory.
2. Copy libringrtc-arm64.node to this directory.
3. Build the docker container: `sudo docker build .`
4. Shell into the docker container: `sudo docker run -it <container>`
5. Run the build script: `/signal-buildscript.sh`
6. Copy the output application from the container (from outside container): `sudo docker cp <container>:/Signal-Desktop/release/<output folder>`
7. Install RingRTC as below.
8. Copy to your Debian Arm64 device.

## Launcher
The included `signal` shell script provides both a launcher and sandboxing with Bubblewrap.

## RingRTC
Building RingRTC is hard and will be included in later versions of this repository. 
For now, `libringrtc.node` can be manually installed to `/opt/signal/resources/app.asar.unpacked/node_modules/ringrtc/build/linux/libringrtc.node`.

If you want to manually build this, instructions are in the snippet below.

## See also:
https://github.com/lsfxz/ringrtc/tree/aarch64  
https://gitlab.com/undef1/Snippets/-/snippets/2100495  
https://gitlab.com/ohfp/pinebookpro-things/-/tree/master/signal-desktop  

## Successful builds:
* 5.0.0-beta1
* 5.1.0-beta.5
* 5.5.0-beta.1 - Note: wayland currently broken on this release
