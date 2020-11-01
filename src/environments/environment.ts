// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { app } from 'firebase';

export const environment = {
  production: false,
  Frontend: '',
  firebase: {
    apiKey: 'AIzaSyCOl7-ayE7Me76IFg-OMwVnSM9aLp2TjaQ',
    authDomain: 'taurus-36048.firebaseapp.com',
    databaseURL: 'https://taurus-36048.firebaseio.com',
    projectId: 'taurus-36048',
    storageBucket: 'taurus-36048.appspot.com',
    messagingSenderId: '199754593387',
    appId: "1:199754593387:web:398a336bc8daccbb6dad2e",
    measurementId: "G-BKZ7KGMCDR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
