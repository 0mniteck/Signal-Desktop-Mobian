#!/bin/bash
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Build Signal-Desktop
echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
git-lfs install
nvm use
# yarn install --frozen-lockfile --network-timeout 600000
# yarn build:dev && yarn build:release --arm64 --linux deb
npm run generate && npm run prepare-beta-build && npm run build:esbuild:prod
xvfb-run --auto-servernum npm run build:preload-cache
npm run build:release -- --arm64 --linux deb
debpath=$(ls /Signal-Desktop/release/signal-desktop_*)
if [ ! -f /Signal-Desktop/release/.private.key ]; then
  echo "Generating New Keypair."
  npm run node ts/updater/generateKeyPair.js --key /Signal-Desktop/release/public.key --private /Signal-Desktop/release/.private.key
  echo "Signing Release."
  npm run sign-release --private /Signal-Desktop/release/.private.key --update $debpath
else
  echo "Signing Release."
  npm run sign-release --private /Signal-Desktop/release/.private.key --update $debpath
  shred /Signal-Desktop/release/.private.key
  rm -f /Signal-Desktop/release/.private.key
fi
sha512sum release/*.deb && sha512sum release/*.deb > release/release.sha512sum
echo "0mniteck's Current GPG Key ID: 287EE837E6ED2DD3" >> release/release.sha512sum
echo "Build Complete "$(date -u '+on %D at %R UTC') && echo "Build Complete "$(date -u '+on %D at %R UTC') >> release/release.sha512sum
ls -la release/
popd
