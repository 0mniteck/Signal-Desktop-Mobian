#!/bin/bash

snap remove docker --purge && snap install docker && sleep 10 && docker run --rm --privileged multiarch/qemu-user-static --reset -p yes && docker build -t pinephone . && docker run --name pinephone -it pinephone bash -c /signal-buildscript.sh && rm -fr builds/release/ && mkdir -p builds/release && docker cp pinephone:/Signal-Desktop/release/ builds/
