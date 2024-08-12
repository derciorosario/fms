"use strict";
const electron = require("electron");
const path$1 = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path$1.join(__dirname, "../../resources/icon.jpg");
require("electron");
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("cors");
const https = require("https");
const expressApp = express();
const server = http.createServer(expressApp);
const io = socketIo(server, {
  maxHttpBufferSize: 1e7,
  cors: {
    origin: "*"
  }
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("messageFromReact", (data) => {
    console.log("Message from React:", data);
    socket.emit("messageFromElectron", { response: "Message received" });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path$1.join(__dirname, "../preload/index.js"),
      sandbox: false
      //webSecurity: false
    }
  });
  let upload_file_path = path$1.join(electron.app.getPath("userData"), "/uploads");
  let download_file_path = path$1.join(electron.app.getPath("userData"), "/downloads");
  electron.app.getPath("userData");
  function create_upload_folder() {
    if (!fs.existsSync(upload_file_path)) {
      fs.mkdirSync(upload_file_path, { recursive: true });
    }
    if (!fs.existsSync(download_file_path)) {
      fs.mkdirSync(download_file_path, { recursive: true });
    }
  }
  mainWindow.on("ready-to-show", () => {
    create_upload_folder();
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path$1.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.on("open-file-in-folder", async (event, filename) => {
    let basePath = electron.app.getPath("userData");
    fs.access(path$1.join(basePath, "/uploads/" + filename.replaceAll("%20", " ")), fs.constants.F_OK, (err1) => {
      if (!err1) {
        electron.shell.showItemInFolder(path$1.join(basePath, "/uploads/" + filename.replaceAll("%20", " ")));
      } else {
        mainWindow.webContents.send("file-exists-result", !err1);
      }
    });
  });
  electron.ipcMain.on("open-file", async (event, filename) => {
    let basePath = electron.app.getPath("userData");
    fs.access(path$1.join(basePath, "/uploads/" + filename.replaceAll("%20", " ")), fs.constants.F_OK, (err1) => {
      if (!err1) {
        electron.shell.openPath(path$1.join(basePath, "/uploads/" + filename.replaceAll("%20", " ")));
      } else {
        mainWindow.webContents.send("file-exists-result", !err1);
      }
    });
  });
  electron.ipcMain.on("check-file-exists", async (event, filename) => {
    let basePath = electron.app.getPath("userData");
    fs.access(path$1.join(basePath, "/uploads/" + filename.replaceAll("%20", " ")), fs.constants.F_OK, (err1) => {
      mainWindow.webContents.send("file-exists-result", !err1);
    });
  });
  electron.ipcMain.on("read-file", async (event, file) => {
    let basePath = electron.app.getPath("userData");
    try {
      const filePath = path.join(basePath, "/uploads", file.generated_name.replaceAll("%20", " "));
      await fs.promises.access(filePath, fs.constants.F_OK);
      const data = await fs.promises.readFile(filePath);
      mainWindow.webContents.send("read-file", { ...file, base64: data.toString("base64"), exists: true });
    } catch (error) {
      console.error("Error reading file:", error);
      mainWindow.webContents.send("read-file", { error: true, ...file });
    }
  });
  electron.ipcMain.on("download-file", async (event, f) => {
    const dest = path.join(uploadsDir, path.basename(f.dest));
    const file = fs.createWriteStream(dest);
    const protocol = f.dest.startsWith("https") ? https : http;
    protocol.get(f.dest, (response) => {
      const totalBytes = parseInt(response.headers["content-length"], 10);
      let receivedBytes = 0;
      response.pipe(file);
      response.on("data", (chunk) => {
        receivedBytes += chunk.length;
        const progress = receivedBytes / totalBytes * 100;
        mainWindow.webContents.send("file-progress", progress);
      });
      file.on("finish", () => {
        file.close(() => {
          const oldFileName = path.basename(f.dest);
          const newFileName = oldFileName.replaceAll("%20", " ");
          const oldPath = path.join(uploadsDir, oldFileName);
          const newPath = path.join(uploadsDir, newFileName);
          setTimeout(() => {
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                console.error("Error renaming file:", err);
              } else {
                console.log("File renamed successfully!");
              }
            });
          }, 1e3);
          mainWindow.webContents.send("download-complete", { ...f.file });
        });
      });
      file.on("error", (err) => {
        fs.unlink(dest, () => {
          console.error(err.message);
        });
      });
      response.on("error", (err) => {
        fs.unlink(dest, () => {
          console.error(err.message);
        });
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {
        console.error(err.message);
      });
    });
  });
  electron.ipcMain.on("reload", async () => {
    let win = electron.BrowserWindow.getAllWindows()[0];
    win.reload();
  });
  electron.ipcMain.on("relaunch", async () => {
    electron.app.relaunch();
    electron.app.exit();
  });
  electron.ipcMain.on("file-upload", async (event, file) => {
    let basePath = electron.app.getPath("userData");
    console.log({ v: electron.app.getPath("userData") });
    const fileStream = fs.createReadStream(path$1.join(file.path));
    const fileSize = fs.statSync(file.path).size;
    let uploadedSize = 0;
    fileStream.on("data", (chunk) => {
      uploadedSize += chunk.length;
      const progress = Math.round(uploadedSize / fileSize * 100);
      mainWindow.webContents.send("file-progress", progress);
    });
    fileStream.on("end", () => {
      delete file.path;
      mainWindow.webContents.send("upload-complete", file);
    });
    fileStream.pipe(fs.createWriteStream(path$1.join(basePath, "/uploads/" + file.generated_name)));
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
  server.close();
});
electron.ipcMain.on("toMain", (event, data) => {
  console.log(data);
  mainWindow.webContents.send("fromMain", { response: "Hello from Electron!" });
});
