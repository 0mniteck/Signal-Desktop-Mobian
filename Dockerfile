# Fetch arm64 Mobian Bookworm Image
FROM registry.gitlab.com/0mniteck/docker-mobian-images/mobian-builder-arm64:latest
RUN apt update
RUN apt upgrade -y
RUN apt install -y gcc-aarch64-linux-gnu
# fpm
RUN gem install fpm
ENV USE_SYSTEM_FPM=true
# Rustup-init
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# Node via NVM v16.3.0
ENV HOME="/root"
ENV NVM_DIR="$HOME/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && . $NVM_DIR/nvm.sh && nvm install 16.13.0 && nvm use 16.13.0 && npm install -g npm@latest && npm install --global yarn node-gyp

# Clone Repos
# Signal-Desktop v5.38.0
RUN git clone https://github.com/signalapp/Signal-Desktop.git -b 5.38.x
RUN mkdir /Signal-Desktop/release/
# better-sqlite3 branch feature/log-corruption v4.5.1
RUN git clone https://github.com/signalapp/better-sqlite3.git -b feature/log-corruption
RUN cd better-sqlite3; git reset --hard 4f66ee7b85477016dd0b2c3d2f13dcb60abd452e

#Copy Files
COPY builds/release/private.key /Signal-Desktop/release/
COPY builds/release/public.key /Signal-Desktop/release/
COPY fficonfig.h /usr/include/aarch64-linux-gnu/
COPY signal-buildscript.sh /
COPY better-sqlite3.patch /
