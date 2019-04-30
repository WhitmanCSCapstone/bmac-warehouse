import { db } from '../firebase';

export async function getReadableShipmentsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetCustomers().then(snapshot => {
      var customers = snapshot.val();
      db.onceGetShipments().then(snapshot => {
        var data = Object.values(snapshot.val());
        data.map(row => makeShipmentReadable(row, customers));
        // this is to make it act like the Firebase Promises
        var obj = { val: () => data };
        data ? resolve(obj) : reject();
      });
    });
  });
}

function makeShipmentReadable(row, customers) {
  var uuid = row['customer_id'];
  var customerObj = customers[uuid];
  var name = null;
  if (customerObj) {
    name = customerObj['customer_id'];
  } else {
    name = 'INVALID CUSTOMER ID';
  }
  row['customer_id'] = name;
  return row;
}
