#!/bin/bash

rm -f -r /var/snap/docker/*
umount -f /dev/mapper/Luks-Signal
systemd-cryptsetup detach Luks-Signal
rm -f -r /var/snap/docker
snap remove docker --purge
systemd-cryptsetup attach Luks-Signal /dev/mmcblk1 && mkdir /var/snap/docker && mount /dev/mapper/Luks-Signal /var/snap/docker && rm -f -r /var/snap/docker/* && chown root:root /var/snap/docker
snap install docker && ufw disable && sleep 10
cp /etc/keys/.private.key .private.key
docker build -t signal-desktop --build-arg SOURCE_DATE_EPOCH=1 --build-arg NODE_VERSION=20.17.0 .
shred .private.key && rm -f .private.key

source_date_epoch=1
if [ "$2" != "" ]; then
  echo "Using override timestamp for SOURCE_DATE_EPOCH."
  source_date_epoch=$(($2))
else
  git_timestamp=$(git log -1 --pretty=%ct)
  if [ "${git_timestamp}" != "" ]; then
    echo "At commit: $(git log -1 --oneline)"
    echo "Setting SOURCE_DATE_EPOCH to latest commit's timestamp."
    source_date_epoch=$((git_timestamp))
  else
    echo "Can't get latest commit timestamp. Defaulting to 1."
    source_date_epoch=1
  fi
fi

docker run -rm --cpus=$(nproc) \
  --name signal-desktop \
  --user "$(id -u):$(id -g)" \
  -e NPM_CONFIG_CACHE=/tmp/.npm-cache \
  -e SOURCE_DATE_EPOCH=$source_date_epoch \
  signal-desktop $1

rm -fr builds/release/ && mkdir -p builds/release && docker cp signal-desktop:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*
snap disable docker
rm -f -r /var/snap/docker/*
umount -f /dev/mapper/Luks-Signal
sleep 10
systemd-cryptsetup detach Luks-Signal
rm -f -r /var/snap/docker
sleep 10
snap remove docker --purge
snap remove docker --purge
ufw -f enable
read -p "Close Screen Session: Continue to Signing-->"
