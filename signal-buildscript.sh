# Apply sqlcipher patch to use local (dynamic) libraries
echo "Entering /sqlcipher"
pushd /sqlcipher
patch -Np1 -i ../sqlcipher.patch
popd

# Build libsignal-client
echo "Entering /libsignal-client"
pushd /libsignal-client
cargo update -p neon
yarn install
mkdir -p /signal-client/prebuilds/linux-arm64
mkdir -p /signal-client/prebuilds/linux-aarch64
cp build/Release/libsignal_client_linux_arm64.node /signal-client/prebuilds/linux-arm64/node.napi.node
cp build/Release/libsignal_client_linux_arm64.node /signal-client/prebuilds/linux-aarch64/node.napi.node
popd

# Build better-sqlite3
echo "Entering /better-sqlite3"
pushd /better-sqlite3
patch -Np1 -i ../better-sqlite3.patch
rm -f Relase/obj/gen/sqlite3/OpenSSL-Linux/libcrypto.a
npm install node-gyp tar
npm run build-release
yarn install
popd

# Build zkgroup
echo "Entering /zkgroup"
pushd /zkgroup
make libzkgroup
rm -f /signal-zkgroup-node/libzkgroup.so
cp target/release/libzkgroup.so /signal-zkgroup-node/libzkgroup.so
popd

# Build Signal
echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
sed -r 's#("@signalapp/signal-client": ").*"#\1file:../signal-client"#' -i package.json
sed -r 's#("better-sqlite3": ").*"#\1file:../better-sqlite3"#' -i package.json
sed -r 's#("ringrtc": ").*"#\1file:../signal-ringrtc-node"#' -i package.json
sed -r 's#("zkgroup": ").*"#\1file:../signal-zkgroup-node"#' -i package.json
yarn install
yarn install --frozen-lockfile
yarn grunt
yarn build:webpack
yarn build:release --arm64 --linux --dir
yarn build:release --arm64 --linux deb
popd
