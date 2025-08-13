#!/bin/bash

# Creating outlook-electron install directory
rm -rfv ~/.local/share/apps/outlook-electron
mkdir -pv ~/.local/share/apps/outlook-electron

# Changing to it and downloading AppImage
cd ~/.local/share/apps/outlook-electron
wget https://github.com/guy-keller/outlook-electron/releases/download/1.1.0/outlook-electron-1.1.0.AppImage
chmod +x outlook-electron-1.1.0.AppImage

# Downloads icon file and bash script that runs the app
wget https://github.com/guy-keller/outlook-electron/tree/main/other/outlook-electron.png
wget https://github.com/guy-keller/outlook-electron/tree/main/other/outlook-electron.sh
chmod +x outlook-electron.sh

# Downloads the desktop file, so the user has a nice shortcut
cd ~/.local/share/applications/
wget https://github.com/guy-keller/outlook-electron/tree/main/other/outlook-electron.desktop

# Refresh the menu, so that the app icon is displayed
sudo update-desktop-database /usr/share/applications
sudo xdg-desktop-menu forceupdate
