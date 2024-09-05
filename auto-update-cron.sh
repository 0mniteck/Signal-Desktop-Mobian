#!/bin/bash

# Script to add a cron job to check for, download, and install the most recent version from this git repo.
# This will auto-close signal-desktop before installing, default is to check every 2 days.
# Author: Shant Tchatalbachian

# Copy the script to /usr/bin/sd-updater if it doesn't exist
if [ ! -f /usr/bin/sd-updater ]; then
    cp ./${0##*/} /usr/bin/sd-updater
    chmod +x /usr/bin/sd-updater
    echo "Script ${0##*/} copied to /usr/bin/sd-updater."
    # Install dependency
    apt update && apt install -y wget
else
    echo "/usr/bin/sd-updater already exists, checking for update."
fi

# Function to check for internet connectivity
check_internet() {
    wget -q --spider http://google.com
    return $?
}

# Function to get the current version installed
get_current_version() {
    if [ -f /usr/bin/signal-desktop ]; then
        current_version=$(apt info signal-desktop | grep Version | awk '{print $2}')
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
    wget -q -O /tmp/signal-desktop.deb https://github.com/0mniteck/Signal-Desktop-Mobian/raw/master/builds/release/$(grep 'url:' /tmp/latest-linux-arm64.yml | awk '{print $3}')
    apt install /tmp/signal-desktop.deb
    rm -f /tmp/signal-desktop.deb
}

# Check for internet
if check_internet; then
    echo "Internet is available."
else
    echo "No internet connection. Exiting."
    exit 1
fi

# Get current version installed
current_version=$(get_current_version)

# Download the latest version info
download_latest_version_info

# Get the latest version
latest_version=$(get_latest_version)

# Check if an update is needed
if [ "$current_version" != "$latest_version" ]; then
    echo "Updating Signal Desktop from version $current_version to $latest_version"
    # Stop any running instances of signal-desktop
    stop_running_instance
    # Install the new version
    install_new_version
    echo "Signal Desktop has been updated to version $latest_version"
else
    echo "Signal Desktop is already up to date (version $current_version)"
fi

# Define the cron job command
cron_job="0 2 * * * root /usr/bin/sd-updater"

# Check if the cron job already exists
if [ ! -f /etc/cron.d/sd-updater ]; then
    $cron_job > /etc/cron.d/sd-updater
    echo "Cron job added: $cron_job"
else
    echo "Cron job already exists."
fi
