#!/bin/bash

# DEPS
sudo apt install -y vim python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu crossbuild-essential-arm64
sudo mkdir -p /usr/include/aarch64-linux-gnu/
# pulled from https://raw.githubusercontent.com/node-ffi-napi/node-ffi-napi/master/deps/libffi/config/linux/arm64/fficonfig.h because its not in debian
sudo cp ../fficonfig.h /usr/include/aarch64-linux-gnu/ 
chmod +x rustup-init
./rustup-init -y

# Clone ringrtc
# Fork by privacyshark. You should check this before trusting it.
git clone https://github.com/signalapp/ringrtc
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH=$(pwd)/depot_tools:$PATH

# NODE
# Goes last because docker build can't cache the tar.
# https://nodejs.org/dist/v14.15.5/
cp ../node-v14.16.0-linux-x64.tar.gz /opt/
mkdir -p /opt/node
pushd /opt/; tar xf node-v14.16.0-linux-x64.tar.gz
mv /opt/node-v14.16.0-linux-x64/* /opt/node/
export PATH=/opt/node/bin:$PATH
npm install --global yarn
popd

#
