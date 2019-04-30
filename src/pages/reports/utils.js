import Moment from 'moment';
import { db } from '../../firebase';
import { reportType2FirebaseCallback,
  reportKeys } from '../../constants/constants';

function createDictOfItemsSortedByProperty(data, property_arg, items_accessor) {
  const dict = {};
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    const items = getVerboseItems(obj, items_accessor);
    if (items) {
      for (let n = 0; n < items.length; n++) {
        const item = items[n];
        const property = item[property_arg];
        if (property in dict) {
          dict[property].push(items[n]);
        } else {
          dict[property] = [items[n]];
        }
      }
    }
  }
  return dict;
}


function createDictOfReceiptsSortedbyProvider(data) {
  return new Promise(async (resolve, reject) => {
    const providers = await db.onceGetProviders().then(snapshot => snapshot.val());
    data = addProviderInfo2Receipts(data, providers);
    const dict = {};
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      const uuid = obj.provider_id;
      if (uuid in dict) {
        dict[uuid].push(obj);
      } else {
        dict[uuid] = [];
      }
    }
    resolve(dict);
  });
}

function addProviderInfo2Receipts(data, providers) {
  const newData = [];
  for (const receipt of data) {
    let total_weight = 0;
    const items = receipt.receive_items;
    if (items) {
      for (const item of items) {
        total_weight += Number(item.total_weight);
      }
      receipt.total_weight = total_weight;
    } else {
      receipt.total_weight = 'NO WEIGHT GIVEN';
    }

    const uuid = receipt.provider_id;
    const obj = providers[uuid];
    if (obj) {
      receipt.address = `${obj.address} ${obj.city}`;
      receipt.provider_id = obj.provider_id;
    } else {
      receipt.address = 'INVALID PROVIDER_ID GIVEN';
      receipt.provider_id = 'INVALID PROVIDER_ID GIVEN';
    }

    newData.push(receipt);
  }
  return newData;
}

function create2DArrayFromDict(dict, reportType) {
  const array = [];
  const keys = Object.keys(dict);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const objs = dict[key];
    for (let n = 0; n < objs.length; n++) {
      const obj = objs[n];
      const element = filterObjKeys(obj, reportType);
      array.push(element);
    }
  }
  return array;
}

function filterObjKeys(obj, reportType) {
  const keys = reportKeys[reportType];
  const dict = {};
  for (const key of keys) {
    dict[key] = obj[key];
  }
  return dict;
}

function getVerboseItems(oldObj, items_accessor) {
  const newObj = oldObj[items_accessor];
  for (const i in newObj) {
    for (const prop in oldObj) {
      if (prop !== 'ship_items' && prop !== 'receive_items') {
        newObj[i][prop] = oldObj[prop];
      }
    }
  }
  return newObj;
}

export async function getCSVdata(init_data, reportType, callback) {
  const data = JSON.parse(JSON.stringify(init_data)); // deep clone
  if (data) {
    let array = [];
    let dict = {};
    if (reportType === 'Inventory Shipments') {
      dict = createDictOfItemsSortedByProperty(data, 'product', 'ship_items');
    } else if (reportType === 'Inventory Receipts') {
      dict = createDictOfItemsSortedByProperty(data, 'product', 'receive_items');
    } else if (reportType === 'Current Customers') {
      dict = createDictOfItemsSortedByProperty(data, 'customer_id', 'ship_items');
    } else if (reportType === 'Current Providers') {
      dict = await createDictOfReceiptsSortedbyProvider(data).then(dict => dict);
    }
    array = create2DArrayFromDict(dict, reportType);
    callback(array);
  } else {
    callback([]);
  }
}

export async function populateTableData(
  reportType,
  fundingSource,
  dateRange,
  date_accessor,
  callback,
) {
  const firebaseCallback = reportType2FirebaseCallback[reportType];
  let data = await firebaseCallback().then(snapshot => snapshot.val());
  data = typeof data === 'object' ? Object.values(data) : data;
  data = dateRange.length
    ? filterDataByDate(data, dateRange, date_accessor)
    : data;
  data = fundingSource
    ? filterDataByFundingSource(data, fundingSource)
    : data;
  callback(data);
}

export function filterDataByFundingSource(data, fundingSource) {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const entryFS = entry.funds_source;
    if (entryFS === fundingSource) {
      newData.push(entry);
    }
  }
  return newData;
}

export function filterDataByDate(data, dateRange, accessor) {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const entryDate = Moment(entry[accessor], 'MM/DD/YYYY');
    if (entryDate >= dateRange[0] && entryDate <= dateRange[1]) {
      newData.push(entry);
    }
  }
  return newData;
}
