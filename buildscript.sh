#!/bin/bash

echo "Starting Build on "$(date)
echo
# echo "Using prebuild ringrtc to save time, but you can uncomment lines 6-9 to run it manually."
echo "Entering ringrtc/"
pushd ringrtc
./re-run.sh
popd
ls -la
./re-run.sh
echo "Build Complete on "$(date)
echo "If all went well, the files are in builds/release/"
ls -la builds/release/
snap remove --purge docker
