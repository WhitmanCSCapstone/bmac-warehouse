import { db } from './firebase';
import { revokeAuth, authUser } from './auth';

// Database API
export const onceGetUsers = callback => db.ref('users').once('value', callback);

export const onceGetCustomers = callback => db.ref('customers').once('value', callback);

export const onceGetProducts = callback => db.ref('products').once('value', callback);

export const onceGetProviders = callback => db.ref('providers').once('value', callback);

export const onceGetReceipts = callback =>
  db
    .ref('contributions')
    .orderByChild('recieve_date')
    .limitToLast(100)
    .once('value', callback);

export const onceGetShipments = callback =>
  db
    .ref('shipments')
    .orderByChild('ship_date')
    .limitToLast(100)
    .once('value', callback);

export const onceGetFundingSources = callback => db.ref('fundingsources').once('value', callback);

// SPECIFIC

export const onceGetSpecifcProduct = hash => db.ref(`products/${hash}`).once('value');

export const onceGetSpecifcUser = hash => db.ref(`users/${hash}`).once('value');

export const onceGetSpecificCustomer = hash => db.ref(`customers/` + hash).once('value');

export const onceGetSpecificProvider = hash => db.ref(`providers/` + hash).once('value');

export const onceGetSpecificFundingSource = hash => db.ref(`fundingsources/` + hash).once('value');

// SET

export const setShipmentObj = (index, newData, callback) =>
  db.ref(`shipments/${index}`).set(newData, callback);

export const setProviderObj = (index, newData, callback) =>
  db.ref(`/providers/${index}`).set(newData, callback);

export const setReceiptObj = (index, newData, callback) =>
  db.ref(`contributions/${index}`).set(newData, callback);

export const setProductObj = (index, newData, callback) =>
  db.ref(`products/${index}`).set(newData, callback);

export const setCustomerObj = (index, newData, callback) =>
  db.ref(`customers/${index}`).set(newData, callback);

export const setFundingSourceObj = (index, newData, callback) =>
  db.ref(`fundingsources/${index}`).set(newData, callback);

export const setUserObj = (index, newData, callback) =>
  db.ref(`users/${index}`).set(newData, callback);

export const createNewUser = (data, callback) => {
  return new Promise((resolve, reject) => {
    authUser(data)
      .then(uid => {
        db.ref(`users/${uid}`).set(
          {
            username: data.username,
            email: data.email,
            role: data.role,
            uniq_id: uid
          },
          callback
        );
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};

// DELETE
// all use .set() rather than .remove() in order to make use of completion callback

export const deleteShipmentObj = (index, callback) =>
  db.ref(`shipments/${index}`).set(null, callback);

export const deleteReceiptObj = (index, callback) =>
  db.ref(`contributions/${index}`).set(null, callback);

export const deleteProviderObj = (index, callback) =>
  db.ref(`providers/${index}`).set(null, callback);

export const deleteProductObj = (index, callback) =>
  db.ref(`products/${index}`).set(null, callback);

export const deleteUserObj = (id, callback) => {
  return new Promise((resolve, reject) => {
    revokeAuth(id)
      .then(() => {
        db.ref(`users/${id}`).set(null, () => {
          callback();
        });
        resolve();
      })
      .catch(error => reject(error));
  });
};

// PUSH

export const pushShipmentObj = (newData, callback) => {
  db.ref('shipments')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`shipments/${uniq_id}`).set(newData, callback);
    });
};

export const pushFundingSourceObj = (newData, callback) => {
  db.ref('fundingsources')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`fundingsources/${uniq_id}`).set(newData, callback);
    });
};

export const pushReceiptObj = (newData, callback) => {
  db.ref('contributions')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`contributions/${uniq_id}`).set(newData, callback);
    });
};

export const pushProviderObj = (newData, callback) => {
  db.ref('providers/')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`providers/${uniq_id}`).set(newData, callback);
    });
};

export const pushProductObj = (newData, callback) => {
  db.ref('products')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`products/${uniq_id}`).set(newData, callback);
    });
};

export const pushCustomerObj = (newData, callback) => {
  db.ref('customers')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`customers/${uniq_id}`).set(newData, callback);
    });
};
