import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foleyplay.app',
  appName: 'FoleyPlay',
  webDir: 'out',
  server: {
    // DEV: apunta a localhost para desarrollo local en el emulador
    // PROD: cambiar a la URL del servidor donde corre Next.js, ej:
    //   url: 'http://192.168.1.X:3000'  ← IP local de tu máquina (para TV en la misma red)
    //   url: 'https://tu-dominio.com'   ← URL pública si deployás en Vercel/VPS
    url: 'http://172.18.16.70:3000',
    cleartext: true
  }
};

export default config;