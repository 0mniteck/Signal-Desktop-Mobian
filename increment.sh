#!/bin/bash
chmod +x ./auto-update-cron.sh
Last_Version_Number=7.23
Version_Number=$(echo "$Last_Version_Number + .05" | bc -l)

sed -i s/signal-desktop_$(echo $Last_Version_Number).0_arm64.deb/signal-desktop_$(echo $Version_Number).0_arm64.deb/g docs/_layouts/default.html

sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g docs/README.md

sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g README.md

sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g git.sh

sed -i s/$(echo $Last_Version_Number).x/$(echo $Version_Number).x/g Dockerfile

sed -i s/Last_Version_Number=$Last_Version_Number/Last_Version_Number=$Version_Number/g increment.sh

echo Version Incremented From v$Last_Version_Number To v$Version_Number

exit
