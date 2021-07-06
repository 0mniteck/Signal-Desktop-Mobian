#!/bin/bash

echo "Starting Build on "$(date)
echo
echo "Entering ringrtc"
pushd ringrtc
./re-run.sh
popd
./re-run.sh
echo "Build Complete on "$(date)
echo "If all went well, the files are in builds/release/"
ls -la builds/release/
