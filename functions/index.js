const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.revokeAuthentication = functions.https.onCall((uid, context) => {
  return new Promise((resolve, reject) => {
    if (!context.auth.uid) {
      reject(Error('User is not authorized to do this action'));
    }
    console.log('Delete user w/uid ' + uid);
    admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        console.log(uid + ' deleted.');
        resolve(uid);
        return () => console.log('success!');
      })
      .catch(error => {
        console.log([e.message, uid, 'could not be deleted!'].join(' '));
        reject(error);
      });
  });
});

exports.authenticateNewUser = functions.https.onCall((data, context) => {
  return new Promise((resolve, reject) => {
    if (!context.auth.uid) {
      reject(Error('User is not authorized to do this action'));
    }
    admin
      .auth()
      .createUser({
        email: data.email,
        password: data.password
      })
      .then(userRecord => {
        let uid = userRecord.uid;
        console.log(`Successfully authenticated ${data.username} w/uid `, uid);
        resolve(uid);
        return () => console.log('success!');
      })
      .catch(error => {
        console.log(`Error authenticating ${data.username}:`, error);
        reject(error);
      });
  });
});
