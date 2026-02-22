ARG SOURCE=0mniteck/debian-slim
FROM $SOURCE

RUN gem install fpm
ENV USE_SYSTEM_FPM=true
ARG SOURCE_DATE_EPOCH
ENV SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH

ENV NVM_DIR="/usr/local/nvm"
RUN mkdir $NVM_DIR
ARG NODE_VERSION
ARG NVM_VERSION
ARG PNPM_VERSION
ARG BRANCH
ARG COMMIT

ADD https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh /
RUN echo "a8e082d8d1a9b61a09e5d3e1902d2930e5b1b84a86f9777c7d2eb50ea204c0141f6a97c54a860bc3282e7b000f1c669c755f5e0db7bd6d492072744c302c0a21  install.sh" | sha512sum --status -c - && echo "install.sh Checksum Matched!" || exit 1
RUN chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION

ADD https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h /
RUN echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" | sha512sum --status -c - && echo "fficonfig.h Checksum Matched!" || exit 1
RUN mv fficonfig.h /usr/include/aarch64-linux-gnu/fficonfig.h

ADD --keep-git-dir=true https://github.com/signalapp/Signal-Desktop.git?branch=$BRANCH.x&checksum=$COMMIT /Signal-Desktop
RUN mkdir -p /Signal-Desktop/artifacts/linux/logs

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV CI=true

RUN npm install --location=global pnpm@$PNPM_VERSION
RUN git config --global --add safe.directory /project

COPY signal-buildscript.sh /usr/local/bin/
ENTRYPOINT ["signal-buildscript.sh"]
CMD ["public"]
