# Fetch arm64 Mobian Image
FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y
ENV HOME="/root"

# Install Dependencies
RUN apt install -y nano python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 14.16.0 && nvm use 14.16.0 && npm install --global yarn && npm pack '@signalapp/signal-client@0.8.1'
# @signalapp/signal-client v0.8.1
RUN tar xvf signalapp-signal-client-0.8.1.tgz
RUN mv package signal-client

# Clone Repos
# Signal-Desktop v5.11.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.11.x
# libsignal-client v0.8.1
RUN git clone https://github.com/signalapp/libsignal-client.git
RUN cd libsignal-client; git reset --hard b715e02aa903ac83b2dc03ebd78b7dcbbee906fa
# signal-ringrtc-node v2.10.6
RUN git clone https://github.com/signalapp/signal-ringrtc-node.git
RUN cd signal-ringrtc-node; git reset --hard 868f7ecb699b984171b5ad02f9b043bfa55ad804
# zkgroup v0.7.3
RUN git clone https://github.com/signalapp/zkgroup.git
RUN cd zkgroup; git reset --hard ff26ac3679329e182772eed3f51797d91f963c3b
# signal-zkgroup-node v0.7.3
RUN git clone https://github.com/signalapp/signal-zkgroup-node.git
RUN cd signal-zkgroup-node; git reset --hard 3bb62fa44dc69560436a8c946ea48630f3230ed3
RUN git clone https://github.com/scottnonnenberg-signal/node-sqlcipher.git -b updates /sqlcipher
RUN git clone https://github.com/signalapp/better-sqlite3.git

#Copy Files
COPY libringrtc-arm64.node /signal-ringrtc-node/build/linux/libringrtc-arm64.node
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY sqlcipher.patch /
COPY better-sqlite3.patch /
COPY minimize-on-small-screens.patch /
