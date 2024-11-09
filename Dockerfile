FROM debian:bookworm-20241016-slim@sha256:936ea04e67a02e5e83056bfa8c7331e1c9ae89d4a324bbc1654d9497b815ae56
LABEL org.opencontainers.image.authors="shant@omniteck.com"
LABEL org.opencontainers.image.description="Signal Desktop Builder for Debian/Mobian Bookworm ARM64"
RUN sed -i 's,http://deb.debian.org/debian-security,http://snapshot.debian.org/archive/debian-security/20241024T023334Z,g' /etc/apt/sources.list.d/debian.sources
RUN sed -i 's,http://deb.debian.org/debian,http://snapshot.debian.org/archive/debian/20241024T023111Z,g' /etc/apt/sources.list.d/debian.sources
RUN echo 'Acquire::Check-Valid-Until "false";' >> /etc/apt/apt.conf.d/secure_apt
RUN echo 'Acquire::Languages "none";' >> /etc/apt/apt.conf.d/secure_apt
RUN echo 'Binary::apt-get::Acquire::AllowInsecureRepositories "false";' >> /etc/apt/apt.conf.d/secure_apt
RUN echo 'APT::Install-Recommends "false";' >> /etc/apt/apt.conf.d/secure_apt
RUN echo 'APT::Immediate-Configure "false";' >> /etc/apt/apt.conf.d/secure_apt
RUN apt update && apt install -y apt-transport-https ca-certificates
RUN sed -i 's,http://snapshot.debian.org/archive/debian-security/20241024T023334Z,https://snapshot.debian.org/archive/debian-security/20241024T023334Z,g' /etc/apt/sources.list.d/debian.sources
RUN sed -i 's,http://snapshot.debian.org/archive/debian/20241024T023111Z,https://snapshot.debian.org/archive/debian/20241024T023111Z,g' /etc/apt/sources.list.d/debian.sources
RUN apt update && apt upgrade -y
RUN apt install -y build-essential rubygems git-lfs pkg-config libpixman-1-dev libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev lsb-release xvfb wget

RUN gem install fpm
ENV USE_SYSTEM_FPM=true

ARG SOURCE_DATE_EPOCH
ENV SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH
RUN mkdir /.cache && chmod -R 777 /.cache

ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
ARG NODE_VERSION
ARG NVM_VERSION
ARG NPM_VERSION
RUN wget https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh && echo "551831ea67476372c6fb13fc2cab474b38f6e369daa51652a1c22974b0c8a5ed9e36a1e586046e371ba90de8c9d7376ffb3a41c6f6f352c29a847203a56f1db9  install.sh" > install.sum && bash -c 'if [[ $(sha512sum -c install.sum) == "install.sh: OK" ]]; then echo "install.sh: Checksum Matched!"; else echo "install.sh: Checksum Mismatch!" & remove -f install.sh; fi;' && chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION && npm install --location=global npm@$NPM_VERSION

RUN git clone https://github.com/signalapp/Signal-Desktop.git
RUN cd /Signal-Desktop/ && git checkout tags/v7.31.0
RUN mkdir /Signal-Desktop/release/
RUN mkdir /Signal-Desktop/artifacts/
RUN mkdir /Signal-Desktop/artifacts/linux
ENV ARTIFACTS_DIR=/Signal-Desktop/artifacts/linux

RUN cd /usr/include/aarch64-linux-gnu/ && wget https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h && echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" > fficonfig.sum && bash -c 'if [[ $(sha512sum -c fficonfig.sum) == "fficonfig.h: OK" ]]; then echo "fficonfig.h: Checksum Matched!"; else echo "fficonfig.h: Checksum Mismatch!" & rm -f fficonfig.h; fi;'

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /

ENTRYPOINT ["/signal-buildscript.sh"]
CMD ["public"]
