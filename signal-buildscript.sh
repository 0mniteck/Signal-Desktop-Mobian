#!/bin/bash
source $HOME/.cargo/env
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Build better-sqlite3
echo "Entering /better-sqlite3"
pushd /better-sqlite3
# Apply patch to use local (dynamic) libraries
patch -Np1 -i ../better-sqlite3.patch
rm -f Relase/obj/gen/sqlite3/OpenSSL-Linux/libcrypto.a
nvm use 16.13.2
npm install tar
npm run build-release
yarn install
popd

# Build Signal-Desktop
echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
git-lfs install
sed -r 's#("better-sqlite3": ").*"#\1file:../better-sqlite3"#' -i package.json
nvm use
yarn install && yarn install --frozen-lockfile
yarn build:dev && yarn build:release --arm64 --linux deb
debpath=$(ls /Signal-Desktop/release/signal-desktop_*)
if [ ! -f /Signal-Desktop/release/private.key ]; then
  echo "Generating New Keypair."
  yarn node ts/updater/generateKeyPair.js --key /Signal-Desktop/release/public.key --private /Signal-Desktop/release/private.key
  echo "Signing Release."
  yarn sign-release --private /Signal-Desktop/release/private.key --update $debpath
else
  echo "Signing Release."
  yarn sign-release --private /Signal-Desktop/release/private.key --update $debpath
fi
sha512sum release/*.deb && sha512sum release/*.deb > release/release.sha512sum
echo "Public Key: "$(cat /Signal-Desktop/release/public.key) && echo "Public Key: "$(cat /Signal-Desktop/release/public.key) >> release/release.sha512sum
echo "Build Complete "$(date -u '+on %D at %R UTC') && echo "Build Complete "$(date -u '+on %D at %R UTC') >> release/release.sha512sum
ls -la release/
popd
