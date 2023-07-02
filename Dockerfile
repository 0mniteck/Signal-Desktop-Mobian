# Fetch arm64 Mobian Bookworm Image
FROM registry.salsa.debian.org/mobian-team/docker-images/mobian-builder-arm64:bookworm
# fpm
RUN apt update
RUN apt install -y build-essential generate-ninja ninja-build rubygems git-lfs
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Node via NVM v18.15.0
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 18.15.0 && nvm use 18.15.0 && npm install --location=global npm@latest && npm install --location=global yarn node-gyp npm-run-all

# Clone Repos
# Signal-Desktop v6.23.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 6.23.x
RUN mkdir /Signal-Desktop/release/

# Copy Files
COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
