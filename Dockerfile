FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y

# Dependencies
RUN apt install -y nano python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY rustup-init /
RUN /rustup-init -y
COPY signal-buildscript.sh /

# Clone Repos
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.7.x
RUN git clone https://github.com/scottnonnenberg-signal/node-sqlcipher.git -b updates /sqlcipher
COPY sqlcipher.patch /
RUN git clone https://github.com/signalapp/libsignal-client.git
RUN cd libsignal-client; git reset --hard b715e02aa903ac83b2dc03ebd78b7dcbbee906fa
RUN git clone https://github.com/signalapp/signal-ringrtc-node.git
RUN cd signal-ringrtc-node; git reset --hard a669f0becf3ec392707e78b3d3521100fde24b97
COPY libringrtc-arm64.node /signal-ringrtc-node/build/linux/libringrtc-arm64.node
RUN git clone https://github.com/signalapp/better-sqlite3.git
COPY better-sqlite3.patch /
RUN git clone https://github.com/signalapp/zkgroup.git
RUN cd zkgroup; git reset --hard d3cb5dbd3098f1e8f82864974eda20c25f5d7d24
RUN git clone https://github.com/signalapp/signal-zkgroup-node.git
RUN cd signal-zkgroup-node; git reset --hard 7ecf70be85e5a485ec870c1723b1c6247b9d549e

# NODE
# Included Node because docker build can't cache the tar, but will convert to nvm.
COPY node-v14.16.0-linux-arm64.tar.gz /opt/
RUN mkdir -p /opt/node
RUN cd /opt/; tar xf node-v14.16.0-linux-arm64.tar.gz
RUN mv /opt/node-v14.16.0-linux-arm64/* /opt/node/
ENV PATH=/opt/node/bin:$PATH
RUN npm install --global yarn
RUN npm pack '@signalapp/signal-client@0.8.1'
RUN tar xvf signalapp-signal-client-0.8.1.tgz
RUN mv package signal-client
