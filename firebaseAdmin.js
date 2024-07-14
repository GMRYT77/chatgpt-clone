import admin from "firebase-admin";
import { getApp } from "firebase/app";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApp().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };

// var admin = require("firebase-admin");

// // Fetch the service account key JSON file contents
// var serviceAccount = require(JSON.parse(
//   process.env.FIREBASE_SERVICE_ACCOUNT_KEY
// ));

// // Initialize the app with a service account, granting admin privileges
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // The database URL depends on the location of the database
//   //databaseURL: "https://DATABASE_NAME.firebaseio.com",
// });

// // As an admin, the app has access to read and write all data, regardless of Security Rules
// var db = admin.database();
// var ref = db.ref("restricted_access/secret_document");
// ref.once("value", function (snapshot) {
//   console.log(snapshot.val());
// });
