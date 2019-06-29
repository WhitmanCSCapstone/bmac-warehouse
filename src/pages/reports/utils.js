import { sortDataByDate, getCombinedWeight } from '../../utils/misc.js';
import { reportType2FirebaseCallback, reportKeys } from '../../constants/constants';

/*
Basically throw shipments or receipt at this function and give it
something sort by, and it'll compile all ship/receive items in a
dictionary where the key is the uniq values of the thing you asked
it to sort by and the value is all of the items. I.g. If you want
to have a list of all shipments ordered into buckets based on what
customer received them, you would pass the shipment table, ship_items
as an accessor, and customer_id as the property.
*/
function createDictOfItemsSortedByProperty(data, property_arg, items_accessor) {
  var dict = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var items = getVerboseItems(obj, items_accessor);
    if (items) {
      for (var n = 0; n < items.length; n++) {
        var item = items[n];
        var property = item[property_arg];
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

function create2DArrayFromDict(dict, reportType) {
  var array = [];
  var keys = Object.keys(dict);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var objs = dict[key];
    for (var n = 0; n < objs.length; n++) {
      var obj = objs[n];
      var element = filterObjKeys(obj, reportType);
      array.push(element);
    }
  }
  return array;
}

function filterObjKeys(obj, reportType) {
  const keys = reportKeys[reportType];
  var dict = {};
  for (let key of keys) {
    dict[key] = obj[key];
  }
  return dict;
}

function getVerboseItems(oldObj, items_accessor) {
  var newObj = oldObj[items_accessor];
  for (let i in newObj) {
    for (let prop in oldObj) {
      if ('ship_items' !== prop && 'receive_items' !== prop && 'total_weight' !== prop) {
        newObj[i][prop] = oldObj[prop];
      }
    }
  }
  return newObj;
}

export async function getCSVdata(init_data, reportType, callback) {
  var data = JSON.parse(JSON.stringify(init_data)); // deep clone
  if (data) {
    var array = [];
    var dict = {};
    if (reportType === 'Inventory Shipments') {
      dict = createDictOfItemsSortedByProperty(data, 'product', 'ship_items');
      array = create2DArrayFromDict(dict, reportType);
    } else if (reportType === 'Inventory Receipts') {
      dict = createDictOfItemsSortedByProperty(data, 'product', 'receive_items');
      array = create2DArrayFromDict(dict, reportType);
    } else if (reportType === 'Current Customers') {
      array = createCustomersReportArray(data);
    } else if (reportType === 'Current Providers') {
      array = createProvidersReportArray(data, reportType);
    }
    callback(array);
  } else {
    callback([]);
  }
}

function createProvidersReportArray(data, reportType) {
  const array = [];
  for (let i = 0; i < data.length; i++) {
    let receipt = data[i];
    const items = receipt.receive_items;
    const weight = getCombinedWeight(items);
    receipt.total_weight = weight;
    receipt = filterObjKeys(receipt, reportType);
    array.push(receipt);
  }
  return array;
}

function createCustomersReportArray(data) {
  const array = [];
  for (let i = 0; i < data.length; i++) {
    let shipment = data[i];
    const items = shipment.ship_items;
    const weight = getCombinedWeight(items);
    shipment.total_weight = weight;
    shipment = filterObjKeys(shipment, 'Current Customers');
    array.push(shipment);
  }
  return array;
}

export async function populateTableData(
  reportType,
  fundingSource,
  dateRange,
  date_accessor,
  callback
) {
  var firebaseCallback = reportType2FirebaseCallback[reportType];
  var data = await firebaseCallback().then(snapshot => snapshot.val());
  data = typeof data === 'object' ? Object.values(data) : data;
  data = dateRange.length ? sortDataByDate(data, date_accessor, dateRange) : data;
  data = fundingSource ? filterDataByFundingSource(data, fundingSource) : data;
  callback(data);
}

function filterDataByFundingSource(data, fundingSource) {
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var entryFS = entry['funds_source'];
    if (entryFS === fundingSource) {
      newData.push(entry);
    }
  }
  return newData;
}
