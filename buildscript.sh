#!/bin/bash

while getopts ":i:d:m:p:r:t:" opt; do
    case $opt in
        i)
            INC="$OPTARG"
            ;;
        d)
            EPOCH="$OPTARG"
            ;;
        m)
            MOUNT="$OPTARG"
            ;;
        p)
            BRANCH="$OPTARG"
            ;;
        r)
            TAG="$OPTARG"
            ;;
        t)
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
if [ "$MOUNT" = "" ]; then
    MOUNT="no"
fi
if [ "$BRANCH" = "" ]; then
    BRANCH="debug"
fi
if [ "$TEST" = "" ]; then
    TEST="no"
fi
echo "Increment: $INC"
echo "Override Source Epoch: $EPOCH"
echo "Mount /dev/mmcblk1: $MOUNT"
echo "Push to Branch: $BRANCH"
echo "Tag Release: $TAG"
echo "Run Tests: $TEST"
sleep 5
sudo apt install bc git-lfs screen snapd systemd-cryptsetup -y
git remote remove origin && git remote add origin git@Signal:0mniteck/Signal-Desktop-Mobian.git && git-lfs install
./increment.sh $INC
sudo screen -L -Logfile builder.log bash -c './re-run.sh public '$(($EPOCH))' '$MOUNT' '$TEST && mv builder.log builds/release/builder.log
echo "# Base Build System: $(uname -o) $(uname -r) $(uname -p) $(lsb_release -ds) $(lsb_release -cs) $(uname -v)"  >> builds/release/release.sha512sum
awk '{a[i++]=$0}END{for(j=0;j<i-2;j++)print a[j];print a[i-1];print a[i-2]}' builds/release/release.sha512sum > tmp && mv tmp builds/release/release.sha512sum
ls -la builds/release/
./git.sh $BRANCH $TAG
cd ..
