#!/bin/bash

git status && git add -A && git status
git commit -a -S -m "Successful Build of Signed Release 7.5.0" && git push --set-upstream origin master
