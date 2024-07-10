import { app, shell, BrowserWindow, ipcMain } from 'electron';
const { session } = require('electron');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const https = require('https');

import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.jpg?asset';

const expressApp = express();
const server = http.createServer(expressApp);
const io = socketIo(server, {
  maxHttpBufferSize: 1e7,
  cors: {
    origin: '*'
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

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  let upload_file_path = join(__dirname, './uploads');

  function create_upload_folder() {
    /*
    if (!fs.existsSync(upload_file_path)) {
      fs.mkdirSync(upload_file_path, { recursive: true });
      return `Folder created at ${upload_file_path}`;
    } else {
      return `Folder already exists at ${upload_file_path}`;
    }*/
  }

  mainWindow.on('ready-to-show', () => {
    create_upload_folder();
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('ping', () => console.log('pong'));

  ipcMain.on('open-file-in-folder', (event, filePath) => {
    shell.showItemInFolder(filePath);
  });


  ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath).then((error) => {
      if (error) {
        console.error('Failed to open file:', error);
      }
    });
  });

  ipcMain.on('check-file-exists', (event, filePath) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      mainWindow.webContents.send('file-exists-result', !err);
    });
  });


  const uploadsDir = path.join(__dirname, 'uploads');
  ipcMain.on('download-file', async (event, url) => {
    const dest = path.join(uploadsDir, path.basename(url));

    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
  
    console.log('download-file', url);
  
    protocol.get(url, (response) => {
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let receivedBytes = 0;
  
      response.pipe(file);
  
      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        const progress = (receivedBytes / totalBytes) * 100;
        mainWindow.webContents.send('file-progress', progress);
      });
  
      file.on('finish', () => {
        file.close(() => {
          mainWindow.webContents.send('download-complete', dest);
        });
      });
  
      file.on('error', (err) => {
        fs.unlink(dest, () => {
          console.error(err.message);
         // event.sender.send('download-error', err.message);
        });
      });
  
      response.on('error', (err) => {
        fs.unlink(dest, () => {
          console.error(err.message);
         // event.sender.send('download-error', err.message);
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {
        console.error(err.message);
        //event.sender.send('download-error', err.message);
      });
    });
  });

  

  ipcMain.on('file-upload', (event, file) => {
    const fileStream = fs.createReadStream(join(file.path));
    const fileSize = fs.statSync(file.path).size;
    let uploadedSize = 0;

    fileStream.on('data', (chunk) => {
      uploadedSize += chunk.length;
      const progress = Math.round((uploadedSize / fileSize) * 100);
      mainWindow.webContents.send('file-progress', progress); // Corrected IPC usage
    });

    fileStream.on('end', () => {
       mainWindow.webContents.send('upload-complete', file); // Optionally notify upload complete
    });

    fileStream.pipe(fs.createWriteStream(join(__dirname, './uploads/' + file.generated_name)));
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  server.close();
});

ipcMain.on('toMain', (event, data) => {
  console.log(data);
  mainWindow.webContents.send('fromMain', { response: 'Hello from Electron!' });
});
