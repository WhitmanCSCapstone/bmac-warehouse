import { db } from '../firebase';
import Moment from 'moment';
import matchSorter from 'match-sorter';

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
  const providerAddress = providerObj
    ? providerObj['address'] + ' ' + providerObj['city'] + ' ' + providerObj['zip']
    : 'no given address';
  row['provider_id'] = providerName;
  row['address'] = providerAddress;
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

export function sortDataByDate(data, accessor, dateRange) {
  const newData = [];
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var entryDate = Moment(entry[accessor], 'MM/DD/YYYY');
    if (
      entryDate.isSameOrAfter(dateRange[0], 'day') &&
      entryDate.isSameOrBefore(dateRange[1], 'day')
    ) {
      newData.push(entry);
    }
  }
  return newData;
}

/*
Gets combined weight of a list of shipment or receipt items
*/
export function getCombinedWeight(items) {
  if (items) {
    let combined_weight = 0;
    for (let i = 0; i < items.length; i++) {
      combined_weight += Number(items[i].total_weight);
    }
    return combined_weight;
  } else {
    return 0;
  }
}

function formatColumnHeader(string) {
  return string
    .replace('_', ' ')
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export function getTableColumnObjBasic(string) {
  return {
    Header: formatColumnHeader(string),
    accessor: string
  };
}

export function getTableColumnObjForDates(string) {
  return {
    ...getTableColumnObjBasic(string),
    sortMethod: (a, b) => {
      const m1 = Moment(a, 'MM/DD/YYYY');
      const m2 = Moment(b, 'MM/DD/YYYY');
      if (!m1.isValid()) {
        return 1;
      }
      if (!m2.isValid()) {
        return -1;
      }
      return m2.isSameOrAfter(m1) ? 1 : -1;
    }
  };
}

export function getTableColumnObjForIntegers(string) {
  return {
    ...getTableColumnObjBasic(string),
    sortMethod: (a, b) => {
      const n1 = Number(a);
      const n2 = Number(b);
      if (isNaN(n1)) {
        return -1;
      }
      if (isNaN(n2)) {
        return 1;
      }
      return n1 > n2 ? 1 : -1;
    }
  };
}

export function getTableColumnObjForFilterableStrings(string) {
  return {
    ...getTableColumnObjBasic(string),
    filterable: true,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [string] })
  };
}

export function getTableColumnObjForFilterableHashes(string, dictionary) {
  return {
    ...getTableColumnObjForFilterableStrings(string),
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [
          keyObj => {
            const valObj = dictionary[keyObj[string]];
            return valObj ? valObj[string] : `INVALID ${string}_ID`;
          }
        ]
      })
  };
}
