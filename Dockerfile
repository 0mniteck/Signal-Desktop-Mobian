# Fetch arm64 Mobian Image
FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y

# Install Dependencies
RUN apt install -y nano python-is-python3 python3 python2 gcc g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
# @signalapp/signal-client v0.11.1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.9.1 && nvm use 16.9.1 && npm install -g npm@latest && npm install --global yarn node-gyp && npm pack '@signalapp/signal-client@0.11.1'
RUN tar xvf signalapp-signal-client-0.11.1.tgz
RUN mv package signal-client

# Clone Repos
# Signal-Desktop v5.30.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.30.x
RUN mkdir /Signal-Desktop/release/
# libsignal-client v0.11.1
RUN git clone https://github.com/signalapp/libsignal-client.git
RUN cd libsignal-client; git reset --hard 5104d199d0e8b7660eb5c90ee455ab6c6ab018c2
# signal-ringrtc-node v2.17.0
RUN git clone https://github.com/signalapp/signal-ringrtc-node.git
RUN cd signal-ringrtc-node; git reset --hard f25f900355bbd69821449a39ad88c5a1afdaaac3
# better-sqlite3 branch feature/log-corruption
RUN git clone https://github.com/signalapp/better-sqlite3.git -b feature/log-corruption
RUN cd better-sqlite3; git reset --hard 92ed9e36351577fe007d139fbd7b4f3e797a8454

#Copy Files
COPY libringrtc-arm64.node /signal-ringrtc-node/build/linux/
# COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY better-sqlite3.patch /
