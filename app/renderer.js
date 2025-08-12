// Using this variable as a 'lock' control - 5mins between notifications
// So that we don't display the 'notification & pop-up' more than once
let reminderShowing = false;

function resetReminderFlag() {
    const fiveMins = (5 * 60 * 1000);
    window.setTimeout(() => {
        reminderShowing = false;
    }, fiveMins);
}

function handleMutation(mutation) {
    // console.log("Mutation: ", mutation);
    if (!reminderShowing) {
        reminderShowing = true;
        window.electronAPI.showNotification();
        window.electronAPI.showPopup();
        resetReminderFlag();
    }
}

// Observer gets triggered when changes happens to the 'NotificationPane' div
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        handleMutation(mutation);
    });
});

// Watching changes on the 'NotificationPane' div, if something happens there, we have a notification
const notificationPane = document.querySelector('div[data-app-section="NotificationPane"]');
if (notificationPane) {
    observer.observe(notificationPane, {childList: true});
}
