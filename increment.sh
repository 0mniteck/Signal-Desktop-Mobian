#!/bin/bash
if [ "$1" != "" ]; then
Last_Version_Number=7.67
Version_Number=$(echo "$Last_Version_Number + $1" | bc -l)
sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g docs/_layouts/default.html
sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g docs/README.md
sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g readme.md
sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g git.sh
sed -i s/$(echo $Last_Version_Number)/$(echo $Version_Number)/g Dockerfile
sed -i s/Last_Version_Number=$Last_Version_Number/Last_Version_Number=$Version_Number/g increment.sh
echo Version Incremented From v$Last_Version_Number To v$Version_Number
fi
exit
