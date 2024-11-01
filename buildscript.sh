#!/bin/bash

sudo apt install bc git git-lfs screen snapd systemd-cryptsetup -y

git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git
git-lfs install

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh $1
sudo screen -L -Logfile /tmp/builder.log bash -c './re-run.sh public '$2' '$3
cp /tmp/builder.log builds/release/builder.log && rm -f /tmp/builder.log
ls -la builds/release/

./git.sh
cd ..
