"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
const bridge = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld(
      "bridge",
      {
        sendSettings: (message) => {
          ipcRenderer.on("sendSettings", message);
        }
      }
    );
    electron.contextBridge.exposeInMainWorld("electron", {
      process: {
        versions: process.versions
      }
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
  window.bridge = bridge;
}
