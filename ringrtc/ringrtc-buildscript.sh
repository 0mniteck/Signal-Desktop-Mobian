#!/bin/bash

source $HOME/.cargo/env
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 14.16.0

cd ringrtc
mkdir .cargo
touch .cargo/config.toml
cat << EOF > .cargo/config.toml
[target.aarch64-unknown-linux-gnu]
linker = "aarch64-linux-gnu-gcc"
EOF

rustup toolchain install nightly-2021-06-08
rustup default nightly-2021-06-08
rustup target add aarch64-unknown-linux-gnu
make electron PLATFORM=unix NODEJS_ARCH=arm64
./src/webrtc/src/build/linux/sysroot_scripts/install-sysroot.py --arch=arm64
make electron PLATFORM=unix NODEJS_ARCH=arm64
cp src/node/build/linux/libringrtc-arm64.node /libringrtc-arm64.node

ls -la /libringrtc-arm64.node
