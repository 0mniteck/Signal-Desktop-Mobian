#!/bin/bash

rm -f -r /var/snap/docker/*
umount /dev/mapper/Luks-Signal
cryptsetup close /dev/mmcblk1
rm -f -r /var/snap/docker
snap remove docker --purge && cryptsetup open /dev/mmcblk1 Luks-Signal && mkdir /var/snap/docker && mount /dev/mapper/Luks-Signal /var/snap/docker && rm -f -r /var/snap/docker/* && snap install docker && ufw disable && sleep 10 && cp /etc/keys/.private.key .private.key && docker build -t pinephone . && shred .private.key && rm -f .private.key && docker run --cpus=$(nproc) --name pinephone -it pinephone bash -c /signal-buildscript.sh && rm -fr builds/release/ && mkdir -p builds/release && docker cp pinephone:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*
rm -f -r /var/snap/docker/*
umount /dev/mapper/Luks-Signal
cryptsetup close /dev/mmcblk1
rm -f -r /var/snap/docker
snap remove docker --purge
ufw -f enable
read -p "Continue -->"
