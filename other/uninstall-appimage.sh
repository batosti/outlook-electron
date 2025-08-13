#!/bin/bash

echo "Uninstalling outlook-electron"

cd ~/.local/share/apps/
rm -rfv outlook-electron

cd ~/.local/share/applications/
rm -rfv outlook-electron.desktop

echo "Done uninstalling outlook-electron"
