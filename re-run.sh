#!/bin/bash

snap remove docker --purge && snap install docker && ufw disable && sleep 10 && cp /etc/keys/.private.key .private.key && docker build -t pinephone . && docker run --cpus=$(nproc) --name pinephone -it pinephone bash -c /signal-buildscript.sh && shred .private.key && rm -fr builds/release/ && mkdir -p builds/release && docker cp pinephone:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-* && snap remove docker --purge
ufw -f enable
read -p "Continue -->"
