#!/bin/bash

cd ringrtc
rustup toolchain install 1.51.0
rustup default 1.51.0
make electron PLATFORM=unix NODEJS_ARCH=arm64
