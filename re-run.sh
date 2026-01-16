#!/bin/bash

if [ "$5" = "yes" ]; then
  export CROSS="--platform linux/arm64"
fi

snap disable docker
rm -f -r /var/snap/docker/*
if [ "$3" != "" ]; then
  umount -f /dev/mapper/Luks-Signal
  sleep 5
  systemd-cryptsetup detach Luks-Signal
fi
rm -f -r /var/snap/docker
sleep 5
snap enable docker
snap remove docker --purge
if [ "$3" != "" ]; then
  systemd-cryptsetup attach Luks-Signal /dev/$3
fi
mkdir /var/snap/docker
if [ "$3" != "" ]; then
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
if [ "$2" = "today" ]; then
  timestamp=$(date -d $(date +%D) +%s);
  if [ "${timestamp}" != "" ]; then
    echo "Setting SOURCE_DATE_EPOCH from today's date: $(date +%D) = @$timestamp";
    source_date_epoch=$((timestamp));
  else
    echo "Can't get timestamp. Defaulting to 1.";
    source_date_epoch=1;
  fi
elif [ "$2" != 0 ]; then
  echo "Using override timestamp for SOURCE_DATE_EPOCH."
  source_date_epoch=$(($2))
else
  timestamp=$(cat builds/release/release.sha512sum | grep Epoch | cut -d ' ' -f5)
  if [ "${timestamp}" != "" ]; then
    echo "Setting SOURCE_DATE_EPOCH from release.sha512sum: $(cat builds/release/release.sha512sum | grep Epoch | cut -d ' ' -f5)"
    source_date_epoch=$((timestamp))
    check_file=1
    cp builds/release/release.sha512sum /tmp/release.last.sha512sum
  else
    echo "Can't get latest commit timestamp. Defaulting to 1."
    source_date_epoch=1
  fi
fi

scan_using_grype() { # $1 = Name
  pushd Results/
    script -q -c "grype -c $HOME/.grype.yaml sbom:$1.spdx.json -o json > $1.grype.json" $1.grype.tmp
    grep "✔ Scanned for vulnerabilities" $1.grype.tmp | tail -n 1 > $1.grype.status.1
    tr -d '\000-\037\177' < $1.grype.status.1 | sed '/^$/d' > $1.grype.status.1.tmp
    line1=$(cat $1.grype.status.1.tmp)
    left1=${line1%%" [K"*}
    grep "├── by severity:" $1.grype.tmp | tail -n 1 > $1.grype.status.2
    tr -d '\000-\037\177' < $1.grype.status.2 | sed '/^$/d' > $1.grype.status.2.tmp
    line2=$(cat $1.grype.status.2.tmp)
    left2=${line2%%" [K"*}
    grep "└── by status:" $1.grype.tmp | tail -n 1 > $1.grype.status.3
    tr -d '\000-\037\177' < $1.grype.status.3 | sed '/^$/d' > $1.grype.status.3.tmp
    line3=$(cat $1.grype.status.3.tmp)
    left3=${line3%%" [K"*}
    echo $left1 > $1.grype.status
    echo $left2 >> $1.grype.status
    echo $left3 >> $1.grype.status
    rm -f $1.grype.tmp
    rm -f $1.grype.status.*
    cat $1.grype.status
  popd
}

if [ "$5" = "yes" ]; then
  snap install docker --revision=3377
else
  snap install docker --revision=3380 && systemctl stop snap.docker.nvidia-container-toolkit
  systemctl disable snap.docker.nvidia-container-toolkit
fi

docker buildx create --name signal-builder --driver-opt "network=host" --bootstrap --use
if [ "$5" = "yes" ]; then
  docker run --privileged --rm tonistiigi/binfmt:qemu-v10.0.4-56 --install all
fi
docker buildx build --tag signal-desktop --load $CROSS \
  --build-arg SOURCE_DATE_EPOCH=$source_date_epoch \
  --build-arg SOURCE=0mniteck/debian-slim:1-15-2026@.. \ #WIP
  --build-arg NODE_VERSION=22.21.1 \
  --build-arg NVM_VERSION=0.40.3 \
  --build-arg PNPM_VERSION=10.18.1 .

shred .private.key && rm -f .private.key

docker run -it --cpus=$(nproc) \
  --network=name=host,\"driver-opt=network=host\" \
  --name signal-desktop $CROSS \
  --user "$(id -u):$(id -g)" \
  -e PNPM_HOME=/tmp/.pnpm-home \
  -e NPM_CONFIG_CACHE=/tmp/.npm-cache \
  -e SOURCE_DATE_EPOCH=$source_date_epoch \
  signal-desktop $1 $4

rm -fr builds/release && mkdir -p builds/release && docker cp signal-desktop:/Signal-Desktop/release/ builds/ && rm -fr builds/release/linux-*

snap install syft --classic
mkdir -p "$HOME/syft" && TMPDIR="$HOME/syft" syft docker:signal-desktop -o spdx-json=builds/release/signal.spdx.json && rm -f -r "$HOME/syft"
snap disable docker
rm -f -r /var/snap/docker/*
if [ "$3" != "" ]; then
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
snap install grype --classic
scan_using_grype builds/release/signal
scan_using_grype builds/release/ubuntu.25.04
snap remove grype --purge
rm /root/getter* -f -r && rm /root/grype-scratch* -f -r && rm /root/syft -f -r && rm /root/6 -f -r && rm /root/Library -f -r && rm -f -r $HOME/.cache/grype && rm -f -r $HOME/.cache/syft && rm -f -r /tmp/grype-scratch* && rm -f -r /tmp/getter*
rm -f -r /var/lib/snapd/cache/*
if [ "$check_file" = "1" ]; then
  pushd builds/release/
    cp /tmp/release.last.sha512sum release.last.sha512sum
    sha512sum -c release.last.sha512sum
    rm -f /tmp/release.last.sha512sum && rm -f release.last.sha512sum
  popd
fi
read -p "Close Screen Session: Continue to Signing-->"
