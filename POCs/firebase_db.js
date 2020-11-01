// Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: 'AIzaSyCOl7-ayE7Me76IFg-OMwVnSM9aLp2TjaQ',
    authDomain: 'taurus-36048.firebaseapp.com',
    databaseURL: 'https://taurus-36048.firebaseio.com',
    projectId: 'taurus-36048',
    storageBucket: 'taurus-36048.appspot.com',
    messagingSenderId: '199754593387',
    appId: "1:199754593387:web:398a336bc8daccbb6dad2e",
    measurementId: "G-BKZ7KGMCDR"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();