#!/bin/bash

snap disable docker
rm -f -r /var/snap/docker/*
if [ "$3" = "yes" ]; then
  umount -f /dev/mapper/Luks-Signal
  sleep 5
  systemd-cryptsetup detach Luks-Signal
fi
rm -f -r /var/snap/docker
sleep 5
snap remove docker --purge
if [ "$3" = "yes" ]; then
  systemd-cryptsetup attach Luks-Signal /dev/mmcblk1
fi
snap install grype --classic
mkdir /var/snap/docker
if [ "$3" = "yes" ]; then
  mount /dev/mapper/Luks-Signal /var/snap/docker
  rm -f -r /var/snap/docker/*
fi
chown root:root /var/snap/docker
snap install docker --revision=2936 && ufw disable && sleep 5
if [ -f /etc/keys/.private.key ]; then
  echo "Loading buildtool private keys..."
  cp /etc/keys/.private.key .private.key
fi

source_date_epoch=1
if [ "$2" != 0 ]; then
  echo "Using override timestamp for SOURCE_DATE_EPOCH."
  source_date_epoch=$(($2))
else
  git_timestamp=$(git log -1 7.20.0 --pretty=%ct)
  if [ "${git_timestamp}" != "" ]; then
    echo "Setting SOURCE_DATE_EPOCH from commit: $(git log -1 7.20.0 --oneline)"
    source_date_epoch=$((git_timestamp))
  else
    echo "Can't get latest commit timestamp. Defaulting to 1."
    source_date_epoch=1
  fi
fi

docker build -t signal-desktop \
  --build-arg SOURCE_DATE_EPOCH=$source_date_epoch \
  --build-arg NODE_VERSION=20.18.0 \
  --build-arg NVM_VERSION=0.40.1 \
  --build-arg NPM_VERSION=10.2.5 .

shred .private.key && rm -f .private.key

docker run -it --cpus=$(nproc) \
  --name signal-desktop \
  --user "$(id -u):$(id -g)" \
  -e NPM_CONFIG_CACHE=/tmp/.npm-cache \
  -e SOURCE_DATE_EPOCH=$source_date_epoch \
  signal-desktop $1 $4

rm -fr builds/release/ && mkdir -p builds/release && docker cp signal-desktop:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*
grype sbom:builds/release/manifest.spdx.json -o json > builds/release/manifest.grype.json

snap disable docker
rm -f -r /var/snap/docker/*
if [ "$3" = "yes" ]; then
  umount -f /dev/mapper/Luks-Signal
  sleep 5
  systemd-cryptsetup detach Luks-Signal
fi
rm -f -r /var/snap/docker
sleep 5
snap remove docker --purge
snap remove docker --purge
ufw -f enable
snap remove grype --purge && rm -f -r $HOME/.cache/grype/
read -p "Close Screen Session: Continue to Signing-->"
