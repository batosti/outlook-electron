#!/bin/bash

# Installing..
echo "#################################################"
echo "ATTENTION! Please enter your password when prompted."
echo "Beginning installation of Outlook Electron into /opt here we go.."
echo "#################################################"

# Creating outlook-electron install directory
sudo rm -rfv /opt/outlook-electron
sudo mkdir -pv /opt/outlook-electron
sudo chmod a+rw /opt/outlook-electron

# Changing to it and downloading AppImage
cd /opt/outlook-electron
wget https://github.com/guy-keller/outlook-electron/releases/download/1.1.0/outlook-electron-1.1.0.AppImage
wget https://raw.githubusercontent.com/guy-keller/outlook-electron/refs/heads/main/other/outlook-electron.png
wget https://raw.githubusercontent.com/guy-keller/outlook-electron/refs/heads/main/other/outlook-electron.sh

# Making the AppImage and sh runnable
chmod +x outlook-electron-1.1.0.AppImage
chmod +x outlook-electron.sh

# Downloads the desktop file, so the user has a nice shortcut
wget https://raw.githubusercontent.com/guy-keller/outlook-electron/refs/heads/main/other/outlook-electron.desktop
sudo mv -vf /opt/outlook-electron/outlook-electron.desktop /usr/share/applications

# Refresh the menu, so that the app icon is displayed
sudo update-desktop-database /usr/share/applications
sudo xdg-desktop-menu forceupdate

# All done..
echo "#################################################"
echo "A shortcut to the app has been created, press the super key and find it"
echo "Installation complete, you may close this window"
echo "#################################################"
