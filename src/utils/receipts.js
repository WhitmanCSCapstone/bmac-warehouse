import { db } from "../firebase";

export function getReadableReceiptsTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetProviders().then(snapshot => {
      const providers = snapshot.val();
      db.onceGetReceipts().then(snapshot => {
        const data = Object.values(snapshot.val());
        data.map(row => makeRecieptReadable(row, providers));
        // this is to make it act like the Firebase Promises
        const obj = { val: () => data };
        data ? resolve(obj) : reject();
      });
    });
  });
}

function makeRecieptReadable(row, providers) {
  const uuid = row.provider_id;
  const providerObj = providers[uuid];
  let name = null;
  if (providerObj) {
    name = providerObj.provider_id;
  } else {
    name = "INVALID PROVIDER ID";
  }
  row.provider_id = name;
  return row;
}
