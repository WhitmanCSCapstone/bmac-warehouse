import { db } from '../firebase';


export async function getProductsTableData() {
  return new Promise((resolve, reject) => {
      db.onceGetProducts().then(snapshot => {
        var data = Object.values(snapshot.val());
        // this is to make it act like the Firebase Promises
        var obj = { val: () => data }
        data ? resolve(obj) : reject();
      });
    
  });
}