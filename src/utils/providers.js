import { db } from '../firebase';


export async function getProvidersTableData() {
  return new Promise((resolve, reject) => {
    db.onceGetProviders().then(snapshot => {
      var providers = snapshot.val();
      db.onceGetProviders().then(snapshot => {
        var data = Object.values(snapshot.val());
        // this is to make it act like the Firebase Promises
        var obj = { val: () => data }
        data ? resolve(obj) : reject();
      });
    });
  });
}