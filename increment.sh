#!/bin/bash

Last_Version_Number=6.35
Version_Number=$(echo "$Last_Version_Number + .01" | bc -l)
Last_Branch_Number=$Last_Version_Number.x
Branch_Number=$Version_Number.x

sed -i s/signal-desktop_$(echo $Last_Version_Number).0_arm64.deb/signal-desktop_$(echo $Version_Number).0_arm64.deb/g _layouts/default.html

sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g README.md

sed -i s/$(echo $Last_Branch_Number)/$(echo $Branch_Number)/g Dockerfile

sed -i s/Last_Version_Number=$Last_Version_Number/Last_Version_Number=$Version_Number/g increment.sh

echo Version Incremented From v$Last_Version_Number To v$Version_Number

exit