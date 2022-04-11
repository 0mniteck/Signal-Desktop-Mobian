#!/bin/bash

apt install snapd

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./re-run.sh
ls -la builds/release/

snap remove --purge docker
