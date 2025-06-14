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
rm -f -r /var/lib/snapd/cache/*
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
  timestamp=$(cat builds/release/release.sha512sum | grep Epoch | cut -d ' ' -f5)
  if [ "${timestamp}" != "" ]; then
    echo "Setting SOURCE_DATE_EPOCH from release.sha512sum: $(cat builds/release/release.sha512sum | grep Epoch | cut -d ' ' -f5)"
    source_date_epoch=$((timestamp))
  else
    echo "Can't get latest commit timestamp. Defaulting to 1."
    source_date_epoch=1
  fi
fi

snap install docker --revision=3065 && systemctl stop snap.docker.nvidia-container-toolkit
systemctl disable snap.docker.nvidia-container-toolkit
docker buildx create --name signal-builder --driver-opt "network=host" --bootstrap --use
docker buildx build --tag signal-desktop --load \
  --build-arg SOURCE_DATE_EPOCH=$source_date_epoch \
  --build-arg SOURCE=0mniteck/debian-slim:05-20-2025@sha256:da7aa4f50de8c010c1822d0287f24ffbd1147cb37874a1c7e4cd896ece00ebb7 \
  --build-arg NODE_VERSION=22.15.0 \
  --build-arg NVM_VERSION=0.40.3 \
  --build-arg PNPM_VERSION=10.6.4 .

shred .private.key && rm -f .private.key

docker run -it --cpus=$(nproc) \
  --network=name=host,\"driver-opt=network=host\" \
  --name signal-desktop \
  --user "$(id -u):$(id -g)" \
  -e PNPM_HOME=/tmp/.pnpm-home \
  -e NPM_CONFIG_CACHE=/tmp/.npm-cache \
  -e SOURCE_DATE_EPOCH=$source_date_epoch \
  signal-desktop $1 $4

rm -fr builds/release && mkdir -p builds/release && docker cp signal-desktop:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*

snap install syft --classic
mkdir -p "$HOME/syft" && TMPDIR="$HOME/syft" syft docker:signal-desktop -o spdx-json=builds/release/manifest.spdx.json && rm -f -r "$HOME/syft"
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
rm -f -r /var/lib/snapd/cache/*
mkdir -p "$HOME/syft" && TMPDIR="$HOME/syft" syft / --select-catalogers "debian" -o spdx-json=builds/release/ubuntu.25.04.spdx.json && rm -f -r "$HOME/syft"
snap remove syft --purge && rm -f -r $HOME/.cache/syft
snap install grype --classic && grype sbom:builds/release/manifest.spdx.json -o json > builds/release/manifest.grype.json && grype sbom:builds/release/ubuntu.25.04.spdx.json -o json > builds/release/ubuntu.25.04.grype.json
snap remove grype --purge
rm /root/getter* -f -r && rm /root/grype-scratch* -f -r && rm /root/6 -f -r && rm -f -r $HOME/.cache/grype && rm -f -r /tmp/grype-scratch* && rm -f -r /tmp/getter*
rm -f -r /var/lib/snapd/cache/*
read -p "Close Screen Session: Continue to Signing-->"
