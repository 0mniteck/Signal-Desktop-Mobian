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

if [ "$TEST" = "" ]; then
  TEST="no"
  nulled=/dev/null
else
  TEST="yes"
  nulled=/tmp/nulled.log
  debug="set -x"
  
  echo "Cross Compile: $CROSS"
  echo "Increment: $INC"
  echo "Override Source Epoch: $EPOCH"
  echo "Mount /dev/: $MOUNT"
  echo "Push to Branch: $BRANCH"
  echo "Tag Release: $TAG"
  echo "Run Tests: $TEST"
fi

if [ "$BRANCH" = "" ]; then
  BRANCH="debug"
fi
if [ "$CROSS" = "" ]; then
  CROSS="yes"
fi

$debug

run_id=$PKEXEC_UID
run_as=$(id -u $run_id -n)

if [[ "$run_id" == "" ]]; then
  if [[ "$(whoami)" == *root* ]]; then
    echo && echo "DO NOT run with sudo or su root"
    echo "Instead Use: ~\$ 'pkexec --keep-cwd ./buildscript.sh'" && echo
    exit 1
  else
    echo && echo "Pkexec is required for installation steps"
    echo "Using: ~\$ 'pkexec --keep-cwd ./buildscript.sh'" && echo
    runm="exec pkexec --keep-cwd '$0' '$1' '$2' '$3' '$4' '$5' '$6' '$7' "
    if [[ "$(which asciinema)" == "/usr/bin/asciinema" ]]; then
      repo=$(cat .identity | grep REPO= | cut -d'=' -f2)
      project=$(cat .identity | grep PROJECT= | cut -d'=' -f2)
      rel_date=$(date -d "$(date)" +%m-%d-%Y)
      mkdir -p $HOME/.casts/$repo
      exec asciinema rec --overwrite -t "$repo/$project:$rel_date" $HOME/.casts/$repo/$project:$rel_date.cast -c "$runm"
    else
      $runm
    fi
    exit 0
  fi
fi

if [ "$TEST" = "yes" ]; then
  touch $nulled
  chown root:root $nulled
fi

if [[ "$(cat /lib/udev/rules.d/60-scdaemon.rules | grep $run_as)" != *$run_as* ]]; then
  sed -i "s/\"1050\", ATTR{idProduct}==\"040.\", /&MODE=\"0660\", GROUP=\"$run_as\", /g" \
  /lib/udev/rules.d/60-scdaemon.rules
  udevadm control --reload-rules && udevadm trigger
fi

while [[ "$(lsusb | grep Yubikey)" != *Yubikey* ]]; do
  printf "\rPlease insert yubikey...\033[K"
done && sleep 1 && echo
chown $run_as:$run_as /dev/hidraw*

DEVICE=$(lsusb -d 1050:0407 | grep -o Device.... - | grep -o [0-9][0-9][0-9])
BUS=$(lsusb -d 1050:0407 | grep -o Bus.... - | grep -o [0-9][0-9][0-9])
set_facl=$(echo "setfacl -m u:$run_as:rw /dev/bus/usb/$BUS/$DEVICE")
echo $set_facl | bash || echo $set_facl | bash || exit 1

home=/home/$run_as
run_dir=/run/user/$run_id
data_dir=$home/.local/share
sysusr_path=$data_dir/systemd/user
rootless_path=$data_dir/rootless
docker_data=$data_dir/docker
snap_path=snap/docker/current
docker_path=/$snap_path/bin
docker=$docker_path/docker
systemd_service=/etc/systemd/system/snap.docker.dockerd.service
sysusr_service=$sysusr_path/docker.dockerd.service
plugins_path=usr/libexec/docker/cli-plugins
source .pinned_ver

sed_ech=$(cat << _EOF__
\\\\[Service\\\\]\\
Group=$run_as\\
Slice=docker.slice\\
_EOF__
)

quiet() {
  echt="$@"
  script -a -q -c "$echt" $nulled > $nulled
}

clean_most() {
  rm -r -f /home/root/*
  rm -r -f /root/snap/docker/
  rm -r -f /run/snap.docker/
  rm -r -f /run/containerd/
  rm -r -f /run/docker*
  rm -r -f /run/runc/
  rm -r -f /usr/libexec/docker/
  rm -r -f /var/lib/snapd/cache/*
  rm -r -f $run_dir/containerd/
  rm -r -f $run_dir/docker*
  rm -r -f $run_dir/runc/
  rm -r -f $docker_data*
}

clean_all() {
  rm -r -f /var/snap/docker/
  rm -r -f $home/snap/docker/
  rm -r -f $home/.docker/
  rm -r -f $data_dir/rootless*
  rm -r -f $data_dir/systemd/
  clean_most
}

clean_all

apt-get -qq update && apt-get -qq upgrade -y
apt-get -qq install -y bc cosign git-lfs gnupg2 gpg-agent \
                       jq pkexec rootlesskit scdaemon \
                       slirp4netns snapd systemd-container \
                       systemd-cryptsetup uidmap

snap install syft --classic && wait
snap install grype --classic && wait

unmount() {
    quiet snap disable docker
    quiet kill $(lsof -F p $docker_data 2> $nulled | cut -d'p' -f2)
    rm -r -f $docker_data/*
    sync
    quiet umount $docker_data
    sleep 1
    quiet systemd-cryptsetup detach Luks-Signal
    sleep 1
    quiet dmsetup remove /dev/mapper/Luks-Signal
    sleep 1 && rm -r -f $docker_data/
    quiet snap enable docker
}

if [ "$MOUNT" != "" ]; then
    unmount
fi

snap remove docker --purge 2> $nulled && wait || echo "Failed to remove Docker"
quiet networkctl delete docker0

if [[ "$(uname -m)" == "aarch64" ]]; then
  snap install docker --revision=$docker_snap_arm64_ver && wait || echo "Failed to install Docker"
  quiet systemctl mask snap.docker.nvidia-container-toolkit --runtime --now
elif [[ "$(uname -m)" == "x86_64" ]]; then
  snap install docker --revision=$docker_snap_amd64_ver && wait || echo "Failed to install Docker"
else
  echo 'Unknown Architecture '$(uname -m)
  exit 1
fi
echo

snap stop docker && wait
systemctl reset-failed && wait
systemctl stop snap.docker.* --all && wait
quiet systemctl mask snap.docker.dockerd --runtime --now
quiet networkctl delete docker0
systemctl daemon-reload

clean_most

if [ "$MOUNT" != "" ]; then
  echo && rm -f -r $docker_data/ && mkdir -p $docker_data && chown $run_as:$run_as $docker_data
  systemd-cryptsetup attach Luks-Signal /dev/$MOUNT
  sleep 1 && echo
  mount /dev/mapper/Luks-Signal $docker_data
  sleep 1 && rm -f -r $docker_data/* && chown $run_as:$run_as $docker_data
fi

groupadd -f docker && wait
usermod -aG docker $run_as && wait
mkdir -p /home/root && sed -i "s|:/root:|:/home/root:|" /etc/passwd

mkdir -p /$plugins_path && wait
ln -f -s /$snap_path/$plugins_path/docker-buildx /$plugins_path/docker-buildx > $nulled || exit 1
ln -f -s /$snap_path/$plugins_path/docker-compose /$plugins_path/docker-compose > $nulled || exit 1

if [ "$TEST" = "yes" ]; then
  chown $run_as:$run_as $nulled
fi

machinectl shell $run_as@ /bin/bash -c "
$debug
cd $(echo $PWD)
HOME=$home; CROSS=$CROSS; EPOCH=$EPOCH; INC=$INC
MOUNT=$MOUNT; BRANCH=$BRANCH; TAG=$TAG; TEST=$TEST

mkdir -p $home/.ssh && chmod 0700 $home/.ssh && \
touch $home/.ssh/config && chmod 0644 $home/.ssh/config
ssh_conf=\$(<\$HOME/.ssh/config)

systemctl --user restart gpg-agent.service && wait
export GPG_TTY=\$(tty)

source .identity
source .pinned_ver
chmod 0600 $home/\$IDENTITY_FILE && chmod 0644 $home/\$IDENTITY_FILE.pub

echo
source_date_epoch=1
if [[ \"\$EPOCH\" = *today* ]]; then
  timestamp=\$(date -d \$(date +%D) +%s);
  if [[ \"\$timestamp\" != \"\" ]]; then
    echo \"Setting SOURCE_DATE_EPOCH from today's date: \$(date +%D) = @\$timestamp\";
    source_date_epoch=\$((timestamp));
  else
    echo \"Can't get timestamp. Defaulting to 1.\";
    source_date_epoch=1;
  fi
elif [[ \"\$EPOCH\" != 0 ]]; then
  echo \"Using override timestamp \$EPOCH for SOURCE_DATE_EPOCH.\"
  source_date_epoch=\$((\$EPOCH))
else
  timestamp=\$(cat Results/release.sha512sum | grep Epoch | cut -d ' ' -f5)
  if [[ \"\$timestamp\" != \"\" ]]; then
    echo \"Setting SOURCE_DATE_EPOCH from release.sha512sum: \$(cat Results/release.sha512sum | grep Epoch | cut -d ' ' -f5)\"
    source_date_epoch=\$((timestamp))
    check_file=1
    cp builds/release/release.sha512sum /tmp/release.last.sha512sum
  else
    echo \"Can't get latest commit timestamp. Defaulting to 1.\"
    source_date_epoch=1
  fi
fi
SOURCE_DATE_EPOCH=\$source_date_epoch

clean_some() {
  rm -r -f /home/$run_as/.docker/
  rm -r -f /home/$run_as/.local/share/rootless*
  rm -r -f /home/$run_as/.local/share/systemd/
}

sys_ctl_common() {
  systemctl --user daemon-reload && wait
  systemctl --user reset-failed && wait
  systemctl --user stop docker* --all && wait
  systemctl --user list-units docker* --all && echo
}

echo && read -p 'Press enter to start docker login'
clean_some && docker login && mkdir -p $docker_data/.docker && wait && \
ln -f -s $home/$snap_path/.docker/config.json $docker_data/.docker/config.json || exit 1
echo && syft login registry-1.docker.io -u \$USERNAME && echo 'Logged in to syft' && echo

mkdir -p $rootless_path/tmp && wait
> $rootless_path.sh && > $rootless_path/env-docker && > $rootless_path/env-rootless && chmod +x $rootless_path.sh && wait

cat >> $rootless_path.sh << __EOF
#!/bin/bash
$debug
mkdir -p $rootless_path/tmp && wait
> $rootless_path/env-docker && > $rootless_path/env-rootless && wait
rootlesskit --copy-up=/etc --copy-up=/run --net=slirp4netns --disable-host-loopback --state-dir $rootless_path/tmp /bin/bash -i -c '
env > $rootless_path/env-docker && grep ROOTLESS $rootless_path/env-docker > $rootless_path/env-rootless && rm -f $rootless_path/env-docker

echo \"docker=$docker
HOME=$home
XDG_CONFIG_HOME=$home
X2DG_RUNTIME_DIR=/run/user/$run_id
DOCKER_TMPDIR=$docker_data/tmp
DOCKER_CONFIG=$docker_data/.docker
DOCKER_HOST=unix:///run/user/$run_id/docker.sock
BUILDX_METADATA_PROVENANCE=max
BUILDX_METADATA_WARNINGS=1
BUILDKIT_PROGRESS=plain
SOURCE_DATE_EPOCH=\$source_date_epoch
SYFT_CACHE_DIR=$docker_data/syft
GRYPE_DB_CACHE_DIR=$docker_data/grype
PATH=/usr/sbin:/usr/bin:/snap/bin:$docker_path\" >> $rootless_path/env-rootless

sed \"s/^/export -- /g\" $rootless_path/env-rootless > $rootless_path/env-rootless.exp
\$(echo \"echo echo $\(\<$rootless_path/env-rootless\)\" $(echo $docker)d --rootless \
--userland-proxy-path=$docker_path/docker-proxy --init-path=$docker_path/docker-init \
--feature cdi=false --group docker) | /bin/bash | /bin/bash 2>> $rootless_path/rootless.log'
__EOF

mkdir -p $sysusr_path && wait && \
cp $systemd_service $sysusr_service || exit 1

sed -z -i \"s|\[Service\]\nEnv|$(printf \"%s\\\\n\" $(echo $sed_ech))Env|\" $sysusr_service
sed -i \"s|EnvironmentFile.*|EnvironmentFile=-$rootless_path/env-rootless|\" $sysusr_service
sed -i \"s|ExecStart.*|ExecStart=/bin/bash -c \'$data_dir/rootless.sh\'|\" $sysusr_service

mkdir -p $docker_data/syft && mkdir -p $docker_data/grype
scan_using_grype() { # $1 = Name, $2 = Repo/Name:tag or /Path --select-catalogers debian, $3 = Attest Tag
  grype config > $docker_data/.grype.yaml
  if [[ \"\$3\" != \"\" ]]; then
    read -p 'Press enter to start attestation' && echo
    echo 'Starting Syft...'
    TMPDIR=$docker_data/syft syft attest --output spdx-json docker.io/\$REPO/\$1:\$3 || \
    TMPDIR=$docker_data/syft syft attest --output spdx-json docker.io/\$REPO/\$1:\$3 || exit 1
    echo
  else
    echo 'Starting Syft...'
  fi
  TMPDIR=$docker_data/syft syft scan \$2 -o spdx-json=\$1.spdx.json || \
  TMPDIR=$docker_data/syft syft scan \$2 -o spdx-json=\$1.spdx.json || exit 1
  rm -f -r $docker_data/syft/*
  echo && echo 'Starting Grype...'
  script -q -c \"TMPDIR=$docker_data/grype grype sbom:\$1.spdx.json \
  -c $docker_data/.grype.yaml -o json > \$1.grype.json\" \$1.grype.tmp.tmp > \$1.grype.tmp
  rm -f -r $docker_data/grype/*
  marker() { # $1 = Name, $2 = Order, $3 = Marker/ID
    unset \"wright\$2\"
    grep \"\$3\" \$1.grype.tmp | tail -n 1 > \$1.grype.status.\$2
    tr -d '\000-\037\177' < \$1.grype.status.\$2 | sed '/^$/d' > \$1.grype.status.\$2.tmp
    line1=\$(cat \$1.grype.status.\$2)
    if [[ \"\$line1\" == *\$3* ]]; then
      export \"wright\$2\"=\"\$line1\"
    fi
  }
  marker \$1 1 \"✔ Scanned for vulnerabilities\"
  marker \$1 2 \"├── by severity:\"
  marker \$1 3 \"└── by status:\"
  echo \$wright1 > \$1.grype.status
  echo \$wright2 >> \$1.grype.status
  echo \$wright3 >> \$1.grype.status
  sed -i 's/[^[:print:]]//g' \$1.grype.status
  sed -i 's/\[K//g' \$1.grype.status
  sed -i 's/\[2A//g' \$1.grype.status
  sed -i 's/\[3A//g' \$1.grype.status
  rm -f \$1.grype.tmp*
  rm -f \$1.grype.status.*
  cp \$1.grype.status readme.md
  sed -i '1,3s/^/#### /g' readme.md
  echo '## ' >> readme.md
  echo '\`\`\`' >> readme.md
}

quiet() {
  echt=\"\$@\"
  script -a -q -c \"\$echt\" $nulled > $nulled
}

sys_ctl_common
systemctl --user start docker.dockerd && sleep 10
systemctl --user status docker.dockerd --all --no-pager -n 150 > $rootless_path/rootless.ctl.log

source $rootless_path/env-rootless.exp

docker() {
exec $docker \"\$@\"
}

quiet \"\$docker info | grep rootless > $rootless_path/rootless.status\"
if [[ \"\$(grep root $rootless_path/rootless.status)\" != *rootless* ]]; then
  echo \"Rootless Docker Failed\" && echo
  exit 1
else
  echo \"Rootless Docker Started\" && echo
  echo \"Rootless Docker Started\" > $rootless_path/rootless.status
fi

if [[ \"\$ssh_conf\" != *\$PROJECT* ]]; then
  echo \"
Host \$PROJECT
  Hostname github.com
  IdentityFile $home/\$IDENTITY_FILE
  IdentitiesOnly yes\" >> $home/.ssh/config
fi
eval \"\$(ssh-agent -s)\" && wait
ssh -T git@github.com 2> $nulled
ssh-add -t 1D -h git@github.com $home/\$IDENTITY_FILE && ssh-add -l && echo

git remote remove origin && git remote add origin git@\$PROJECT:\$REPO/\$PROJECT.git
git-lfs install && echo "Starting git fetch..." && git fetch --unshallow 2> $nulled

git submodule --quiet foreach \"cd .. && git config submodule.\$name.url git@\$PROJECT:\$REPO/\$PROJECT.git\"
git submodule update --init --remote --merge && echo
git submodule --quiet foreach \"git remote remove origin && git remote add origin git@\$PROJECT:\$REPO/\$PROJECT.git\"

if [[ \"\$(gpg-card list - openpgp)\" == *\$SIGNING_KEY* ]]; then
  echo && echo \"Signing key present\" && echo
else
  echo && echo \"Signing key \$SIGNING_KEY missing\"
  echo \"Check Yubikey and .identity file\" && echo
  lsusb && ls -la /dev/hid* && gpg-card list - openpgp
  systemctl --user status gpg-agent* --all --no-pager
  ls -la $home/.gnupg
  exit 1
fi

unset rel_date date_rel rel_ver sub_ver
rel_date=\$(date -d \"\$(date)\" +\"%m-%d-%Y\")
date_rel=\$(date -d \"\$(date)\" +\"%Y-%m-%d\")
rel_ver=\$(git log --pretty=reference --grep=Successful\\ Build\\ of\\ Release\\ \$date_rel | wc -l)
sub_ver=\$(git submodule --quiet foreach \"git log --pretty=reference --grep=\$rel_date\" | wc -l)

if [[ \"\$rel_ver\" -lt 1 ]]; then
  wait
elif [[ \"\$sub_ver\" -ge 1 ]]; then
  rel_date=\$(date -d \"\$(date)\" +\"%m-%d-%Y-00\$sub_ver\")
  date_rel=\$(date -d \"\$(date)\" +\"%Y-%m-%d-00\$sub_ver\")
  echo \"Build Subversion: 00\$sub_ver\" && echo 
else
  SUBVERSION=1
fi

if [[ \"\$(uname -m)\" == \"aarch64\" ]]; then
  docker run --privileged --rm tonistiigi/binfmt:qemu-v10.0.4-59 --install amd64
  echo
elif [[ \"\$(uname -m)\" == \"x86_64\" ]]; then
  docker run --privileged --rm tonistiigi/binfmt:qemu-v10.0.4-59 --install arm64
  echo
else
  echo 'Unknown Architecture '\$(uname -m)
  exit 1
fi

source modules

mkdir -p Results && pushd Results
  scan_using_grype ubuntu \"/ --select-catalogers debian\"
  cat ../*/*.digest > image.digests
  cat image.digests >> readme.md && cat readme.md && echo
popd

git status && git add -A && git status && read -p 'Press enter to launch pinentry'
git commit -a -S -m \"Successful Build of Release \$date_rel\" && git push --set-upstream origin \$(git rev-parse --abbrev-ref HEAD):\$BRANCH
if [ \"\$TAG\" != \"\" ]; then
  git tag -a \"\$TAG\" -s -m \"Tagged Release \$TAG\" && sleep 5 && git push origin \"\$TAG\"
fi

ssh-add -D && eval \"\$(ssh-agent -k)\"
clean_some
sys_ctl_common"

if [ "$TEST" = "yes" ]; then
  chown root:root $nulled
fi

quiet systemctl unmask snap.docker.dockerd --runtime
quiet systemctl unmask snap.docker.nvidia-container-toolkit --runtime

if [ "$MOUNT" != "" ]; then
    unmount
fi

snap remove docker --purge || echo "Failed to remove Docker"
quiet networkctl delete docker0

snap remove grype --purge
snap remove syft --purge

sed -i "s|:/home/root:|:/root:|" /etc/passwd
delgroup docker

clean_all
systemctl daemon-reload
exit 0
