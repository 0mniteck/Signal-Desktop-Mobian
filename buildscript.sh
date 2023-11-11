#!/bin/bash

git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git

sudo apt install snapd bc screen

echo "Starting Build "$(date -u '+on %D at %R UTC')
echo

./increment.sh
sudo screen bash -c './re-run.sh'
ls -la builds/release/

git status && git add -A && git status
read -p "Continue -->"
git commit -a -S -m "Successful Build of Signed Release 6.37.0" && git push
