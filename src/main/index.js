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
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });


  let upload_file_path = join(app.getPath('userData'), '/uploads');
  let download_file_path = join(app.getPath('userData'), '/downloads');
  let basePath=app.getPath('userData') //__dirname
  //let upload_file_path = join(__dirname, '/uploads');
  //let download_file_path = join(__dirname, '/downloads');




  async function copyFile(source, destination) {
    try {
        await fs.copyFile(source, destination);
        return
    } catch (err) {
       console.log(err)
       return
    }
}


  function create_upload_folder() {

    
    if (!fs.existsSync(upload_file_path)) {
     fs.mkdirSync(upload_file_path, { recursive: true });
    }

    if (!fs.existsSync(download_file_path)) {
      fs.mkdirSync(download_file_path, { recursive: true });
    }

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


  

  ipcMain.on('open-file-in-folder',async (event, filename) => {
    fs.access(join(basePath, '/uploads/'+filename.replaceAll('%20', ' ')), fs.constants.F_OK, (err1) => {
      if(!err1){
        shell.showItemInFolder(join(basePath, '/uploads/'+filename.replaceAll('%20', ' ')));
      }else{
        mainWindow.webContents.send('file-exists-result', !err1);      
      }
    })
    
  });

 

  ipcMain.on('open-file',async (event, filename) => {
    fs.access(join(basePath, '/uploads/'+filename.replaceAll('%20', ' ')), fs.constants.F_OK, (err1) => {
      if(!err1){
        shell.openPath(join(basePath, '/uploads/'+filename.replaceAll('%20', ' ')))
      }else{
       mainWindow.webContents.send('file-exists-result', !err1);
      }
    })
  });



  ipcMain.on('check-file-exists',async (event, filename) => {
     fs.access(join(basePath, '/uploads/'+filename.replaceAll('%20', ' ')), fs.constants.F_OK, (err1) => {
         mainWindow.webContents.send('file-exists-result', !err1);
    })
   
  });


 //const uploadsDir = path.join(app.getPath('userData'), '/uploads');
 //const uploadsDir = path.join(__dirname, '/uploads')

 ipcMain.on('read-file', async (event, file) => {
 
  try {
    const filePath = path.join(basePath, '/uploads', file.generated_name.replaceAll('%20', ' '));

    // Check file existence
    await fs.promises.access(filePath, fs.constants.F_OK);

    // Read file content
    const data = await fs.promises.readFile(filePath);

    // Send data to renderer
    mainWindow.webContents.send('read-file', {...file, base64: data.toString('base64'), exists: true });
  } catch (error) {
    console.error('Error reading file:', error); // Log the actual error
    mainWindow.webContents.send('read-file', { error: true, ...file });
  }
});

 
  ipcMain.on('download-file', async (event, f) => {
    const dest = path.join(uploadsDir, path.basename(f.dest));

    const file = fs.createWriteStream(dest);
    const protocol = f.dest.startsWith('https') ? https : http;
    
  
    protocol.get(f.dest, (response) => {
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
          const oldFileName=path.basename(f.dest)
          const newFileName = oldFileName.replaceAll('%20', ' ');
          const oldPath = path.join(uploadsDir, oldFileName);
          const newPath = path.join(uploadsDir, newFileName);
          setTimeout(() => {
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                console.error('Error renaming file:', err);
              } else {
                console.log('File renamed successfully!');
              }
            });
          }, 1000)
          mainWindow.webContents.send('download-complete', {...f.file});
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

  

  ipcMain.on('file-upload',async (event, file) => {

    console.log({v:app.getPath('userData')})
     //join(file.path),join(app.getPath('userData'), '/uploads/')
   /* fs.copyFile(join(file.path),join(__dirname, '/uploads/'), (err) => {
      if (err) throw err;
      console.log('File was copied to destination');
    });*/

    

    const fileStream = fs.createReadStream(join(file.path));
    const fileSize = fs.statSync(file.path).size;
    let uploadedSize = 0;

    fileStream.on('data', (chunk) => {
      uploadedSize += chunk.length;
      const progress = Math.round((uploadedSize / fileSize) * 100);
      mainWindow.webContents.send('file-progress', progress); // Corrected IPC usage
    });

    fileStream.on('end', () => {
       delete file.path
       mainWindow.webContents.send('upload-complete', file); // Optionally notify upload complete
    });
    //join(app.getPath('userData')
    fileStream.pipe(fs.createWriteStream(join(basePath, '/uploads/' + file.generated_name)));
  
  
  
  
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
