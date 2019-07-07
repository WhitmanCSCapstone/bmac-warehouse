import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, role) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    role
  });

//Database API

export const onceGetUsers = callback => db.ref('users').once('value', callback);

export const onceGetCustomers = callback => db.ref('1/customers').once('value', callback);

export const onceGetProducts = callback => db.ref('5/products').once('value', callback);

export const onceGetProviders = callback => db.ref('3/providers').once('value', callback);

export const onceGetReceipts = callback =>
  db
    .ref('6/contributions')
    .orderByChild('recieve_date')
    .once('value', callback);

export const onceGetShipments = callback =>
  db
    .ref('2/shipments')
    .orderByChild('ship_date')
    .once('value', callback);

export const onceGetStaff = callback => db.ref('0/persons').once('value', callback);

export const onceGetFundingSources = callback => db.ref('4/fundingsources').once('value', callback);

// SPECIFIC

export const onceGetSpecifcProduct = hash => db.ref(`5/products/${hash}`).once('value');

export const onceGetSpecifcUser = hash => db.ref(`users/${hash}`).once('value');

export const onceGetSpecificCustomer = hash => db.ref(`1/customers/` + hash).once('value');

export const onceGetSpecificProvider = hash => db.ref(`3/providers/` + hash).once('value');

// SET

export const setShipmentObj = (index, newData) => db.ref(`2/shipments/${index}`).set(newData);

export const setProviderObj = (index, newData) => db.ref(`3/providers/${index}`).set(newData);

export const setReceiptObj = (index, newData) => db.ref(`6/contributions/${index}`).set(newData);

export const setProductObj = (index, newData) => db.ref(`5/products/${index}`).set(newData);

export const setCustomerObj = (index, newData) => db.ref(`1/customers/${index}`).set(newData);

export const setFundingSourceObj = (index, newData) =>
  db.ref(`4/fundingsources/${index}`).set(newData);

// DELETE

export const deleteShipmentObj = index => db.ref(`2/shipments/${index}`).remove();

export const deleteReceiptObj = index => db.ref(`6/contributions/${index}`).remove();

export const deleteProviderObj = index => db.ref(`3/providers/${index}`).remove();

export const deleteProductObj = index => db.ref(`5/products/${index}`).remove();

// PUSH

export const pushShipmentObj = newData => {
  db.ref('2/shipments')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`2/shipments/${uniq_id}`).set(newData);
    });
};

export const pushFundingSourceObj = newData => {
  db.ref('4/fundingsources')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`4/fundingsources/${uniq_id}`).set(newData);
    });
};
export const pushReceiptObj = newData => {
  db.ref('6/contributions')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`6/contributions/${uniq_id}`).set(newData);
    });
};

export const pushProviderObj = newData => {
  db.ref('3/providers/')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`3/providers/${uniq_id}`).set(newData);
    });
};

export const pushProductObj = newData => {
  db.ref('5/products')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`5/products/${uniq_id}`).set(newData);
    });
};

export const pushCustomerObj = newData => {
  db.ref('1/customers')
    .push(newData)
    .then(snapshot => {
      const uniq_id = snapshot.key;
      newData['uniq_id'] = uniq_id;
      db.ref(`1/customers/${uniq_id}`).set(newData);
    });
};

export const pushStaffObj = newData => db.ref('users').push(newData);
