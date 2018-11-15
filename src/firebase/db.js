 import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
    db.ref(`users/${id}`).set({
        username,
        email,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetCustomers = () =>
    db.ref('1/customers').once('value');

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

export const setShipmentObj = (index, newData) =>
    db.ref(`2/shipments/${index}/ship_items`).set(newData);

export const setReceiptsObj = (index, newData) =>
    db.ref(`6/contributions/${index}/receive_items`).set(newData);
