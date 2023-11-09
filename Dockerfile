# Fetch arm64 Mobian Bookworm Image
FROM registry.salsa.debian.org/mobian-team/docker-images/mobian-builder-arm64:bookworm
# FPM
RUN apt update
RUN apt install -y build-essential generate-ninja ninja-build rubygems git-lfs
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Node via NVM-SH
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 18.15.0 && nvm use 18.15.0 && npm install --location=global --force npm@latest && npm install --location=global --force yarn node-gyp npm-run-all

# Clone Repo
# Signal-Desktop Branch 6.37.x
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 6.37.x
RUN mkdir /Signal-Desktop/release/

# Fetch fficonfig.h
RUN cd /usr/include/aarch64-linux-gnu/ && wget https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h

# Copy Files
COPY /etc/keys/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /
