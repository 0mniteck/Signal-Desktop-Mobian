#!/bin/bash

git status && git add -A && git status
git commit -a -S -m "Successful Build of Reproducible Release 7.31.0" && git push --set-upstream origin master
