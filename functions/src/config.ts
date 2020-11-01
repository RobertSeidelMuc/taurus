
import * as admin from 'firebase-admin';
admin.initializeApp();

// Initialize Cloud Firestore Database
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);



