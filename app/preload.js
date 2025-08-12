const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: () => ipcRenderer.invoke("show-notification"),
  showPopup: () => ipcRenderer.invoke("show-popup")
});
