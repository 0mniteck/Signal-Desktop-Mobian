#!/bin/bash

# Script to add a cron job to check for and download the most recent version from this git repo
# Install depencency
apt update && apt install wget
# Runs cron job if exists otherwise creates cron job


# Cron job  - WORK IN PROGRESS
# Check for internet
wget -q --spider http://google.com ; echo $?

# Get current version installed if installed otherwise stop


# Check this git repo for most recent version if newer release download to /tmp otherwise stop
wget https://raw.githubusercontent.com/0mniteck/Signal-Desktop-Mobian/master/builds/release/latest-linux-arm64.yml

# Stop any running instances of signal-desktop

# Install and restart if instance was runnning
