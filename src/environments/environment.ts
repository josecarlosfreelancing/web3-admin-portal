// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyAsctDNt3Xh1THlW3esRL2bYO1mq1F-cEw",
    authDomain: "hmmm-72ebb.firebaseapp.com",
    databaseURL: "https://hmmm-72ebb-default-rtdb.firebaseio.com",
    projectId: "hmmm-72ebb",
    storageBucket: "hmmm-72ebb.appspot.com",
    messagingSenderId: "584358023606",
    appId: "1:584358023606:web:97fa8703df3f8862103117",
    measurementId: "G-LJ705NX79R"
  },
  useEmulators: false,
  apiURL: "https://us-central1-hmmm-72ebb.cloudfunctions.net/HMMMAPI/api" //Para el server
  //apiURL: "http://localhost:5001/hmmm-72ebb/us-central1/HMMMAPI/api" //Local
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
