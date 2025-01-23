ARG SOURCE=0mniteck/debian-slim
FROM $SOURCE
RUN apt install -y git-lfs libcairo2-dev libgif-dev libjpeg-dev libpango1.0-dev libpixman-1-dev librsvg2-dev libpulse0 pkg-config rubygems xauth xvfb

RUN gem install fpm
ENV USE_SYSTEM_FPM=true
ARG SOURCE_DATE_EPOCH
ENV SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH

ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
ARG NODE_VERSION
ARG NVM_VERSION
ARG NPM_VERSION
ADD https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh /
RUN echo "551831ea67476372c6fb13fc2cab474b38f6e369daa51652a1c22974b0c8a5ed9e36a1e586046e371ba90de8c9d7376ffb3a41c6f6f352c29a847203a56f1db9  install.sh" | sha512sum --status -c - && echo "install.sh Checksum Matched!" || exit 1
RUN chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION && npm install --location=global npm@$NPM_VERSION

ADD https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h /
RUN echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" | sha512sum --status -c - && echo "fficonfig.h Checksum Matched!" || exit 1
RUN mv fficonfig.h /usr/include/aarch64-linux-gnu/fficonfig.h

ADD https://github.com/signalapp/Signal-Desktop.git /Signal-Desktop/
RUN cd /Signal-Desktop/ && git checkout --progress --force -B 7.36.x refs/remotes/origin/7.36.x
RUN mkdir -p /Signal-Desktop/artifacts/linux/logs
ENV ARTIFACTS_DIR=artifacts/linux

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /
ENTRYPOINT ["/signal-buildscript.sh"]
CMD ["public"]
