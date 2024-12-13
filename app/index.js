const {app, BrowserWindow, Notification, shell} = require('electron');
var path = require('path')

const appUrl = 'https://outlook.office.com/'

/**
 * @type {BrowserWindow}
 */
let window = null;

/**
 * @param {Electron.HandlerDetails} details
 * @returns {action: 'deny'}
 */
function onNewWindow(details) {
    if (details.url !== 'about:blank') {
        shell.openExternal(details.url);
        return {action: 'deny'};
    }
    return {action: 'allow'};
}

const createWindow = () => {
    window = new BrowserWindow({
        icon: path.join(__dirname, 'assets/icons/icon-96x96.png'), autoHideMenuBar: true
    });
    window.maximize();
    window.loadURL(appUrl);
    window.webContents.setWindowOpenHandler(onNewWindow);

    window.webContents.on("dom-ready", () => {
        handleCalendarReminders();
    });
}

const appLock = app.requestSingleInstanceLock();

const protocolClient = 'mailto';
if (!app.isDefaultProtocolClient(protocolClient, process.execPath)) {
    app.setAsDefaultProtocolClient(protocolClient, process.execPath);
}

if (!appLock) {
    app.quit();
} else {
    app.on('second-instance', onAppSecondInstance);
    app.on('ready', onAppReady);
}

async function onAppReady() {
    createWindow();
}

function processArgs(args) {
    var regHttps = /^https:\/\/outlook\.office\.com\/.*/g;
    var regMailTo = /^mailto:.*/g;
    for (const arg of args) {
        if (regHttps.test(arg)) {
            return arg;
        }
        if (regMailTo.test(arg)) {
            return appUrl + '/owa/?path=/mail/action/compose&to=' + arg.substr(7).replace('?', '&');
        }
    }
}

function onAppSecondInstance(event, args) {
    console.debug('second-instance started');
    if (window) {
        event.preventDefault();
        const url = processArgs(args);
        if (url) {
            allowFurtherRequests = false;
            setTimeout(() => {
                allowFurtherRequests = true;
            }, 5000);
            window.loadURL(url);
        }

        window.focus();
    }
}

function handleCalendarReminders() {
    const eightMins = (8 * 60 * 1000);
    const calendarReminderCode = createCalendarRemindersHandlerCode();
    // starts watching for calendar reminders after 8 minutes
    // this should be more than enough time to log in into outlook
    setTimeout(() => {
        window.webContents.executeJavaScript(calendarReminderCode);
    }, (10*1000));
}

/**
 * @returns {string}
 */
function createCalendarRemindersHandlerCode() {
    const code = `
    
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const calendarReminder = document.querySelector('div[remindertype="Calendar"]');
            if (calendarReminder) {
                
                const notification = new Notification(
                  "Outlook Calendar Reminder",
                  {
                    title: "Outlook Calendar Reminder",
                    subtitle: "Outlook Electron",
                    body:  "You have a calendar reminder showing on outlook."
                  }
                );
                
                notification.show();
            }
        });
    });

    const notificationPane = document.querySelector('div[data-app-section="NotificationPane"]');
    if (notificationPane) {
        observer.observe(notificationPane, {childList: true});
    }
    
    `;

    return code;
}
