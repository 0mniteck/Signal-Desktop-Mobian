set -x
# Apply sqlcipher patch to use local (dynamic) libraries
echo "Entering /sqlcipher"
pushd /sqlcipher
patch -Np1 -i ../sqlcipher.patch
popd

# Build and replace arm version of libsignal-client-node
echo "Entering /libsignal-client"
pushd /libsignal-client
#git checkout ts-0.3.0 # Version 0.3.0 as requested in S-D/package.json
cargo update -p neon
yarn install
#mkdir -p /libsignal-client-node/build/
sleep 5s # For some reason this file seems to appear a little late.
echo "Entering /libsignal-client-node"
#cp build/Release/libsignal_client_linux_arm64.node /libsignal-client-node/build/
mkdir -p /signal-client/prebuilds/linux-arm64
cp build/Release/libsignal_client_linux_arm64.node /signal-client/prebuilds/linux-arm64/node.napi.node
popd
#pushd /libsignal-client-node
#git switch jack/release-0.3.3
#popd

# Build better-sqlite3 (it's worse)
echo "Entering /better-sqlite3"
pushd /better-sqlite3
patch -Np1 -i ../better-sqlite3.patch
rm Relase/obj/gen/sqlite3/OpenSSL-Linux/libcrypto.a
npm install node-gyp tar # build depends
npm run build-release
yarn install
popd

# Build zkgroup
echo "Entering /zkgroup"
pushd /zkgroup
# In this case, the patch from privacyshark makes things worse
#patch -Np1 -i ../zkgroup.patch
make libzkgroup
# Copy the output library to the location provided by signal when running it on device...
cp target/release/libzkgroup.so /signal-zkgroup-node/libzkgroup-arm64.so
popd

# Signal build requirements
echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
git-lfs install
patch -Np1 -i ../0001-Remove-no-sandbox-patch.patch
patch -Np1 -i ../0001-Minimize-gutter-on-small-screens.patch
# Drop "--no-sandbox" commit from build
git config --local user.name "local"
git config --local user.email "local@localhost"
git revert 1ca0d821078286d5953cf0d598e6b97710f816ef
# Dry run
#yarn install --frozen-lockfile # always hangs
## Force local (arm) build of libsignal-client
# Now hosted in NPM, hopefully build's properly...
#sed -r 's#("libsignal-client": ").*"#\1file:../libsignal-client-node"#' -i package.json # old versions
sed -r 's#"@signalapp/signal-client": ".*",#"@signalapp/signal-client": "file:../signal-client",#' -i package.json
sed -r 's#("better-sqlite3": ").*"#\1file:../better-sqlite3"#' -i package.json
sed -r 's#("ringrtc": ").*"#\1file:../signal-ringrtc-node"#' -i package.json
sed -r 's#("zkgroup": ").*"#\1file:../signal-zkgroup-node"#' -i package.json
# This may have to be cancelled and run again to get it to actually rebuild deps...
yarn install # not recommended by signal, but required due to those two sed lines.
yarn install --frozen-lockfile
yarn grunt
yarn build:webpack
#yarn test always fails on arm...
yarn build:release --arm64 --linux --dir
popd
