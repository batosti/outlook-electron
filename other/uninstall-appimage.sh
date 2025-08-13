#!/bin/bash

echo "#################################################"
echo "Uninstalling outlook-electron"
echo "#################################################"

cd /opt
sudo rm -rfv outlook-electron

cd /usr/share/applications
sudo rm -rfv outlook-electron.desktop

echo "#################################################"
echo "Done uninstalling outlook-electron"
echo "#################################################"
