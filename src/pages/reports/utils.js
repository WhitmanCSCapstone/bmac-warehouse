import { getCombinedWeight } from '../../utils/misc.js';
import { reportKeys } from '../../constants/constants';
import Moment from 'moment';

/*
   Basically throw shipments or receipt at this function and give it
   something sort by, and it'll compile all ship/receive items in a
   dictionary where the key is the uniq values of the thing you asked
   it to sort by and the value is all of the items. I.g. If you want
   to have a list of all shipments ordered into buckets based on what
   customer received them, you would pass the shipment table, ship_items
   as an accessor, and customer_id as the property.
 */
function createDictOfItemsSortedByProperty(
  data,
  property_arg,
  items_accessor,
  customers,
  providers,
  fundingSources,
  products
) {
  var dict = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var items = getVerboseItems(obj, items_accessor);
    if (items) {
      for (var n = 0; n < items.length; n++) {
        var item = items[n];
        var property = item[property_arg];
        item = makeItemReadable(item, customers, providers, fundingSources, products);
        if (property in dict) {
          dict[property].push(item);
        } else {
          dict[property] = [item];
        }
      }
    }
  }
  return dict;
}

function makeItemReadable(item, customers, providers, fundingSources, products) {
  let newItem = JSON.parse(JSON.stringify(item));
  const propsToCheck = [
    { prop: 'customer_id', dict: customers, accessor: 'customer_id' },
    { prop: 'provider_id', dict: providers, accessor: 'provider_id' },
    { prop: 'funds_source', dict: fundingSources, accessor: 'id' },
    { prop: 'payment_source', dict: fundingSources, accessor: 'id' },
    { prop: 'product', dict: products, accessor: 'product_id' }
  ];
  for (const prop of propsToCheck) {
    if (prop.prop in newItem) {
      let obj = prop.dict[newItem[prop.prop]];
      let name = obj ? obj[prop.accessor] : `INVALID ${prop.prop.toUpperCase()}`;
      newItem[prop.prop] = name;
    }
  }
  return newItem;
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

function alphabatizeByProperty(data, prop) {
  data.sort((a, b) => {
    return a[prop] > b[prop] ? 0 : -1;
  });
}

export async function getCSVdata(
  init_data,
  reportType,
  callback,
  customers,
  fundingSources,
  providers,
  products
) {
  var data = JSON.parse(JSON.stringify(init_data)); // deep clone
  if (data) {
    var array = [];
    var dict = {};
    if (reportType === 'Inventory Shipments') {
      dict = createDictOfItemsSortedByProperty(
        data,
        'product',
        'ship_items',
        customers,
        providers,
        fundingSources,
        products
      );
      array = create2DArrayFromDict(dict, reportType);
      alphabatizeByProperty(array, 'product');
    } else if (reportType === 'Inventory Receipts') {
      dict = createDictOfItemsSortedByProperty(
        data,
        'product',
        'receive_items',
        customers,
        providers,
        fundingSources,
        products
      );
      array = create2DArrayFromDict(dict, reportType);
      alphabatizeByProperty(array, 'product');
    } else if (reportType === 'Current Customers') {
      array = createCustomersReportArray(data, reportType, customers, fundingSources);
      alphabatizeByProperty(array, 'customer_id');
    } else if (reportType === 'Current Providers') {
      array = createProvidersReportArray(data, reportType, providers, fundingSources);
      alphabatizeByProperty(array, 'provider_id');
    }
    callback(array);
  } else {
    callback([]);
  }
}

function createProvidersReportArray(data, reportType, providers, fundingSources) {
  const array = [];
  for (let i = 0; i < data.length; i++) {
    let receipt = data[i];
    const items = receipt.receive_items;
    const weight = getCombinedWeight(items);
    receipt.total_weight = weight;
    receipt = filterObjKeys(receipt, reportType);
    const provider = providers[receipt.provider_id];
    if (provider) {
      receipt.address =
        provider.address + ' ' + provider.city + ' ' + provider.state + ' ' + provider.zip;
    }
    const payment_source = fundingSources[receipt.payment_source];
    receipt.provider_id = provider ? provider.provider_id : 'INVALID PROVIDER_ID';
    receipt.payment_source = payment_source ? payment_source.id : 'INVALID PAYMENT_SOURCE';
    array.push(receipt);
  }
  return array;
}

function createCustomersReportArray(data, reportType, customers, fundingSources) {
  const array = [];
  for (let i = 0; i < data.length; i++) {
    let shipment = data[i];
    const items = shipment.ship_items;
    const weight = getCombinedWeight(items);
    shipment.total_weight = weight;
    shipment = filterObjKeys(shipment, reportType);
    const customer = customers[shipment.customer_id];
    const funds_source = fundingSources[shipment.funds_source];
    shipment.customer_id = customer ? customer.customer_id : undefined;
    shipment.funds_source = funds_source ? funds_source.id : undefined;
    array.push(shipment);
  }
  return array;
}

export function makeDatesReadable(data) {
  const newData = JSON.parse(JSON.stringify(data));
  if (newData) {
    for (let obj of newData) {
      if ('ship_date' in obj) {
        obj['ship_date'] = Moment.unix(obj['ship_date']).format('MMM D, YYYY');
      }
      if ('recieve_date' in obj) {
        obj['recieve_date'] = Moment.unix(obj['recieve_date']).format('MMM D, YYYY');
      }
    }
  }
  return newData;
}
