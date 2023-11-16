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
RUN wget https://github.com/nvm-sh/nvm/raw/v0.39.5/install.sh && echo "af9e3f59e1b81c69b70563a010731a23f69b2e0b2260c511de63c07083285bd2c3c7794754bd0fe3b35081fa2b31e53021a1b50c4f670dca93f50aa8ef10df40  install.sh" > install.sum && bash -c 'if [[ $(sha512sum -c install.sum) == "install.sh: OK" ]]; then echo "install.sh: Checksum Matched!"; else remove -f install.sh; fi' && chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install 18.15.0 && nvm use 18.15.0 && npm install --location=global --force npm@latest && npm install --location=global --force yarn node-gyp npm-run-all

# Clone Repo
# Signal-Desktop Branch 6.39.x
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 6.39.x
RUN mkdir /Signal-Desktop/release/

# Fetch fficonfig.h
RUN cd /usr/include/aarch64-linux-gnu/ && wget https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h && echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" > fficonfig.sum && bash -c 'if [[ $(sha512sum -c fficonfig.sum) == "fficonfig.h: OK" ]]; then echo "fficonfig.h: Checksum Matched!"; else rm -f fficonfig.h; fi;'

# Copy Files
COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /
