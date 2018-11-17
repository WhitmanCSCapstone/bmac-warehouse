import Moment from 'moment';
import { db } from '../../firebase';
import { tableName2FirebaseCallback,
         reportKeys } from '../../constants/constants';

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
  for(let i in newObj) {
    for(let prop in oldObj) {
      if('ship_items' !== prop && 'receive_items' !== prop){
        newObj[i][prop] = oldObj[prop];
      }
    }
  }
  return newObj;
}

export function getCSVdata(data, reportType, callback) {
  if (data) {
    var array = []
    var dict = {}
    if(reportType === 'Inventory Shipments'){
      dict = createDictOfItemsSortedByProperty(data, 'product', 'ship_items');
    } else if (reportType === 'Inventory Receipts') {
      dict = createDictOfItemsSortedByProperty(data, 'product', 'receive_items');
    } else if (reportType === 'Current Customers') {
      dict = createDictOfItemsSortedByProperty(data, 'customer_id', 'ship_items');
    }
    array = create2DArrayFromDict(dict, reportType);
    callback(array);
  } else {
    callback([]);
  }
}

export async function populateTableData(reportTypeTableName,
                                        fundingSource,
                                        dateRange,
                                        date_accessor,
                                        callback) {
  var firebaseCallback = tableName2FirebaseCallback[reportTypeTableName];
  var data = await firebaseCallback().then(snapshot => snapshot.val());
  data = Array.isArray(data)
       ? data
       : Object.keys(data).map((i) => {return(data[i])});
  data = dateRange.length
       ? filterDataByDate(data, dateRange, date_accessor)
       : data;
  data = fundingSource
       ? filterDataByFundingSource(data, fundingSource)
       : data;
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
