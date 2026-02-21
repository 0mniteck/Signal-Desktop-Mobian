#!/usr/bin/env -S - bash --norc --noprofile

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
  SKIP_LOGIN="yes"
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
if [ "$CROSS" = "" ]; then
  CROSS="yes"
fi

$debug

run_id=$PKEXEC_UID
run_as=$(id -u $run_id -n)
run_home=/home/$run_as

export -- HOME=$run_home
export -- PATH=/usr/sbin:/usr/bin:/snap/bin

if [[ "$run_id" == "" ]]; then
  if [[ "$(whoami)" == *root* ]]; then
    echo && echo "DO NOT run with sudo or su root"
    echo "Instead Use: ~\$ 'pkexec --keep-cwd ./buildscript.sh'" && echo
    exit 1
  else
    echo && echo "Pkexec is required for installation steps"
    echo "Using: ~\$ 'pkexec --keep-cwd ./buildscript.sh'" && echo
    runm="exec pkexec --keep-cwd '$0' '$1' '$2' '$3' '$4' '$5' '$6' '$7' "
    if [[ "$(which asciinema)" != "" ]]; then
      repo=$(cat .identity | grep REPO= | cut -d'=' -f2)
      project=$(cat .identity | grep PROJECT= | cut -d'=' -f2)
      rel_date=$(date -d "$(date)" +%m-%d-%Y)
      mkdir -p $run_home/.casts/$repo
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

home=$HOME
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
  script -a -q -c "$echt" $nulled >> $nulled
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
apt-get -qq install -y acl bc cosign dosfstools git-lfs gnupg2 gpg-agent \
                       jq parted pkexec rootlesskit scdaemon \
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
quiet apt-get -qq purge -y docker-engine docker docker.io docker-ce docker-ce-cli containerd.io docker.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin
quiet apt-get -qq autoremove -y --purge docker-engine docker docker.io docker-ce docker-ce-cli containerd.io docker.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin
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

if [[ "$(cat /lib/udev/rules.d/60-scdaemon.rules | grep $run_as)" != *$run_as* ]]; then
  sed -i.backup "s/\"1050\", ATTR{idProduct}==\"040.\", /&MODE=\"0660\", GROUP=\"$run_as\", /g" \
  /lib/udev/rules.d/60-scdaemon.rules
  udevadm control --reload-rules && udevadm trigger
fi

if [[ "$SKIP_LOGIN" == "" ]]; then
  while [[ "$(lsusb | grep Yubikey)" != *Yubikey* ]]; do
    printf "\r🔐 Please insert yubikey...\033[K"
  done && sleep 1 && echo
fi
quiet chown $run_as:$run_as /dev/hidraw*

DEVICE=$(lsusb -d 1050:0407 | grep -o Device.... - | grep -o [0-9][0-9][0-9])
BUS=$(lsusb -d 1050:0407 | grep -o Bus.... - | grep -o [0-9][0-9][0-9])
set_facl="setfacl -m u:$run_as:rw /dev/bus/usb/$BUS/$DEVICE"
quiet $set_facl || quiet $set_facl || exit 1

rm -f -r $docker_data/ && mkdir -p $docker_data && chown $run_as:$run_as $docker_data
if [ "$MOUNT" != "" ]; then
  systemd-cryptsetup attach Luks-Signal /dev/$MOUNT
  sleep 1 && echo
  mount /dev/mapper/Luks-Signal $docker_data
  sleep 1 && rm -f -r $docker_data/* && chown $run_as:$run_as $docker_data
fi

groupadd -f docker && wait
usermod -aG docker $run_as && wait
mkdir -p /home/root && sed -i.backup "s|:/root:|:/home/root:|" /etc/passwd

mkdir -p /$plugins_path && wait
ln -f -s /$snap_path/$plugins_path/docker-buildx /$plugins_path/docker-buildx >> $nulled || exit 1
ln -f -s /$snap_path/$plugins_path/docker-compose /$plugins_path/docker-compose >> $nulled || exit 1

if [ "$TEST" = "yes" ]; then
  chown $run_as:$run_as $nulled
else
  declare -- PUSH='"--push"'
fi
if [ "$CROSS" = "yes" ]; then
  declare -- CROSS='"--platform linux/arm64,linux/amd64"'
fi

pushd $docker_data > /dev/null
  set | sort > 0:0.env
  env | sort >> 0:0.env
  declare | sort >> 0:0.env
  chown $run_as:$run_as 0:0.env
popd

machinectl shell $run_as@ /bin/bash -c "
$debug
cd $(echo $PWD)
HOME=$HOME; CROSS=$CROSS; EPOCH=$EPOCH; INC=$INC
MOUNT=$MOUNT; BRANCH=$BRANCH; TAG=$TAG; TEST=$TEST
SKIP_LOGIN=$SKIP_LOGIN; PUSH=$PUSH; PATH=$PATH

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
    cp Results/release.sha512sum /tmp/release.last.sha512sum
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

clean_some

if [[ \"\$SKIP_LOGIN\" == \"\" ]]; then
  echo && read -p '🔐 Press enter to start docker login'
  docker login && mkdir -p $docker_data/.docker && wait && \
  ln -f -s $home/$snap_path/.docker/config.json $docker_data/.docker/config.json || exit 1
  echo && syft login registry-1.docker.io -u \$USERNAME && echo 'Logged in to syft' && echo
fi

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
BUILDKIT_PROGRESS=tty
SOURCE_DATE_EPOCH=\$source_date_epoch
SYFT_CACHE_DIR=$docker_data/syft
GRYPE_DB_CACHE_DIR=$docker_data/grype
PATH=$PATH:$docker_path\" >> $rootless_path/env-rootless

sed \"s/^/declare -- /g\" $rootless_path/env-rootless > $rootless_path/env-rootless.exp
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
scan_using_grype() { # \$1 = Name, \$2 = Repo/Name:tag or '/Path --select-catalogers directory', \$3 = Attest Tag
  if [[ \"\$3\" != \"\" ]]; then
    if [[ \"\$SKIP_LOGIN\" == \"\" ]]; then
      read -p '🔐 Press enter to start attestation' && echo
      echo 'Starting Syft...'
      syft_att_run=\"TMPDIR=$docker_data/syft syft attest \$CROSS --output spdx-json docker.io/\$REPO/\$1:\$3\"
  	  script -q -c \"\$syft_att_run\" /dev/null || \
      script -q -c \"\$syft_att_run\" /dev/null || exit 1
      echo
    else
      echo 'Skipping attestation: not logged in'
    fi
  else
    echo 'Starting Syft...'
  fi
  touch \$1.syft.tmp && tail -f \$1.syft.tmp & pidd=\$!
  syft_run=\"TMPDIR=$docker_data/syft syft scan \$2 \$CROSS -o spdx-json=\$1.spdx.json\"
  script -q -c \"\$syft_run\" /dev/null > \$1.syft.tmp || \
  script -q -c \"\$syft_run\" /dev/null > \$1.syft.tmp || exit 1
  kill \$pidd
  rm -f -r $docker_data/syft/*
  echo && echo 'Starting Grype...'
  grype config > $docker_data/.grype.yaml
  touch \$1.grype.tmp && tail -f \$1.grype.tmp & piddd=\$!
  script -q -c \"TMPDIR=$docker_data/grype grype sbom:\$1.spdx.json \
  -c $docker_data/.grype.yaml \$CROSS -o json --file \$1.grype.json\" /dev/null > \$1.grype.tmp
  kill \$piddd
  rm -f -r $docker_data/grype/*
  marker() { # \$1 = Name, \$2 = Order, \$3 = Marker/ID, \$4 = syft/grype
    unset \"wright\$2\"
    grep \"\$3\" \$1.\$4.tmp | tail -n 1 > \$1.\$4.status.\$2
    line1=\$(cat \$1.\$4.status.\$2)
    if [[ \"\$line1\" == *\$3* ]]; then
      declare -- \"wright\$2\"=\"\$line1\"
    fi
		rm -f \$1.\$4.tmp*
		rm -f \$1.\$4.status.*
  }
  wright() { # \$1 = Name, \$2 = syft/grype
		echo \$wright1 > \$1.\$2.status
		echo \$wright2 >> \$1.\$2.status
		echo \$wright3 >> \$1.\$2.status
		echo \$wright4 >> \$1.\$2.status
		echo \$wright5 >> \$1.\$2.status
		sed -i 's/[^[:print:]]//g' \$1.\$2.status
		sed -i 's/\[K//g' \$1.\$2.status
		sed -i 's/\[2A//g' \$1.\$2.status
		sed -i 's/\[3A//g' \$1.\$2.status
	}
	gryped() { # \$1 = Name
		marker \$1 1 \"✔ Scanned for vulnerabilities\" grype
		marker \$1 2 \"├── by severity:\" grype
		marker \$1 3 \"└── by status:\" grype
		wright \$1 grype
	}
	syfted() { # \$1 = Name
		marker \$1 1 \"✔ Cataloged contents\" syft
		marker \$1 2 \"├── ✔ Packages\" syft
		marker \$1 3 \"├── ✔ Executables\" syft
		marker \$1 4 \"├── ✔ File metadata\" syft
		marker \$1 5 \"└── ✔ File digests\" syft
		wright \$1 syft
	}
	syfted
	gryped
	echo '### '\$1' Syft Scan Results - '\$(syft --version) > \$1.contents
	cat \$1.syft.status >> \$1.contents && rm -f \$1.syft.status
	echo '### '\$1' Grype Scan Results - '\$(grype --version) >> readme.md
	cat \$1.grype.status >> readme.md
	echo '## ' >> readme.md
}

quiet() {
  echt=\"\$@\"
  script -a -q -c \"\$echt\" $nulled >> $nulled
}

sys_ctl_common
systemctl --user start docker.dockerd && sleep 10
systemctl --user status docker.dockerd --all --no-pager -n 150 > $rootless_path/rootless.ctl.log

source $rootless_path/env-rootless.exp

docker() {
  echd=\"\$@\"
  $docker \$echd
}

quiet \"\$docker info | grep rootless > $rootless_path/rootless.status\"
if [[ \"\$(grep root $rootless_path/rootless.status)\" != *rootless* ]]; then
  echo \"Rootless Docker Failed\" && echo && exit 1
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

if [[ \"\$SKIP_LOGIN\" == \"\" ]]; then
  eval \"\$(ssh-agent -s)\" && wait
  ssh -T git@github.com 2> $nulled
  ssh-add -t 1D -h git@github.com $home/\$IDENTITY_FILE && ssh-add -l && echo
  
  git remote remove origin && git remote add origin git@\$PROJECT:\$REPO/\$PROJECT.git
  git-lfs install && echo \"Starting git fetch...\"
  echo \"👆 Please confirm presence on security token for git@ssh (multiple times).\"
  
  git reset --hard && git clean -xfd && git fetch --unshallow 2> $nulled
  git pull \$(git remote -v | awk '{ print \$2 }' | tail -n 1) \$(git rev-parse --abbrev-ref HEAD)
  git submodule --quiet foreach \"cd .. && git config submodule.\$name.url git@\$PROJECT:\$REPO/\$PROJECT.git\"
  git submodule update --init --remote --merge
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

drop_down() {
  read -p 'Dropping down to shell; run source modules or issue docker commands'
  env - bash --noprofile --rcfile <( cat <( declare -p | grep -- -- ); \
    echo 'docker() { echd=\"\$@\"; $docker \$echd; }'; \
    echo \"echo 'Dropped down to shell. exit when done, or press ctrl+d';echo; \
    PS1=\$PS1; declare -p | grep TEST; declare -p | grep SKIP; \
    PROMPT_COMMAND='echo;echo Rootless~Docker:~\$'\")
}

mkdir -p Results && pushd Results
  set | sort > $run_id:$run_id.env
  env | sort >> $run_id:$run_id.env
  declare | sort >> $run_id:$run_id.env
  mv $docker_data/0:0.env 0:0.env
popd

if [[ \"\$SKIP_LOGIN\" == \"\" ]]; then
  source modules || drop_down
else
  drop_down
fi

pushd Results
  scan_using_grype ubuntu \"/ --select-catalogers directory\"
  sed -i 's/^/#### /g' readme.md && echo '\`\`\`' >> readme.md
  cat *.image.digest >> readme.md && cat readme.md && echo
popd

if [[ \"$SKIP_LOGIN\" == \"\" ]]; then
  git status && git add -A && git status && read -p '🔐 Press enter to launch pinentry'
  if [ \"\$BRANCH\" != \"\" ]; then
    git commit -a -S -m \"Successful Build of Release \$date_rel\" && git push --set-upstream origin \$(git rev-parse --abbrev-ref HEAD):\$BRANCH
    if [ \"\$TAG\" != \"\" ]; then
      git tag -a \"\$TAG\" -s -m \"Tagged Release \$TAG\" && sleep 5 && git push origin \"refs/tags/\$TAG\"
    fi
  fi
fi

ssh-add -D && eval \"\$(ssh-agent -k)\"
clean_some
sys_ctl_common"

if [ "$TEST" = "yes" ]; then
  chown root:root $nulled
fi
if [ "$MOUNT" != "" ]; then
    unmount
fi

quiet systemctl unmask snap.docker.dockerd --runtime
quiet systemctl unmask snap.docker.nvidia-container-toolkit --runtime

snap remove docker --purge || echo "Failed to remove Docker"
quiet networkctl delete docker0

snap remove grype --purge
snap remove syft --purge

sed -i "s|:/home/root:|:/root:|" /etc/passwd
delgroup docker

if [ "$TEST" = "yes" ]; then
  chown $run_as:$run_as $nulled
fi

clean_all
systemctl daemon-reload
exit 0
