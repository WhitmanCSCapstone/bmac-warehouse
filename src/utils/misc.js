import { db } from '../firebase';

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

export function getReadableReceiptsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetProviders().then(snapshot => {
      var providers = snapshot.val();
      db.onceGetProducts().then(snapshot => {
        const products = snapshot.val();
        db.onceGetReceipts().then(snapshot => {
          var data = Object.values(snapshot.val());
          data.map(row => makeRecieptReadable(row, providers, products));
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

function makeRecieptReadable(row, providers, products) {
  const provider_uuid = row['provider_id'];
  const providerObj = providers[provider_uuid];
  const providerName = providerObj ? providerObj['provider_id'] : 'INVALID PROVIDER ID';
  row['provider_id'] = providerName;
  row = makeProductItemsReadable(row, 'receive_items', products);
  return row;
}

function makeProductItemsReadable(row, itemsAccessor, products) {
  let items = row[itemsAccessor];
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const product_uuid = items[i].product;
      const productObj = products[product_uuid];
      const product_name = productObj ? productObj.product_id : 'INVALID PRODUCT ID';
      items[i].product = product_name;
    }
  }
  row.ship_items = items;
  return row;
}
