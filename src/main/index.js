import { app, shell, BrowserWindow, ipcMain } from 'electron'
const { session } = require('electron');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
const cors = require('cors');

import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.jpg?asset'


const expressApp = express();
const server = http.createServer(expressApp);
const io = socketIo(server,{
  maxHttpBufferSize: 1e7,
  cors:{
    origin:'*'
  }
});


io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle messages from the React frontend
  socket.on('messageFromReact', (data) => {
    console.log('Message from React:', data);
    // Respond back to the React frontend
    socket.emit('messageFromElectron', { response: 'Message received' });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


let mainWindow
function createWindow() {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })


  let upload_file_path=join(__dirname,'./uploads')

  function create_upload_folder(){
   if (!fs.existsSync(upload_file_path)) {
      fs.mkdirSync(upload_file_path, { recursive: true });
      return `Folder created at ${upload_file_path}`;
    } else {
      return `Folder already exists at ${upload_file_path}`;
    }
  }

  mainWindow.on('ready-to-show', () => {
     //mainWindow.webContents.session.clearStorageData()
    /* server.listen(3001, () => {
      console.log('Express server listening on port 3001');
    });*/


    create_upload_folder()
    
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
 
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('file-upload', (event,file) => {

    const fileStream = fs.createReadStream(join(file.path));
    const fileSize = fs.statSync(file.path).size;
    let uploadedSize = 0;

   
    console.log(mainWindow.webContents.ipc)
    console.log(Object.keys(mainWindow.webContents))
    return
    fileStream.on('data', (chunk) => {
      uploadedSize += chunk.length;
      const progress = Math.round((uploadedSize / fileSize) * 100);
      console.log(Object.keys(mainWindow))
     
      mainWindow.webContents//.ipc.send('file-progress', progress)
    });
  
    fileStream.on('end', () => {
      //mainWindow.webContents.send('upload-complete', true);
    });
  
    fileStream.pipe(fs.createWriteStream(join(__dirname,'./uploads/'+file.name)));
  });




  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  server.close()
})
  

// Receiving data from React
ipcMain.on('toMain', (event, data) => {
  console.log(data); // Handle the received data
  // Sending data back to React
  mainWindow.webContents.send('fromMain', { response: 'Hello from Electron!' });
});





// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
