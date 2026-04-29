import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foleyplay.app',
  appName: 'FoleyPlay',
  webDir: 'out',
  server: {
    url: 'https://foleyplay.vercel.app',
    cleartext: false
  }
};

export default config;