# Fetch amd64 Mobian Image
FROM registry.gitlab.com/mobian1/docker-images/mobian-builder-amd64:latest
RUN apt update
RUN apt upgrade -y

# Install Dependencies
RUN apt install -y nano python gcc python2 g++ make build-essential git git-lfs libffi-dev libssl-dev libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgdk-pixbuf-2.0-0 libgtk-3-0 libdrm2 libgbm1 ruby ruby-dev curl wget clang llvm lld clang-tools generate-ninja ninja-build pkg-config tcl libglib2.0-dev meson gcc-aarch64-linux-gnu crossbuild-essential-arm64
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.5.0 && nvm use 16.5.0 && npm install --global yarn

# Clone Repos
# RingRTC v2.14.3
RUN git clone https://github.com/signalapp/ringrtc
RUN cd ringrtc; git reset --hard 9b09b7870940fe0043b31780c9ade3848e244d55
# Chromium Depot Tools
RUN git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH=/depot_tools:$PATH

# Copy Files
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY ringrtc-buildscript.sh /
