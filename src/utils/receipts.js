import { db } from '../firebase';

export function getReadableReceiptsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetProviders().then(snapshot => {
      var providers = snapshot.val();
      db.onceGetReceipts().then(snapshot => {
        var data = Object.values(snapshot.val());
        data.map(row => makeRecieptReadable(row, providers));
        // this is to make it act like the Firebase Promises
        var obj = { val: () => data }
        data ? resolve(obj) : reject();
      });
    });
  });
}

function makeRecieptReadable(row, providers) {
  var uuid = row['provider_id'];
  var providerObj = providers[uuid];
  var name = null;
  if (providerObj) {
    name = providerObj['provider_id'];
  } else {
    name = 'INVALID PROVIDER ID';
  }
  row['provider_id'] = name;
  return row;
}
