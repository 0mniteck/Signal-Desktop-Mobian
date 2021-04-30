# Apply sqlcipher patch to use local (dynamic) libraries
echo "Entering /sqlcipher"
pushd /sqlcipher
patch -Np1 -i ../sqlcipher.patch
popd

# Build and replace arm version of libsignal-client-node
echo "Entering /libsignal-client"
pushd /libsignal-client
cargo update -p neon
yarn install
mkdir -p /libsignal-client-node/build/
sleep 1s # For some reason this file seems to appear a little late.
echo "Entering /libsignal-client-node"
cp /libsignal-cilent/build/Release/libsignal_client_linux_arm64.node /libsignal-client-node/build/libsignal_client_linux_arm64.node
popd

# Signal build requirements
echo "Entering /Signal-Desktop"
pushd /Signal-Desktop
git-lfs install
# Drop "--no-sandbox" commit from build
git config --user.name "local"
git config --user.email "local@localhost"
git revert 1ca0d821078286d5953cf0d598e6b97710f816ef
# Dry run
yarn install --frozen-lockfile
## Dynamically link openssl - from https://gitlab.com/ohfp/pinebookpro-things/-/blob/master/signal-desktop/openssl-linking.patch
sed -r 's#("@journeyapps/sqlcipher": ").*"#\1file:../sqlcipher"#' -i package.json
## Force local (arm) build of libsignal-client
cd /Signa/-Desktop; sed -r 's#("libsignal-client": ").*"#\1file:../libsignal-client-node"#' -i package.json
yarn install --frozen-lockfile
yarn grunt
yarn build:webpack
yarn test
yarn build-release --arm64 --linux --dir
popd
