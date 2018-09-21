import firebase from 'firebase'
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDKWBYrwFgg-klN6W8ResyPmFOmIAYaGeE",
  authDomain: "bmac-2018.firebaseapp.com",
  databaseURL: "https://bmac-2018.firebaseio.com",
  projectId: "bmac-2018",
  storageBucket: "bmac-2018.appspot.com",
  messagingSenderId: "974711202408"
};
firebase.initializeApp(config);
export default firebase;
