#!/usr/bin/env bash

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

set -e

BUILD_TYPE="public"
TEST="$1"
SIGNING_KEY="$2"

echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
  echo "Starting Build "$(date -u '+on %D at %R UTC') && echo "# Starting Build "$(date -u '+on %D at %R UTC') > release/release.sha512sum
  echo "RUN_TESTS: ${TEST}"
  echo "BUILD_TYPE: ${BUILD_TYPE}"
  echo "SOURCE_DATE_EPOCH: ${SOURCE_DATE_EPOCH}"
  
  NPM_CONFIG_LOGLEVEL="verbose" pnpm install
  pnpm run generate
  pnpm run lint
  pnpm run lint-deps
  pnpm run lint-license-comments
  REQUIRE_SIGNAL_LIB_FILES=1 pnpm run build:acknowledgments
  
  NPM_CONFIG_LOGLEVEL="verbose" pnpm install
  pnpm run generate
  if [ "${BUILD_TYPE}" = "public" ]; then
    pnpm run prepare-beta-build
  elif [ "${BUILD_TYPE}" = "alpha" ]; then
    pnpm run prepare-alpha-version
    pnpm run prepare-alpha-build
  elif [ "${BUILD_TYPE}" = "staging" ]; then
    pnpm run prepare-alpha-version
    pnpm run prepare-staging-build
  elif [ "${BUILD_TYPE}" = "test" ]; then
    pnpm run prepare-alpha-version
    pnpm run prepare-alpha-build
  elif [ "${BUILD_TYPE}" = "dev" ]; then
    echo "dev build, using package.json as is"
  else
    echo "Unknown build type ${BUILD_TYPE}"
    exit 1
  fi
  pnpm run build:esbuild:prod
  ARTIFACTS_DIR="artifacts/linux" xvfb-run --auto-servernum pnpm run build:preload-cache
  DISABLE_INSPECT_FUSE="on" pnpm run build:release --arm64 --publish=never --linux deb
  if [ "$TEST" = "yes" ]; then
    xvfb-run --auto-servernum pnpm run test-node
    ARTIFACTS_DIR="artifacts/linux" xvfb-run --auto-servernum pnpm run test-electron
    NODE_ENV="production" xvfb-run --auto-servernum pnpm run test-release
  fi
  pushd release/
    sha512sum *.deb && sha512sum *.deb >> release.sha512sum
    echo "# $REPO's Current GPG Key ID: $SIGNING_KEY" >> release.sha512sum
    echo "# Source Date Epoch: $SOURCE_DATE_EPOCH" >> release.sha512sum
    echo "Build Complete: "$(date -u '+on %D at %R UTC') && echo "# Build Complete: "$(date -u '+on %D at %R UTC') >> release.sha512sum
    echo "# Container Build System: $(uname -o) $(uname -r) $(uname -m) $(lsb_release -ds) $(uname -v)"  >> release.sha512sum
    ls -la
  popd
popd
