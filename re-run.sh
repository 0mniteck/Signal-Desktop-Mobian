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
mkdir /var/snap/docker
if [ "$3" = "yes" ]; then
  mount /dev/mapper/Luks-Signal /var/snap/docker
  rm -f -r /var/snap/docker/*
fi
chown root:root /var/snap/docker
if [ -f /etc/keys/.private.key ]; then
  echo "Loading buildtool private keys..."
  cp /etc/keys/.private.key .private.key
fi

source_date_epoch=1
if [ "$2" != 0 ]; then
  echo "Using override timestamp for SOURCE_DATE_EPOCH."
  source_date_epoch=$(($2))
else
  git_timestamp=$(git log -1 7.36.0 --pretty=%ct)
  if [ "${git_timestamp}" != "" ]; then
    echo "Setting SOURCE_DATE_EPOCH from commit: $(git log -1 7.36.0 --oneline)"
    source_date_epoch=$((git_timestamp))
  else
    echo "Can't get latest commit timestamp. Defaulting to 1."
    source_date_epoch=1
  fi
fi

snap install docker --revision=3065
docker buildx create --name signal-builder --driver-opt "network=host" --bootstrap --use
docker buildx build --tag signal-desktop --load \
  --build-arg SOURCE_DATE_EPOCH=$source_date_epoch \
  --build-arg SOURCE=0mniteck/debian-slim:03-17-2025@sha256:81999bb4392c46ce50b4649dc45cdfe75435e15a89d381aefa871eb285ddf454 \
  --build-arg NODE_VERSION=22.14.0 \
  --build-arg NVM_VERSION=0.40.2 \
  --build-arg PNPM_VERSION=10.3.0 .

shred .private.key && rm -f .private.key

docker run -it --cpus=$(nproc) \
  --name signal-desktop \
  --user "$(id -u):$(id -g)" \
  -e NPM_CONFIG_CACHE=/tmp/.npm-cache \
  -e SOURCE_DATE_EPOCH=$source_date_epoch \
  signal-desktop $1 $4

rm -fr builds/release/ && mkdir -p builds/release && docker cp signal-desktop:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*

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
networkctl delete docker0
snap install grype --classic && grype sbom:builds/release/manifest.spdx.json -o json > builds/release/manifest.grype.json
snap remove grype --purge
rm /root/getter* -f -r && rm /root/grype-scratch* -f -r && rm /root/5 -f -r && rm -f -r $HOME/.cache/grype && rm -f -r /tmp/grype-scratch*
read -p "Close Screen Session: Continue to Signing-->"
