/* import firebase from 'firebase'
 * // Initialize Firebase
 * var config = {
 *   apiKey: "AIzaSyDKWBYrwFgg-klN6W8ResyPmFOmIAYaGeE",
 *   authDomain: "bmac-2018.firebaseapp.com",
 *   databaseURL: "https://bmac-2018.firebaseio.com",
 *   projectId: "bmac-2018",
 *   storageBucket: "bmac-2018.appspot.com",
 *   messagingSenderId: "974711202408"
 * };
 * firebase.initializeApp(config);
 * export default firebase;*/

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASEURL,
  projectId: process.env.REACT_APP_PROD_PROJECTID,
  storageBucket: process.env.REACT_APP_PROD_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGINGSENDERID
};

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASEURL,
  projectId: process.env.REACT_APP_DEV_PROJECTID,
  storageBucket: process.env.REACT_APP_DEV_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGINGSENDERID
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

console.log('build: ', process.env.NODE_ENV);

if (!app.apps.length) {
  app.initializeApp(config);
}

const auth = app.auth();
const db = app.database();
// specify data center so that we're always
// grabbing functions from where we're deploying
const functions = app.app().functions('us-central1');

export { db, auth, functions };
