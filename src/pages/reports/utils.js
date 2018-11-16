import Moment from 'moment';
import { db } from '../../firebase';
import { tableName2FirebaseCallback,
         reportKeys } from '../../constants/constants';

function createDictOfShipmentsSortedByProperty(data, property_arg) {
  var dict = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var items = obj['ship_items'];
    // b/c ship_items sometimes doesn't exist
    if (items) {
      for (var n = 0; n < items.length; n++) {
        var item = items[n];
        var property = item[property_arg];
        if (property in dict) {
          dict[property].push(obj);
        } else {
          dict[property] = [obj];
        }
      }
    }
  }
  return dict;
}

function createDictOfShipmentsSortedByCustomers(data) {
  var dict = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var customer_id = obj['customer_id'];
    if (customer_id in dict) {
      dict[customer_id].push(obj);
    } else {
      dict[customer_id] = [obj];
    }
  }
  console.log(dict);
  return dict;
}

function createArrayOfCustomersFromDict(dict, reportType) {
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

function createArrayOfShipmentsFromDict(dict) {
  var array = [];
  var keys = Object.keys(dict);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var objs = dict[key];
    for (var n = 0; n < objs.length; n++) {
      var obj = objs[n];
      var ship_date = obj['ship_date'];
      var customer = obj['customer_id'];
      var weight = obj['total_weight'];
      var element = {product: key, ship_date: ship_date, customer: customer, weight: weight};
      array.push(element);
    }
  }
  return array;
}

// TODO: DRY this
function createDictOfReceiptsSortedByProduct(data) {
  var dict = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var items = obj['receive_items'];
    // b/c ship_items sometimes doesn't exist
    if (items) {
      for (var n = 0; n < items.length; n++) {
        var item = items[n];
        var product = item['product'];
        if (product in dict) {
          dict[product].push(obj);
        } else {
          dict[product] = [obj];
        }
      }
    }
  }
  return dict;
}

function createArrayOfReceiptsFromDict(dict) {
  var array = [];
  var keys = Object.keys(dict);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var objs = dict[key];
    for (var n = 0; n < objs.length; n++) {
      var obj = objs[n];
      var receive_date = obj['recieve_date'];
      var provider = obj['provider_id'];
      var weight = 'IOU a weight value';
      var element = {product: key, receive_date: receive_date, provider: provider, weight: weight};
      array.push(element);
    }
  }
  return array;
}

export function getCSVdata(data, reportType, callback) {
  if (data) {
    var array = []
    if(reportType === 'Inventory Shipments'){
      var dict = createDictOfShipmentsSortedByProperty(data, 'product');
      array = createArrayOfShipmentsFromDict(dict);
    } else if (reportType === 'Inventory Receipts') {
      var dict = createDictOfReceiptsSortedByProduct(data);
      array = createArrayOfReceiptsFromDict(dict);
    } else if (reportType === 'Current Customers') {
      var dict = createDictOfShipmentsSortedByCustomers(data);
      array = createArrayOfCustomersFromDict(dict, reportType);
    }
    callback(array);
  } else {
    callback([]);
  }
}

export async function populateTableData(reportTypeTableName, fundingSource, dateRange, date_accessor, callback) {
  var firebaseCallback = tableName2FirebaseCallback[reportTypeTableName];
  var data = await firebaseCallback().then(snapshot => snapshot.val());
  data = Array.isArray(data) ? data : Object.keys(data).map((i) => {return(data[i])});
  data = dateRange.length ? filterDataByDate(data, dateRange, date_accessor) : data;
  data = fundingSource ? filterDataByFundingSource(data, fundingSource) : data;
  callback(data);
}

export function filterDataByFundingSource(data, fundingSource) {
  var newData = [];
  for (var i = 0; i < data.length; i++){
    var entry = data[i];
    var entryFS = entry['funds_source'];
    if(entryFS === fundingSource){
      newData.push(entry);
    }
  }
  return newData;
}

export function filterDataByDate (data, dateRange, accessor) {
  var newData = [];
  for (var i = 0; i < data.length; i++){
    var entry = data[i];
    var entryDate = Moment(entry[accessor], 'YY-MM-DD:HH:mm');
    if(entryDate >= dateRange[0] && entryDate <= dateRange[1]){
      newData.push(entry);
    }
  }
  return newData;
}

export function cleanFundingSourcesData (data) {
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    newData.push(data[i]['id']);
  }
  return newData;
}
