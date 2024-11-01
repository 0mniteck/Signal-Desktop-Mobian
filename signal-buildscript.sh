#!/usr/bin/env bash

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

trap '[[ $pid ]] && kill $pid; exit' EXIT

if [ "$1" != "" ]; then
  BUILD_TYPE="$1"
fi
echo "BUILD_TYPE: ${BUILD_TYPE}"
echo "SOURCE_DATE_EPOCH: ${SOURCE_DATE_EPOCH}"

echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
git-lfs install
nvm use && npm ci
npm install && npm run clean-transpile
cd sticker-creator
npm install && npm run build
cd ..
npm run generate && \
if [ "${BUILD_TYPE}" = "public" ]; then
  npm run prepare-beta-build
elif [ "${BUILD_TYPE}" = "alpha" ]; then
  npm run prepare-alpha-version
  npm run prepare-alpha-build
elif [ "${BUILD_TYPE}" = "staging" ]; then
  npm run prepare-alpha-version
  npm run prepare-staging-build
elif [ "${BUILD_TYPE}" = "test" ]; then
  npm run prepare-alpha-version
  npm run prepare-alpha-build
elif [ "${BUILD_TYPE}" = "dev" ]; then
  echo "dev build, using package.json as is"
else
  echo "Unknown build type ${BUILD_TYPE}"
  exit 1
fi
npm run generate
npm run build:esbuild:prod
xvfb-run --auto-servernum npm run build:preload-cache
npm run build:release -- --arm64 --publish=never --linux deb
echo "Generating SBOM at /Signal-Desktop/release/manifest.spdx.json"
npm sbom --sbom-format="spdx" --sbom-type="application" > /Signal-Desktop/release/manifest.spdx.json
# TESTS
# xvfb-run --auto-servernum npm run test-node
# xvfb-run --auto-servernum npm run test-electron
# xvfb-run --auto-servernum npm run test-release
debpath=$(ls /Signal-Desktop/release/signal-desktop_*)
if [ ! -f /Signal-Desktop/release/.private.key ]; then
  echo "Generating New Keypair."
  npm run ts/updater/generateKeyPair.js -- --key /Signal-Desktop/release/public.key --private /Signal-Desktop/release/.private.key
  echo "Signing Release."
  npm run sign-release -- --private /Signal-Desktop/release/.private.key --update $debpath
else
  echo "Signing Release."
  npm run sign-release -- --private /Signal-Desktop/release/.private.key --update $debpath
  shred /Signal-Desktop/release/.private.key
  rm -f /Signal-Desktop/release/.private.key
fi
sha512sum release/*.deb && sha512sum release/*.deb > release/release.sha512sum
echo "# 0mniteck's Current GPG Key ID: 287EE837E6ED2DD3" >> release/release.sha512sum
echo "Build Complete: "$(date -u '+on %D at %R UTC') && echo "# Build Complete: "$(date -u '+on %D at %R UTC') >> release/release.sha512sum
echo "# Container Build System: $(uname -o) $(uname -p) $(lsb_release -ds) $(lsb_release -cs) $(uname -v)"  >> release/release.sha512sum
ls -la release/
popd
