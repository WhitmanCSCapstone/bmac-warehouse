import { db } from '../firebase';
import { makeProductItemsReadable } from './misc';

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

function makeRecieptReadable(row, providers, products) {
  const provider_uuid = row['provider_id'];
  const providerObj = providers[provider_uuid];
  const providerName = providerObj ? providerObj['provider_id'] : 'INVALID PROVIDER ID';
  row['provider_id'] = providerName;
  row = makeProductItemsReadable(row, 'receive_items', products);
  return row;
}
