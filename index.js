const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.on('closed', () => { app.quit(); });

  mainWindow.loadURL(`file://${__dirname}/main.html`);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 200,
    height: 200,
    title: 'Add New Todo',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  addWindow.loadURL(`file://${__dirname}/add.html`);
}

ipcMain.on('todo:add', (event, todo) => {
  console.log('todo: ', todo);
  mainWindow.webContents.send('todo:add', todo);
});

const menuTemplate =[
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: 'Ctrl+N',
        click() { createAddWindow(); }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
]

if(process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Alt+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
