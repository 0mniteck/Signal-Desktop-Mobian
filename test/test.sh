#!/bin/bash

snap install docker --revision=3065
docker buildx create --name signal-builder --driver-opt "network=host" --bootstrap --use
docker buildx build --tag signal-desktop --load \
  --build-arg SOURCE=0mniteck/debian-slim:05-20-2025@sha256:da7aa4f50de8c010c1822d0287f24ffbd1147cb37874a1c7e4cd896ece00ebb7 .

docker run -it --cpus=$(nproc) \
  --name signal-desktop \
  --network=name=host,driver-opt="network=host"
  --user "$(id -u):$(id -g)" signal-desktop
