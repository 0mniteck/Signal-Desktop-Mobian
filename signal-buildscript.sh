#!/usr/bin/env bash

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
trap '[[ $pid ]] && kill $pid; exit' EXIT
BUILD_TYPE="$1"
TEST="$2"

cat <<EOF > tmp.patch
diff --git a/ts/services/calling.ts b/ts/services/calling.ts
index 0448247c0..008073009 100644
--- a/ts/services/calling.ts
+++ b/ts/services/calling.ts
@@ -7,6 +7,7 @@ import type {
   CallId,
   DeviceId,
   GroupCallObserver,
+  SpeechEvent,
   PeekInfo,
   UserId,
   VideoFrameSource,
@@ -1478,6 +1479,9 @@ export class CallingClass {
           endedReason,
         });
       },
+      onSpeechEvent: (_groupCall: GroupCall, event: SpeechEvent) => {
+        log.info('GroupCall#onSpeechEvent', event);
+      },
     };
   }
EOF

echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
  patch ts/services/calling.ts < ../tmp.patch
  sed -i 's,"@signalapp/ringrtc": "2.48.6","@signalapp/ringrtc": "2.48.7",' package.json
  sed -i 's,"@signalapp/ringrtc": "2.48.6","@signalapp/ringrtc": "2.48.7",' package-lock.json
  sed -i 's,"version": "2.48.6","version": "2.48.7",' package-lock.json
  sed -i 's,ringrtc-2.48.6.tgz,ringrtc-2.48.7.tgz,' package-lock.json
  sed -i 's,"integrity": "sha512-iEjg8mBvv/2C/IDD2sV3yLx0ouHzN6YI3tWG75E9V08IUXp1QSRy8JjZwgo9tNbxSV/tk3UI93lE3uGp8aroYg==","integrity": "sha512-gfu8vb7Adtlh4zJ9cbLRBbmfvmIJ/SKwdQWZW3P8te8SOgTp6cK9aiuUDYqkJQfb3o30kQFDSA9e4a/rhDNeBQ==",' package-lock.json
  echo "Patched ringrtc"
  echo "Starting Build "$(date -u '+on %D at %R UTC') && echo "# Starting Build "$(date -u '+on %D at %R UTC') > release/release.sha512sum
  echo "RUN_TESTS: ${TEST}"
  echo "BUILD_TYPE: ${BUILD_TYPE}"
  echo "SOURCE_DATE_EPOCH: ${SOURCE_DATE_EPOCH}"
  git-lfs install
  nvm use && npm ci
  npm install
  npm run clean-transpile
  cd sticker-creator
    npm install
    npm run build
  cd ..
  npm run generate
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
  npm run build:esbuild:prod
  xvfb-run --auto-servernum npm run build:preload-cache
  npm run build:release -- --arm64 --publish=never --linux deb
  echo "Generating SBOM at /Signal-Desktop/release/manifest.spdx.json"
  npm sbom --sbom-format="spdx" --sbom-type="application" > /Signal-Desktop/release/manifest.spdx.json
  if [ "$TEST" = "yes" ]; then
    xvfb-run --auto-servernum npm run test-node
    xvfb-run --auto-servernum npm run test-electron
    xvfb-run --auto-servernum npm run test-release
  fi
  debpath=$(ls /Signal-Desktop/release/signal-desktop_*)
  if [ ! -f /Signal-Desktop/release/.private.key ]; then
    echo "Generating New Keypair."
    npm run ts/updater/generateKeyPair.ts -- --key /Signal-Desktop/release/public.key --private /Signal-Desktop/release/.private.key
    echo "Signing Release."
    npm run sign-release -- --private /Signal-Desktop/release/.private.key --update $debpath
  else
    echo "Signing Release."
    npm run sign-release -- --private /Signal-Desktop/release/.private.key --update $debpath
    shred /Signal-Desktop/release/.private.key
    rm -f /Signal-Desktop/release/.private.key
  fi
  pushd release/
    sha512sum *.deb && sha512sum *.deb >> release.sha512sum
    echo "# 0mniteck's Current GPG Key ID: 287EE837E6ED2DD3" >> release.sha512sum
    echo "# Source Date Epoch: ${SOURCE_DATE_EPOCH}" >> release.sha512sum
    echo "Build Complete: "$(date -u '+on %D at %R UTC') && echo "# Build Complete: "$(date -u '+on %D at %R UTC') >> release.sha512sum
    echo "# Container Build System: $(uname -o) $(uname -r) $(uname -m) $(lsb_release -ds) $(uname -v)"  >> release.sha512sum
    ls -la
  popd
popd
