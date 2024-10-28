import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  appId: 'io.ionic.starter',
  appName: 'bodega_virtual',
  webDir: 'www',

  server: {
    // Permitir HTTP en lugar de HTTPS en Android
    androidScheme: 'http',

    // Permitir contenido en texto claro (sin HTTPS)
    cleartext: true,

    // Permitir la navegación desde cualquier IP y puerto
    allowNavigation: ['*'] // Permitir cualquier dirección IP y puerto

    // Si en algún momento necesitas restringirlo de nuevo, puedes usar algo como:
    // allowNavigation: ['192.168.1.125', '192.168.1.119'] 
  },

  plugins: {
    SQLite: {
      iosDatabaseLocation: 'Library/Databases'
    },

    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999"
    },

    StatusBar: {
      backgroundColor: "#ffffffff",
      style: "DARK"
    },

    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true,
    }
  }
};

export default config;
