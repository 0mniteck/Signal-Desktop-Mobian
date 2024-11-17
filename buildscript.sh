#!/bin/bash

sudo apt install bc git-lfs screen snapd systemd-cryptsetup -y
snap install grype --classic

git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git
git-lfs install

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh $1
sudo screen -L -Logfile /tmp/builder.log bash -c './re-run.sh public '$(($2))' '$3
cp /tmp/builder.log builds/release/builder.log && rm -f /tmp/builder.log
echo "# Base Build System: $(uname -o) $(uname -r) $(uname -p) $(lsb_release -ds) $(lsb_release -cs) $(uname -v)"  >> builds/release/release.sha512sum
awk '{a[i++]=$0}END{for(j=0;j<i-2;j++)print a[j];print a[i-1];print a[i-2]}' builds/release/release.sha512sum > tmp && mv tmp builds/release/release.sha512sum
ls -la builds/release/

./git.sh $4 $5
cd ..
