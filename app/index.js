const fs = require("fs");
const path = require("path");

const app = require("electron").app;
const ipcMain = require("electron").ipcMain;
const shell = require("electron").shell;
const BrowserWindow = require("electron").BrowserWindow;
const Notification = require("electron").Notification;

const protocolClient = "mailto";
const appUrl = "https://outlook.office.com/"
const appLock = app.requestSingleInstanceLock();

let window = null;

// Electron code start up
if (!appLock) {
    app.quit();
} else {
    app.on("ready", onAppReady);
    app.on("second-instance", onAppSecondInstance);
}

// Back to using functions, and normal programming
function onAppReady() {
    initialise();
    createWindow();
    handleCalendarReminders();
}

function initialise() {
    if (!app.isDefaultProtocolClient(protocolClient, process.execPath)) {
        app.setAsDefaultProtocolClient(protocolClient, process.execPath);
    }
}

function onAppSecondInstance(event, args) {
    if (window) {
        event.preventDefault();
        const url = processArgs(args);
        if (url) {
            window.loadURL(url);
        }
        window.focus();
    }
}

function processArgs(args) {
    const regHttps = /^https:\/\/outlook\.office\.com\/.*/g;
    const regMailTo = /^mailto:.*/g;
    for (const arg of args) {
        if (regHttps.test(arg)) {
            return arg;
        }
        if (regMailTo.test(arg)) {
            return appUrl + "/owa/?path=/mail/action/compose&to=" + arg.substr(7).replace("?", "&");
        }
    }
}

function onNewWindow(details) {
    if (details.url !== "about:blank") {
        shell.openExternal(details.url);
        return {action: "deny"};
    }
    return {action: "allow"};
}

function createWindow() {
    window = new BrowserWindow({
        icon: path.join(__dirname, "assets/icons/96x96.png"),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    window.maximize();
    window.loadURL(appUrl);

    // window.webContents.openDevTools();
    window.webContents.setWindowOpenHandler(onNewWindow);
}

function handleCalendarReminders() {
    handleCalendarNotifications();
    executeRendererScript();
}

function handleCalendarNotifications() {
    if (!ipcMain.listenerCount("show-outlook-notification")) {
        ipcMain.handle("show-outlook-notification", () => {
            displayOutlookNotification();
        });
    }
    if (!ipcMain.listenerCount("show-outlook-popup")) {
        ipcMain.handle("show-outlook-popup", () => {
            displayOutlookPopup()
        });
    }
}

function displayOutlookNotification() {
    const notification = new Notification({
        title: "Outlook Calendar Reminder",
        subtitle: "Outlook Electron",
        body: "You have a calendar reminder showing on outlook."
    });
    notification.show();
}

function displayOutlookPopup() {
    const popupWindow = new BrowserWindow({
        width: 250,
        height: 100,
        show: false,
        modal: false,
        parent: window,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    popupWindow.loadFile("assets/notification-reminder.html");
    popupWindow.once("ready-to-show", () => {
        popupWindow.show();
    });
}

function executeRendererScript() {
    const eightMins = (8 * 60 * 1000);
    const scriptContent = readCalendarRemindersHandlerCode();
    // starts watching for calendar reminders after 8 minutes
    // this should be more than enough time to log in into outlook
    setTimeout(() => {
        window.webContents.executeJavaScript(scriptContent, true);
    }, eightMins);
}

function readCalendarRemindersHandlerCode() {
    const scriptPath = path.join(__dirname, "renderer.js");
    const scriptContent = fs.readFileSync(scriptPath, "utf8");
    // console.log("Script Content: ", scriptContent);
    return scriptContent;
}
