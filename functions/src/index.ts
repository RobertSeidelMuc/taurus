
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Initialize Cloud Firestore Database
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);


export const testFunction = functions.https.onCall( async (data, context) => {
    const message = data.message;

    return `TESTER sent a message of ${message}`
});

export const handleNewSignups = functions.auth.user().onCreate(async user => {
    const { uid, displayName, email } = user
  
    return await 
        db.collection("user").doc(uid).set({ uid, displayName, email })
  })

