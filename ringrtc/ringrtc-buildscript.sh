#!/bin/bash

export PATH=/home/user/signal-desktop-builder/ringrtc/depot_tools/:/opt/node/bin/:$PATH
cd ringrtc
mkdir .cargo
cat << EOF > .cargo/config.toml
[target.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"
EOF 

source ~/.cargo/env

rustup toolchain install 1.51.0
rustup default 1.51.0
rustup target add aarch64-unknown-linux-gnu
make electron PLATFORM=unix NODEJS_ARCH=arm64
# This file doesn't exist until the above has failed...
./src/webrtc/src/build/linux/sysroot_scripts/install-sysroot.py --arch=arm64
make electron PLATFORM=unix NODEJS_ARCH=arm64
