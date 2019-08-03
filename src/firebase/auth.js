import { auth, functions } from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () => auth.signOut();

// Password Reset
export const doPasswordReset = email => auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = password => auth.currentUser.updatePassword(password);

export const revokeAuth = uid => {
  const revokeAuthentication = functions.httpsCallable('revokeAuthentication');
  return new Promise((resolve, reject) => {
    revokeAuthentication(uid)
      .then(() => resolve())
      .catch(error => reject(error));
  });
};

export const authUser = data => {
  const authenticateNewUser = functions.httpsCallable('authenticateNewUser');
  return new Promise((resolve, reject) => {
    authenticateNewUser(data)
      .then(payload => {
        resolve(payload.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
