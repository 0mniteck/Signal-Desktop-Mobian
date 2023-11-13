#!/bin/bash

sudo apt install snapd bc screen git git-lfs

git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git
git-lfs install

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh
sudo screen bash -c './re-run.sh'
ls -la builds/release/

git status && git add -A && git status
git commit -a -S -m "Successful Build of Signed Release 6.38.0" && git push --set-upstream origin master
