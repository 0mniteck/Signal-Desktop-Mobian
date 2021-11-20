# Fetch arm64 Mobian Image
FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y

# Install Dependencies
RUN apt install -y nano python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
# @signalapp/signal-client v0.9.5
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 14.16.0 && nvm install 12.18.3 && nvm use 14.16.0 && npm install --global yarn node-gyp && npm pack '@signalapp/signal-client@0.9.5' && nvm use 12.18.3 && npm install --global yarn
RUN tar xvf signalapp-signal-client-0.9.5.tgz
RUN mv package signal-client

# Clone Repos
# Signal-Desktop v5.24.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.24.x
RUN mkdir /Signal-Desktop/release/
# libsignal-client v0.9.5
RUN git clone https://github.com/signalapp/libsignal-client.git
RUN cd libsignal-client; git reset --hard f3a1dff3719377e1031dd2ff529df9e5cf535a86
# signal-ringrtc-node v2.13.6
RUN git clone https://github.com/signalapp/signal-ringrtc-node.git
RUN cd signal-ringrtc-node; git reset --hard f8764156753e68eb85220dc1c04a6ced3704bedf
# zkgroup v0.8.2
RUN git clone https://github.com/signalapp/zkgroup.git
RUN cd zkgroup; git reset --hard bbd71fd1fb56cbaf5af6e20d3837b210d5bbd5e2
# signal-zkgroup-node v0.8.2
RUN git clone https://github.com/signalapp/signal-zkgroup-node.git
RUN cd signal-zkgroup-node; git reset --hard 0d2b3874d2e671fa5fdcc2154065cc061f977672
# better-sqlite3 branch feature/log-corruption
RUN git clone https://github.com/signalapp/better-sqlite3.git -b feature/log-corruption
RUN cd better-sqlite3; git reset --hard 9de3488f68d7429133dd859b7308fdcbd64f02f6
# sqlcipher branch updates
RUN git clone https://github.com/scottnonnenberg-signal/node-sqlcipher.git -b updates /sqlcipher

#Copy Files
COPY libringrtc-arm64.node /signal-ringrtc-node/build/linux/
COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY sqlcipher.patch /
COPY better-sqlite3.patch /
