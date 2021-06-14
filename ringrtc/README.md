# RingRTC Builder

## Usage
1. Run setup.sh. This will prompt for root privileges to install build dependancies.
2. Source .cargo/env to set up rust
3. Run ringrtc-builder.sh.

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
