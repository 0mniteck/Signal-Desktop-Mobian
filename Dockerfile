FROM 0mniteck/debian-slim:11-11-2024@sha256:e1637a59b4ec77b6e338a9509d4116f56213eb21ba048dad14d36f1026bc314b
RUN apt install -y cargo cmake curl rubygems git git-lfs pkg-config libcairo2-dev libgif-dev libjpeg-dev libpango1.0-dev libpixman-1-dev libpulse0 librust-libpulse-sys-dev librsvg2-dev ninja-build protobuf-c-compiler python python2.7 rustc xauth xvfb

RUN gem install fpm
ENV USE_SYSTEM_FPM=true

ARG SOURCE_DATE_EPOCH
ENV SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH

ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
ARG NODE_VERSION
ARG NVM_VERSION
ARG NPM_VERSION
RUN wget https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh && echo "551831ea67476372c6fb13fc2cab474b38f6e369daa51652a1c22974b0c8a5ed9e36a1e586046e371ba90de8c9d7376ffb3a41c6f6f352c29a847203a56f1db9  install.sh" > install.sum && bash -c 'if [[ $(sha512sum -c install.sum) == "install.sh: OK" ]]; then echo "install.sh: Checksum Matched!"; else echo "install.sh: Checksum Mismatch!" & remove -f install.sh; fi;' && chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION && npm install --location=global npm@$NPM_VERSION

RUN git clone https://github.com/signalapp/Signal-Desktop.git
RUN cd /Signal-Desktop/ && git checkout --progress --force -B 7.31.x refs/remotes/origin/7.31.x
RUN mkdir /Signal-Desktop/release/
RUN mkdir /Signal-Desktop/artifacts/
RUN mkdir /Signal-Desktop/artifacts/linux
ENV ARTIFACTS_DIR=/Signal-Desktop/artifacts/linux

RUN cd /usr/include/aarch64-linux-gnu/ && wget https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h && echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" > fficonfig.sum && bash -c 'if [[ $(sha512sum -c fficonfig.sum) == "fficonfig.h: OK" ]]; then echo "fficonfig.h: Checksum Matched!"; else echo "fficonfig.h: Checksum Mismatch!" & rm -f fficonfig.h; fi;'

RUN cd /Signal-Desktop/ && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
ENV PATH=/Signal-Desktop/depot_tools:$PATH

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /

ENTRYPOINT ["/signal-buildscript.sh"]
CMD ["public"]
