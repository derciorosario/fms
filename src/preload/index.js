import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}
const bridge={}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld(
      'bridge', {
          sendSettings: (message) => {
              ipcRenderer.on('sendSettings', message);
          }
      }
   );
   
    contextBridge.exposeInMainWorld('electron', {
      process: {
        versions: process.versions
      }
    });
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.bridge=bridge
}


