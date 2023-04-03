# Fetch arm64 Mobian Bookworm Image
FROM registry.salsa.debian.org/mobian-team/docker-images/mobian-builder-arm64:latest
# fpm
RUN apt update
RUN apt install -y build-essential generate-ninja ninja-build rubygems
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Node via NVM v16.17.1
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.17.1 && nvm use 16.17.1 && npm install --location=global npm@latest && npm install --location=global yarn node-gyp npm-run-all

# Clone Repos
# Signal-Desktop v6.12.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 6.12.x
RUN mkdir /Signal-Desktop/release/

# Copy Files
COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
