ARG SOURCE=0mniteck/debian-slim
FROM $SOURCE

RUN apt install -y libasound2-dev libgtk-3-dev libnss3-dev libpulse-dev rubygems xauth xvfb
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
ARG SOURCE_DATE_EPOCH
ENV SOURCE_DATE_EPOCH=$SOURCE_DATE_EPOCH

ENV NVM_DIR="/usr/local/nvm"
RUN mkdir $NVM_DIR
ARG NODE_VERSION
ARG NVM_VERSION
ARG PNPM_VERSION

ADD https://github.com/nvm-sh/nvm/raw/v$NVM_VERSION/install.sh /
RUN echo "774f51ef51821b2896739108f51a91a81abb79f5adbb8dab8629a095ad71443c617cc35350b2a41b86a9179527a43de69e975c6ebec7e8d507a97b21fb4ceb73  install.sh" | sha512sum --status -c - && echo "install.sh Checksum Matched!" || exit 1
RUN chmod +x install.sh && ./install.sh && . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias $NODE_VERSION && nvm use $NODE_VERSION

ADD https://github.com/node-ffi-napi/node-ffi-napi/raw/master/deps/libffi/config/linux/arm64/fficonfig.h /
RUN echo "56c9800d0388dd20a85ad917a75a0dc96aa0de95db560e586b540e657a7a10ec8ef9759f1d09d7cb2f0861c9b88650246a9ace97708a20d8757bcd0c559333a7  fficonfig.h" | sha512sum --status -c - && echo "fficonfig.h Checksum Matched!" || exit 1
RUN mv fficonfig.h /usr/include/aarch64-linux-gnu/fficonfig.h

RUN git clone https://github.com/signalapp/Signal-Desktop.git
RUN cd /Signal-Desktop/ && git checkout --progress --force -B 7.59.x refs/remotes/origin/7.59.x
RUN mkdir -p /Signal-Desktop/artifacts/linux/logs
ENV ARTIFACTS_DIR=artifacts/linux

ENV SIGNAL_ENV=production
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV CI=true

RUN npm install --location=global pnpm@$PNPM_VERSION
RUN git config --global --add safe.directory /project

COPY .private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY signal-buildscript.sh /usr/local/bin/
RUN mkdir -p /.cache && chmod -R 777 /.cache
ENTRYPOINT ["signal-buildscript.sh"]
CMD ["public"]
