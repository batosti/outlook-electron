# Outlook Electron

Outlook client made with electron and Outlook Web App

## Setup

```bash
npm install
```

# Run 

```bash
npm run start
```

# Package

They will generate `.deb` and `snap` packages

```bash
npm run dist
```

# AppImage install / uninstall

One liner installer:
```bash
curl -s "https://raw.githubusercontent.com/guy-keller/outlook-electron/main/other/install-appimage.sh" | bash
```

Unhappy and want to uninstall?
```bash
curl -s "https://raw.githubusercontent.com/guy-keller/outlook-electron/main/other/uninstall-appimage.sh" | bash
```

## Packages

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)]( https://snapcraft.io/outlook-electron )

## Support this project

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://www.buymeacoffee.com/batosti)

## Version history

1.0.0 - Initial version  
1.0.1 - Bug fixies  
1.0.2 - Notification for meetings. (Thanks to [Guy Keller](https://github.com/guy-keller))  
1.1.0 - AppImage build and fixes on notification for meetings  
1.2.0 - Fixes on notification for meetings as MS changed the DOM element  
1.2.1 - Fixing notification pop-up; no longer uses Tailwind CDN; minimal CSS (looks good behind controlled networks)  
1.2.2 - Fixing notification pop-up; MS has changed the ID in the DOM element again
1.2.3 - Improvement; plays a sound when the notification pop-up is displayed
