FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-amd64:latest
RUN apt update
RUN apt upgrade -y

# Dependencies
RUN apt install -y nano python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu crossbuild-essential-arm64
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY rustup-init /
RUN /rustup-init -y
COPY ringrtc-buildscript.sh /

# Clone Repos
RUN git clone https://github.com/signalapp/ringrtc
RUN cd ringrtc; git reset --hard af943c58f05e790165592d72100bf7759fe22da9
RUN git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH=/depot_tools:$PATH

# NODE
# Included Node because docker build can't cache the tar, but will convert to nvm.
COPY node-v14.16.0-linux-x64.tar.gz /opt/
RUN mkdir -p /opt/node
RUN cd /opt/; tar xf node-v14.16.0-linux-x64.tar.gz
RUN mv /opt/node-v14.16.0-linux-x64/* /opt/node/
ENV PATH=/opt/node/bin:$PATH
RUN npm install --global yarn
