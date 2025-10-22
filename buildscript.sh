#!/bin/bash

while getopts ":c:i:d:m:p:r:t:" opt; do
    case $opt in
        c) # Cross Compile: yes/No
            CROSS="$OPTARG"
            ;;
        d) # Date: source_date_epoch
            EPOCH="$OPTARG"
            ;;
        i) # Increment: .version
            INC="$OPTARG"
            ;;
        m) # Mount Luks partition: mmcblk1p1
            MOUNT="$OPTARG"
            ;;
        p) # Push-branch: debug
            BRANCH="$OPTARG"
            ;;
        r) # Release-tag: tagname
            TAG="$OPTARG"
            ;;
        t) # run-Tests: yes/No
            TEST="$OPTARG"
            ;;
        \?)
            echo "Invalid option: -$opt" >&2
            ;;
        :)
            echo "Option -$opt requires an argument." >&2
            ;;
    esac
done
if [ "$BRANCH" = "" ]; then
    BRANCH="debug"
fi
if [ "$TEST" = "" ]; then
    TEST="no"
fi
if [ "$CROSS" = "" ]; then
    CROSS="no"
fi
echo "Cross Compile: $CROSS"
echo "Increment: $INC"
echo "Override Source Epoch: $EPOCH"
echo "Mount /dev/mmcblk1: $MOUNT"
echo "Push to Branch: $BRANCH"
echo "Tag Release: $TAG"
echo "Run Tests: $TEST"
sleep 5
sudo apt install ansifilter bc git-lfs screen snapd systemd-cryptsetup -y
git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git && git-lfs install
./increment.sh $INC
sudo screen -L -Logfile builder.log bash -c './re-run.sh public '$(($EPOCH))' '$MOUNT' '$TEST' '$CROSS && mv builder.log builds/release/builder.log
echo "# Base Build System: $(uname -o) $(uname -r) $(uname -p) $(lsb_release -ds) $(lsb_release -cs) $(uname -v)"  >> builds/release/release.sha512sum
awk '{a[i++]=$0}END{for(j=0;j<i-2;j++)print a[j];print a[i-1];print a[i-2]}' builds/release/release.sha512sum > tmp && mv tmp builds/release/release.sha512sum
ls -la builds/release/
./git.sh $BRANCH $TAG
cd ..
