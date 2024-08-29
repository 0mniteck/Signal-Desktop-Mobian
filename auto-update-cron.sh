#!/bin/bash

# Script to add a cron job to check for and download the most recent version from this git repo

# Install dependency
apt update && apt install -y wget

# Copy the script to /usr/bin/sd-updater if it doesn't exist
if [ ! -f /usr/bin/sd-updater ]; then
    cp ./${0##*/} /usr/bin/sd-updater
    chmod +x /usr/bin/sd-updater
    echo "Script copied to /usr/bin/sd-updater."
else
    echo "/usr/bin/sd-updater already exists."
fi

# Function to check for internet connectivity
check_internet() {
    wget -q --spider http://google.com
    return $?
}

# Function to get the current version installed
get_current_version() {
    if [ -f /usr/bin/signal-desktop ]; then
        current_version=$(signal-desktop --version | awk '{print $2}')
        echo "$current_version"
    else
        echo "not_installed"
    fi
}

# Function to download the latest version info
download_latest_version_info() {
    wget -q -O /tmp/latest-linux-arm64.yml https://raw.githubusercontent.com/0mniteck/Signal-Desktop-Mobian/master/builds/release/latest-linux-arm64.yml
}

# Function to extract the latest version from the downloaded file
get_latest_version() {
    latest_version=$(grep 'version:' /tmp/latest-linux-arm64.yml | awk '{print $2}')
    echo "$latest_version"
}

# Function to stop any running instances of signal-desktop
stop_running_instance() {
    pkill -f signal-desktop
}

# Function to install the new version
install_new_version() {
    wget -q -O /tmp/signal-desktop.deb $(grep 'url:' /tmp/latest-linux-arm64.yml | awk '{print $2}')
    sudo apt install /tmp/signal-desktop.deb
    rm /tmp/signal-desktop.deb
}

# Check for internet
if check_internet; then
    echo "No internet connection. Exiting."
    exit 1
else
    echo "Internet is available."
fi

# Get current version installed
current_version=$(get_current_version)

# Download the latest version info
download_latest_version_info

# Get the latest version
latest_version=$(get_latest_version)

# Check if an update is needed
if [ "$current_version" != "$latest_version" ]; then
    echo "Updating Signal Desktop from version $current_version to $latest_version."
    
    # Stop any running instances of signal-desktop
    stop_running_instance
    
    # Install the new version
    install_new_version
    echo "Signal Desktop has been updated to version $latest_version."
else
    echo "Signal Desktop is already up to date (version $current_version)."
fi

# Define the cron job command
cron_job="0 2 * * * /usr/bin/sd-updater"

# Check if the cron job already exists
if ! crontab -l | grep -qF "$cron_job"; then
    (crontab -l 2>/dev/null; echo "$cron_job") | crontab -
    echo "Cron job added: $cron_job"
else
    echo "Cron job already exists."
fi
