#!/bin/bash

sudo apt install snapd bc screen git git-lfs -y

git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git
git-lfs install

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh
sudo screen -L -Logfile /tmp/builder.log bash -c './re-run.sh public'
cp /tmp/builder.log builds/release/builder.log && rm -f /tmp/builder.log
ls -la builds/release/

./git.sh
cd ..
