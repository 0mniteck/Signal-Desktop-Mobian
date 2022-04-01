# Fetch amd64 Mobian Image
FROM registry.gitlab.com/0mniteck/docker-images/mobian-builder-amd64:latest
RUN apt update
RUN apt upgrade -y
RUN apt install -y crossbuild-essential-arm64 gcc-aarch64-linux-gnu
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.13.0 && nvm use 16.13.0 && npm install -g npm@latest && npm install --global yarn

# Clone Repos
# RingRTC v2.20.0
RUN git clone https://github.com/signalapp/ringrtc
RUN cd ringrtc; git reset --hard 43441a36b6208e63ca872a929539350665a20fa3
# Chromium Depot Tools
RUN git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH=/depot_tools:$PATH

# Copy Files
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY ringrtc-buildscript.sh /
