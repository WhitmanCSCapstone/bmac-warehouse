import { db } from '../firebase';
import { makeProductItemsReadable } from './misc';

export async function getReadableShipmentsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetCustomers().then(snapshot => {
      var customers = snapshot.val();
      db.onceGetProducts().then(snapshot => {
        const products = snapshot.val();
        db.onceGetShipments().then(snapshot => {
          var data = Object.values(snapshot.val());
          data.map(row => makeShipmentReadable(row, customers, products));
          // this is to make it act like the Firebase Promises
          var obj = { val: () => data };
          data ? resolve(obj) : reject();
        });
      });
    });
  });
}

function makeShipmentReadable(row, customers, products) {
  const customer_uuid = row['customer_id'];
  const customerObj = customers[customer_uuid];
  const customerName = customerObj ? customerObj['customer_id'] : 'INVALID CUSTOMER ID';
  row['customer_id'] = customerName;
  row = makeProductItemsReadable(row, 'ship_items', products);
  return row;
}
