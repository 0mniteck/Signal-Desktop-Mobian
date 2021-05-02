# Signal Desktop Builder
This project allows building Signal Desktop for Debian 11 on ARM64.
It is currently a work in progress, with the goal of building a flatpak
which provides Signal Desktop.

# Current Status:
* [x] Signal Desktop building
    * Issue getting typescript module for libsignal-client
* [x] libsignal-client builds
    * Specific version from Signal-Desktops package.json
    * Force update neon dependancy.
* [x] zkgroup builds
    * No patching required. Current release builds fine on arm64
* [ ] ringrtc builds
* [x] Bundle zxgroup with Signal-Desktop directory output
* [ ] Bundle ringrtc with Signal-Desktop directory output
* [ ] flatpak

# See also:
https://github.com/lsfxz/ringrtc/tree/aarch64
https://gitlab.com/undef1/Snippets/-/snippets/2100495
https://gitlab.com/ohfp/pinebookpro-things/-/tree/master/signal-desktop

# Successful builds:
* 5.0.0-beta1
* 5.1.0-beta.5
