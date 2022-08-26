# Fetch arm64 Mobian Bookworm Image
FROM registry.gitlab.com/0mniteck/docker-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM v16.3.2
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.13.2 && nvm use 16.13.2 && npm install -g npm@latest && npm install --location=global yarn node-gyp npm-run-all

# Clone Repos
# Signal-Desktop v5.56.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.56.x
RUN mkdir /Signal-Desktop/release/
# better-sqlite3 branch feature/log-corruption v4.5.1
RUN git clone https://github.com/signalapp/better-sqlite3.git -b tmp
RUN cd better-sqlite3; git reset --hard 3c4a7eebba3d5f5d8cb88fe83be1c01b8c0dea7d

# Copy Files
COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY better-sqlite3.patch /
