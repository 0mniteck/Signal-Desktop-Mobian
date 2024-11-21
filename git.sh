#!/bin/bash

GPG_TTY=$(tty)
export GPG_TTY
eval `ssh-agent -s`
ssh-add $HOME/.ssh/id_ecdsa_s*[!.pub]
git status && git add -A && git status
git commit -a -S -m "Successful Build of Reproducible Release 7.34.0" && git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD):$1
if [ "$2" != "" ]; then
  git tag -a "$2" -s -m "Tagged Release $2" && sleep 5 && git push origin "$2"
fi
