# Fetch arm64 Mobian Bookworm Image
FROM registry.salsa.debian.org/mobian-team/docker-images/mobian-builder-arm64:bookworm@sha256:9bf7bac6e0ba50d8601cd450e91c066e31cbed9d419c4510bafb323ef044c41f

# Sync Repo Info
RUN rm -f /etc/apt/trusted.gpg.d/mobian*
# RUN cd /etc/apt/trusted.gpg.d/ && wget https://repo.mobian.org/mobian.gpg && echo "efc2c98411f7a45e9019d9f9fd21f958c7df240e4dab931765abd6e038160cfd15af287862a559943ca1d89027d6afe2e9354a041ae355283b400fb3c44af1a5  mobian.gpg" > mobian.sum && bash -c 'if [[ $(sha512sum -c mobian.sum) == "mobian.gpg: OK" ]]; then echo "mobian.gpg: Checksum Matched!"; else echo "mobian.gpg: Checksum Mismatch!" & rm -f mobian.gpg; fi;'
# RUN sed -i s/http/https/g /etc/apt/sources.list.d/mobian.list
RUN sed -i 's,http://deb.debian.org/debian-security,https://snapshot.debian.org/archive/debian-security/20241024T023334Z,g' /etc/apt/sources.list.d/debian.sources
RUN sed -i 's,http://deb.debian.org/debian,https://snapshot.debian.org/archive/debian/20241024T023111Z,g' /etc/apt/sources.list.d/debian.sources
RUN rm -f /etc/apt/sources.list.d/mobian.list
COPY includes/secure_apt /etc/apt/apt.conf.d/
RUN apt update && apt upgrade -y
RUN apt install -y build-essential generate-ninja ninja-build rubygems git-lfs pkg-config libpixman-1-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev xvfb

# Install FPM
RUN gem install fpm
ENV USE_SYSTEM_FPM=true

# Reproducibility
ENV SOURCE_DATE_EPOCH=1
RUN mkdir /.cache && chmod -R 777 /.cache

# Node via NVM-SH
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
ARG NODE_VERSION
ARG NVM_VERSION
ARG NPM_VERSION

RUN wget https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh && echo "551831ea67476372c6fb13fc2cab474b38f6e369daa51652a1c22974b0c8a5ed9e36a1e586046e371ba90de8c9d7376ffb3a41c6f6f352c29a847203a56f1db9  install.sh" > install.sum && bash -c 'if [[ $(sha512sum -c install.sum) == "install.sh: OK" ]]; then echo "install.sh: Checksum Matched!"; else echo "install.sh: Checksum Mismatch!" & remove -f install.sh; fi;' && chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION && npm install --location=global npm@$NPM_VERSION

# Signal-Desktop Checkout Tag 7.30.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git
RUN cd /Signal-Desktop/ && git checkout tags/v7.30.0
RUN mkdir /Signal-Desktop/release/
RUN mkdir /Signal-Desktop/artifacts/
RUN mkdir /Signal-Desktop/artifacts/linux
ENV ARTIFACTS_DIR=/Signal-Desktop/artifacts/linux

# Fetch fficonfig.h
RUN cd /usr/include/aarch64-linux-gnu/ && wget https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h && echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" > fficonfig.sum && bash -c 'if [[ $(sha512sum -c fficonfig.sum) == "fficonfig.h: OK" ]]; then echo "fficonfig.h: Checksum Matched!"; else echo "fficonfig.h: Checksum Mismatch!" & rm -f fficonfig.h; fi;'

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Copy Files
COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /

ENTRYPOINT ["/signal-buildscript.sh"]

CMD ["public"]
