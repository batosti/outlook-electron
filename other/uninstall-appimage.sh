#!/bin/bash

echo "Uninstalling outlook-electron"

cd /opt
sudo rm -rfv outlook-electron

cd /usr/share/applications
sudo rm -rfv outlook-electron.desktop

echo "Done uninstalling outlook-electron"
