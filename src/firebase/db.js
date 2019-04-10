 import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, role) =>
    db.ref(`users/${id}`).set({
        username,
        email,
        role,
    });

 //Database API

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetCustomers = () =>
    db.ref('1/customers').once('value');

export const onceGetSpecificCustomer = (hash) =>
    db.ref(`1/customers/` + hash).once('value');

export const onceGetProducts = () =>
    db.ref('5/products').once('value');

export const onceGetProviders = () =>
    db.ref('3/providers').once('value');

export const onceGetReceipts = () =>
    db.ref('6/contributions').once('value');

export const onceGetShipments = () =>
    db.ref('2/shipments').once('value');

export const onceGetStaff = () =>
    db.ref('0/persons').once('value');

export const onceGetFundingSources = () =>
    db.ref('4/fundingsources').once('value');

// SET

export const setShipmentObj = (index, newData) =>
    db.ref(`2/shipments/${index}`).set(newData);

export const setProviderObj = (index, newData) =>
  db.ref(`3/providers/${index}`).set(newData);

export const setReceiptObj = (index, newData) =>
  db.ref(`6/contributions/${index}`).set(newData);

export const setProductObj = (index, newData) =>
  db.ref(`5/products/${index}`).set(newData);

export const setCustomerObj = (index, newData) =>
  db.ref(`1/customers/${index}`).set(newData);

// DELETE

export const deleteShipmentObj = (index) =>
  db.ref(`2/shipments/${index}`).remove();

export const deleteReceiptObj = (index) =>
  db.ref(`6/contributions/${index}`).remove();

export const deleteProviderObj = (index) =>
  db.ref(`3/providers/${index}`).remove();

export const deleteProductObj = (index) =>
  db.ref(`5/products/${index}`).remove();

// PUSH

export const pushShipmentObj = (newData) => {
    db.ref('2/shipments')
      .push(newData)
      .then((snapshot) => {
        const uniq_id = snapshot.key;
        newData['uniq_id'] = uniq_id;
        db.ref(`2/shipments/${uniq_id}`).set(newData);
      })
}

export const pushReceiptObj = (newData) => {
    db.ref('6/contributions')
      .push(newData)
      .then((snapshot) => {
        const uniq_id = snapshot.key;
        newData['uniq_id'] = uniq_id;
        db.ref(`6/contributions/${uniq_id}`).set(newData);
      })
}

export const pushProviderObj = (newData) => {
    db.ref('3/providers/')
        .push(newData)
        .then((snapshot) => {
            const uniq_id = snapshot.key;
            newData['uniq_id'] = uniq_id;
            db.ref(`3/providers/${uniq_id}`).set(newData);
        });
}

export const pushProductObj = (newData) => {
    db.ref('5/products')
          .push(newData)
          .then((snapshot) => {
            const uniq_id = snapshot.key;
            newData['uniq_id'] = uniq_id;
            db.ref(`5/products/${uniq_id}`).set(newData);
          })
}

export const pushCustomerObj = (newData) => {
    db.ref('1/customers')
      .push(newData)
      .then((snapshot) => {
        const uniq_id = snapshot.key;
        newData['uniq_id'] = uniq_id;
        db.ref(`1/customers/${uniq_id}`).set(newData);
      })
}

export const pushStaffObj = (newData) =>
  db.ref('users').push(newData);
