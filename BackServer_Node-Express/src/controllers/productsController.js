const ProductsService = require("../services/productsService");

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const puppeteer = require("puppeteer");
const { Client } = require('ssh2');

class ProductsController {
  constructor() {
    this.productService = new ProductsService();
  }

  async get(req, res) {
    const result = await this.productService.get();
    res.json(result);
  }

  async connectionRDP(req, res) {
    // Función para crear el archivo .rdp
    function createRdpFile(ip, user, callback) {
      const rdpContent = `
full address:s:${ip}
username:s:${user}
prompt for credentials:i:1
`;

      const filePath = path.join(__dirname, "connection.rdp");

      fs.writeFile(filePath, rdpContent, (err) => {
        if (err) {
          console.error("Error al escribir el archivo .rdp:", err);
          return;
        }
        console.log("Archivo .rdp creado en:", filePath); // Log para confirmar creación
        callback(filePath);
      });
    }

    // Función para ejecutar mstsc con el archivo .rdp
    function connectRDP(ip, user, password) {
      createRdpFile(ip, user, (filePath) => {
        // Use cmdkey to store the credentials
        const cmdKeyCommand = `cmdkey /generic:TERMSRV/${ip} /user:${user} /pass:${password}`;
        exec(cmdKeyCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error al ejecutar cmdkey: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Error en la salida estándar de cmdkey: ${stderr}`);
            return;
          }

          // Ejecutar el archivo .rdp
          const mstscCommand = `mstsc "${filePath}"`;
          console.log("Ejecutando comando:", mstscCommand); // Log para confirmar ejecución

          exec(mstscCommand, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error al ejecutar mstsc: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Error en la salida estándar de mstsc: ${stderr}`);
              return;
            }
            console.log(`Salida estándar: ${stdout}`);

            // Opcional: eliminar las credenciales almacenadas después de la conexión
            const deleteCmdKeyCommand = `cmdkey /delete:TERMSRV/${ip}`;
            exec(deleteCmdKeyCommand, (delError, delStdout, delStderr) => {
              if (delError) {
                console.error(
                  `Error al eliminar credenciales con cmdkey: ${delError.message}`
                );
              } else {
                console.log(`Credenciales eliminadas: ${delStdout}`);
              }
            });
          });
        });
      });
    }

    // Simular el clic de un botón
    const ip = "192.168.1.222"; // Reemplaza con la IP de destino
    const user = "usuario"; // Reemplaza con el nombre de usuario
    const password = "contraseña"; // Reemplaza con la contraseña

    connectRDP(ip, user, password);
  }

  async connectionWinbox(req, res) {
    // Función para ejecutar WinBox con parámetros
    function connectWinBox(ip, user, password) {
      // Ruta al ejecutable de WinBox
      //const winboxPath = path.join('C:\\ruta\\a\\winbox.exe');  // Cambia esta ruta a la ubicación real de winbox.exe
      const winboxPath = path.join(
        "C:\\Users\\Lenovo\\Desktop\\Drive Lenovo V15\\PROGRAMACION\\Ejercicios-Pagina\\04_API-React_Node-Test\\BackServer_Node-Express\\src\\controllers\\winbox64.exe"
      );

      // Comando para ejecutar WinBox con los parámetros
      const winboxCommand = `"${winboxPath}" ${ip} ${user} ${password}`;
      console.log("Ejecutando comando:", winboxCommand); // Log para confirmar ejecución

      exec(winboxCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar WinBox: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error en la salida estándar de WinBox: ${stderr}`);
          return;
        }
        console.log(`Salida estándar: ${stdout}`);
      });
    }

    // Simular el clic de un botón
    const ip = "192.168.88.1"; // Reemplaza con la IP o DNS del router MikroTik
    const user = "admin"; // Reemplaza con el nombre de usuario
    const password = "password"; // Reemplaza con la contraseña

    connectWinBox(ip, user, password);
  }

  async connectionBrowser(req, res) {
    function openChrome(url) {
      // Ruta al ejecutable de Google Chrome (ajusta según sea necesario)
      const chromePath = path.join(
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      );

      // Comando para abrir Google Chrome con la URL especificada
      const chromeCommand = `"${chromePath}" "${url}"`;
      console.log("Ejecutando comando:", chromeCommand); // Log para confirmar ejecución

      exec(chromeCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar Chrome: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error en la salida estándar de Chrome: ${stderr}`);
          return;
        }
        console.log(`Salida estándar: ${stdout}`);
      });
    }

    // Simular el clic de un botón
    const url = "http://example.com"; // Reemplaza con la URL deseada

    openChrome(url);
  }

  async connectionBrowser2(req, res) {
    async function loginAndNavigate(url, username, password) {
      const browser = await puppeteer.launch({ headless: false }); // Abre el navegador en modo no-headless para ver la automatización
      const page = await browser.newPage();

      await page.goto(url);

      // Reemplaza estos selectores con los de tu página de inicio de sesión
      await page.type("#username", username); // Selector del campo de usuario
      await page.type("#password", password); // Selector del campo de contraseña
      await page.click("#login-button"); // Selector del botón de inicio de sesión

      // Esperar a que la página de destino se cargue
      await page.waitForNavigation();

      console.log("Iniciado sesión y navegando a la página deseada");

      // Mantener el navegador abierto
      // await browser.close();
    }

    // Simular el clic de un botón
    const url = "http://example.com/login"; // Reemplaza con la URL de la página de inicio de sesión
    const username = "usuario"; // Reemplaza con el nombre de usuario
    const password = "contraseña"; // Reemplaza con la contraseña

    loginAndNavigate(url, username, password);
  }

  async connectionPutty(req, res) {
    // Función para crear el archivo de configuración de PuTTY
    function createPuttyConfig(ip, user, password, callback) {
        console.log('Creando archivo de configuración de PuTTY...');
        const batchContent = `
    @echo off
    start putty.exe -ssh ${user}@${ip} -pw ${password}
    `;
    
        const filePath = path.join(__dirname, 'putty_connect.bat');
        console.log(`***************${filePath}****************`)
    
        fs.writeFile(filePath, batchContent, (err) => {
            if (err) {
                console.error('Error al escribir el archivo de configuración de PuTTY:', err);
                return;
            }
            console.log('Archivo de configuración de PuTTY creado en:', filePath);
            callback(filePath);
        });
    }
    
    // Función para ejecutar PuTTY con el archivo de configuración
    function connectPutty(ip, user, password) {
        createPuttyConfig(ip, user, password, (filePath) => {
            const puttyCommand = `"${filePath}"`;
            console.log('Ejecutando comando:', puttyCommand);
            
            const childProcess = exec(puttyCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error al ejecutar PuTTY: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Error en la salida estándar de PuTTY: ${stderr}`);
                    return;
                }
                console.log(`Salida estándar: ${stdout}`);
            });
    
            // Manejar eventos de error
            childProcess.on('error', (err) => {
                console.error('Error en el proceso hijo:', err);
            });
    
            // Manejar eventos de cierre
            childProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`El proceso hijo salió con código de salida ${code}`);
                } else {
                    console.log('El proceso hijo se cerró correctamente');
                }
            });
    
            // Establecer un tiempo de espera
            const timeout = setTimeout(() => {
                console.error('El proceso hijo se ha excedido del tiempo de espera');
                childProcess.kill('SIGINT'); // Intenta detener el proceso hijo
            }, 10000); // Tiempo de espera en milisegundos (por ejemplo, 5 segundos)
        });
    }
    
    // Simular el clic de un botón
    const ip = '192.168.1.100'; // Reemplaza con la IP del servidor
    const user = 'usuario';     // Reemplaza con el nombre de usuario
    const password = 'contraseña'; // Reemplaza con la contraseña
    
    connectPutty(ip, user, password);
  }

  async connectionPutty2(req, res) {
// Configuración de conexión PuTTY
const ip = '192.168.1.100'; // Reemplaza con la IP del servidor
const user = 'usuario';      // Reemplaza con el nombre de usuario
const password = 'contraseña'; // Reemplaza con la contraseña
//const puttyExecutablePath = path.join(__dirname, 'PuTTY.exe'); // Ruta al ejecutable de PuTTY
const puttyExecutablePath = path.join("C:\PuTTY.exe");  // Ruta al ejecutable de PuTTY

// Comando para ejecutar PuTTY
const puttyCommand = `${puttyExecutablePath} -ssh ${user}@${ip} -pw ${password}`;
console.log('Comando a ejecutar:', puttyCommand);

// Ejecutar PuTTY desde Node.js
const childProcess = exec(puttyCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar PuTTY: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error en la salida estándar de PuTTY: ${stderr}`);
        return;
    }
    console.log(`Salida estándar: ${stdout}`);
});

// Manejar eventos de error en el proceso hijo
childProcess.on('error', (err) => {
    console.error('Error en el proceso hijo:', err);
});

// Manejar eventos de cierre del proceso hijo
childProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(`El proceso hijo salió con código de salida ${code}`);
    } else {
        console.log('El proceso hijo se cerró correctamente');
    }
});

// Establecer un tiempo de espera
const timeout = setTimeout(() => {
    console.error('El proceso hijo se ha excedido del tiempo de espera');
    childProcess.kill('SIGINT'); // Intenta detener el proceso hijo
}, 5000); // Tiempo de espera en milisegundos (por ejemplo, 5 segundos) // Tiempo de espera en milisegundos (por ejemplo, 5 segundos)
  }
}

module.exports = ProductsController;
