const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

contextBridge.exposeInMainWorld("electronAPI", {
  showOutlookNotification: () => ipcRenderer.invoke("show-outlook-notification"),
  showOutlookPopup: () => ipcRenderer.invoke("show-outlook-popup")
});
