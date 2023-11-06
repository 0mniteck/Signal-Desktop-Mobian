#!/bin/bash

snap remove docker --purge && snap install docker && ufw disable && sleep 10 && docker run --cpus=$(nproc) --rm --privileged multiarch/qemu-user-static --reset -p yes && docker build -t pinephone . && docker run --cpus=$(nproc) --name pinephone -it pinephone bash -c /signal-buildscript.sh && rm -fr builds/release/ && mkdir -p builds/release && docker cp pinephone:/Signal-Desktop/release/ builds/ && ufw enable && rm -fr builds/release/linux-* && git status && git add -A && git status && git commit -a -S -m "Successful Build of Signed Release 6.37.0" && git push
