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
    .once('value', callback);

export const onceGetShipments = callback =>
  db
    .ref('shipments')
    .orderByChild('ship_date')
    .once('value', callback);

export const onceGetFundingSources = callback => db.ref('fundingsources').once('value', callback);

// SPECIFIC

export const onceGetSpecifcProduct = hash => db.ref(`products/${hash}`).once('value');

export const onceGetSpecifcUser = hash => db.ref(`users/${hash}`).once('value');

export const onceGetSpecificCustomer = hash => db.ref(`customers/` + hash).once('value');

export const onceGetSpecificProvider = hash => db.ref(`providers/` + hash).once('value');

export const onceGetSpecificFundingSource = hash => db.ref(`fundingsources/` + hash).once('value');

// SET

export const setShipmentObj = (index, newData) => db.ref(`shipments/${index}`).set(newData);

export const setProviderObj = (index, newData) => db.ref(`/providers/${index}`).set(newData);

export const setReceiptObj = (index, newData) => db.ref(`contributions/${index}`).set(newData);

export const setProductObj = (index, newData) => db.ref(`products/${index}`).set(newData);

export const setCustomerObj = (index, newData) => db.ref(`customers/${index}`).set(newData);

export const setFundingSourceObj = (index, newData) =>
  db.ref(`fundingsources/${index}`).set(newData);

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

export const deleteShipmentObj = index => db.ref(`shipments/${index}`).remove();

export const deleteReceiptObj = index => db.ref(`contributions/${index}`).remove();

export const deleteProviderObj = index => db.ref(`providers/${index}`).remove();

export const deleteProductObj = index => db.ref(`products/${index}`).remove();

export const deleteUserObj = (id, callback) => {
  return new Promise((resolve, reject) => {
    revokeAuth(id)
      .then(() => {
        // uses set rather than remove in order
        // to make use of completion callback
        db.ref(`users/${id}`).set(null, () => {
          callback();
        });
        resolve();
      })
      .catch(error => reject(error));
  });
};

// PUSH

export const pushShipmentObj = newData => {
  db.ref('shipments')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`shipments/${uniq_id}`).set(newData);
    });
};

export const pushFundingSourceObj = newData => {
  db.ref('fundingsources')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`fundingsources/${uniq_id}`).set(newData);
    });
};

export const pushReceiptObj = newData => {
  db.ref('contributions')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`contributions/${uniq_id}`).set(newData);
    });
};

export const pushProviderObj = newData => {
  db.ref('providers/')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`providers/${uniq_id}`).set(newData);
    });
};

export const pushProductObj = newData => {
  db.ref('products')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`products/${uniq_id}`).set(newData);
    });
};

export const pushCustomerObj = newData => {
  db.ref('customers')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`customers/${uniq_id}`).set(newData);
    });
};
