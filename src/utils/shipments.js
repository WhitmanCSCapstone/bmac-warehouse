import { db } from '../firebase';

export async function getReadableShipmentsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetCustomers().then((snapshot) => {
      const customers = snapshot.val();
      db.onceGetShipments().then((snapshot) => {
        const data = Object.values(snapshot.val());
        data.map(row => makeShipmentReadable(row, customers));
        // this is to make it act like the Firebase Promises
        const obj = { val: () => data };
        data ? resolve(obj) : reject();
      });
    });
  });
}

function makeShipmentReadable(row, customers) {
  const uuid = row.customer_id;
  const customerObj = customers[uuid];
  let name = null;
  if (customerObj) {
    name = customerObj.customer_id;
  } else {
    name = 'INVALID CUSTOMER ID';
  }
  row.customer_id = name;
  return row;
}
