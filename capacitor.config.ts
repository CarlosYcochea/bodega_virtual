import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  appId: 'io.ionic.starter',
  appName: 'bodega_virtual',
  webDir: 'www',

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
  }
};

export default config;
