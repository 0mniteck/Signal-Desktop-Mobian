# Fetch arm64 Mobian Image
FROM registry.gitlab.com/0mniteck/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y
RUN apt install -y gcc-aarch64-linux-gnu
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
# @signalapp/signal-client v0.12.4
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.13.0 && nvm use 16.13.0 && npm install -g npm@latest && npm install --global yarn node-gyp && npm pack '@signalapp/signal-client@0.12.4'
RUN tar xvf signalapp-signal-client-0.12.4.tgz
RUN mv package signal-client

# Clone Repos
# Signal-Desktop v5.37.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.37.x
RUN mkdir /Signal-Desktop/release/
# libsignal-client v0.12.4
RUN git clone https://github.com/signalapp/libsignal-client.git
RUN cd libsignal-client; git reset --hard 4bd3778e6943a9148da79f1d0a1f892883e522eb
# signal-ringrtc-node v2.20.0
RUN git clone https://github.com/signalapp/signal-ringrtc-node.git
RUN cd signal-ringrtc-node; git reset --hard fc3a17abb293ffb3f16ead2c39fc16086ba53d31
# better-sqlite3 branch feature/log-corruption v4.5.1
RUN git clone https://github.com/signalapp/better-sqlite3.git -b feature/log-corruption
RUN cd better-sqlite3; git reset --hard 4f66ee7b85477016dd0b2c3d2f13dcb60abd452e

#Copy Files
COPY libringrtc-arm64.node /signal-ringrtc-node/build/linux/
# COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY better-sqlite3.patch /
