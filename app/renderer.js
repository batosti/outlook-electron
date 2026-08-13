// Using these variable as a 'lock' control - 5mins between notifications
// So that we don't display the 'notification & pop-up' more than once
let reminderShowing = false;
let calendarReminder = false;

function resetReminderFlag() {
    const fiveMins = (5 * 60 * 1000);
    window.setTimeout(() => {
        reminderShowing = false;
        calendarReminder = false;
    }, fiveMins);
}

function handleMutation(mutation) {
    if (mutation && mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(newNode => {
            if (newNode.nodeType === Node.ELEMENT_NODE) {
                checkForReminderTypeCalendar(newNode);
                if (calendarReminder) {
                    showReminder();
                }
            }
        });
    }
}

function checkForReminderTypeCalendar(element) {
    if (!calendarReminder && element) {
        if (element.children) {
            for (let i = 0; i < element.children.length; i++) {
                const child = element.children[i];
                const isReminder = isCalendarReminder(child);
                if (isReminder) {
                    calendarReminder = true;
                    break;
                }
                checkForReminderTypeCalendar(child);
            }
        }
    }
}

function isCalendarReminder(element) {
    if (element) {
        const hasIdAttribute = element.hasAttribute("id");
        if (hasIdAttribute) {
            const reminderValue = element.getAttribute("id");
            // when a notification is showing, the 'remindersDismissAllButtonId' is created
            if ("remindersDismissAllButtonId" === reminderValue) {
                return true;
            }
        }
        return false;
    }
}

function showReminder() {
    if (!reminderShowing) {
        reminderShowing = true;
        window.electronAPI.showOutlookNotification();
        window.electronAPI.showOutlookPopup();
        resetReminderFlag();
    }
}

// Observer gets triggered when changes happens to the 'NotificationPane' div
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        handleMutation(mutation);
    });
});

// Watching changes on the 'TopBar' div, if something happens there, we have a notification
const bodyElement = document.querySelector('body');
if (bodyElement) {
    const obsOpts = {childList: true, subtree: true, attributes: true};
    observer.observe(bodyElement, obsOpts);
}
