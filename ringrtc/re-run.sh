#!/bin/bash

snap remove docker --purge && snap install docker && sleep 10 && docker build -t pinephone . && docker run --cpus=$(nproc) --name pinephone -it pinephone bash -c /ringrtc-buildscript.sh && rm -f ../libringrtc-arm64.node && docker cp pinephone:/libringrtc-arm64.node /tmp/libringrtc-arm64.node && mv /tmp/snap.docker/tmp/libringrtc-arm64.node ../libringrtc-arm64.node
