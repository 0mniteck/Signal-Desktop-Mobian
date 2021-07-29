#!/bin/bash

apt install snapd

echo "Starting Build on "$(date)
echo

echo "Entering ringrtc/"
pushd ringrtc
# ./re-run.sh
popd
ls -la libringrtc-arm64.node

./re-run.sh
ls -la builds/release/

snap remove --purge docker
