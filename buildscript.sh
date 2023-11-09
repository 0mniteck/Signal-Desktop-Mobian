#!/bin/bash

sudo apt install snapd

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh
sudo ./re-run.sh
ls -la builds/release/

sudo snap remove --purge docker

git status && git add -A && git status
read -p "Continue -->"
git commit -a -S -m "Successful Build of Signed Release 6.37.0" && git push
