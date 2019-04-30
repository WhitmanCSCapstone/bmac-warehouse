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

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

/* const prodConfig = {
 *   apiKey: YOUR_API_KEY,
 *   authDomain: YOUR_AUTH_DOMAIN,
 *   databaseURL: YOUR_DATABASE_URL,
 *   projectId: YOUR_PROJECT_ID,
 *   storageBucket: '',
 *   messagingSenderId: YOUR_MESSAGING_SENDER_ID,
 * };
 * */

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASEURL,
  projectId: process.env.REACT_APP_DEV_PROJECTID,
  storageBucket: process.env.REACT_APP_DEV_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGINGSENDERID
};

//const config = process.env.NODE_ENV === 'production'
//             ? prodConfig
//             : devConfig;

const config = devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export { db, auth };
