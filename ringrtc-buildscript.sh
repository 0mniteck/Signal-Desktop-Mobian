pushd /ringrtc
patch -Np 1 -i ../0001-modify-electron-build-script-for-aarch64-linux.patch
patch -Np 1 -i ../0002-update-neon-so-it-does-not-fail-due-to-type-issues-o.patch
cp ../webrtc_objc_mac.patch .
make electron PLATFORM=unix
popd
