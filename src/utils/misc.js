import React from 'react';
import Moment from 'moment';
import matchSorter from 'match-sorter';
import { table2Promise, fundingSourceRestrictions } from '../constants/constants';
import { Form, InputNumber, Input } from 'antd';

export function makeProductItemsReadable(items, products) {
  if (items) {
    let newItems = JSON.parse(JSON.stringify(items));
    for (let i = 0; i < newItems.length; i++) {
      const product_uuid = newItems[i].product;
      const productObj = products[product_uuid];
      const product_name = productObj ? productObj.product_id : 'INVALID PRODUCT ID';
      newItems[i].product = product_name;
    }
    return newItems;
  } else {
    return items;
  }
}

export function sortDataByDate(data, accessor, dateRange) {
  const newData = [];
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    var entryDate = Moment.unix(entry[accessor]);
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
      let itemWeight = Number(items[i].total_weight);
      combined_weight += isNaN(itemWeight) ? 0 : itemWeight;
    }
    return combined_weight;
  } else {
    return 0;
  }
}

function formatColumnHeader(string) {
  return string
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
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
      const m1 = Moment.unix(a);
      const m2 = Moment.unix(b);
      if (!m1.isValid()) {
        return 1;
      }
      if (!m2.isValid()) {
        return -1;
      }
      return m2.isSameOrAfter(m1) ? 1 : -1;
    },
    Cell: rowData => {
      const posixNum = rowData.original[string];
      let date = Moment.unix(rowData.original[string]).format('MMM D, YYYY');
      return posixNum ? date : undefined;
    }
  };
}

function sortNumbers(a, b) {
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

export function getTableColumnObjForIntegers(string) {
  return {
    ...getTableColumnObjBasic(string),
    sortMethod: (a, b) => sortNumbers(a, b)
  };
}

export function getTableColumnForTotalWeight(string, itemAccessor) {
  return {
    ...getTableColumnObjBasic(string),
    accessor: itemAccessor,
    Cell: rowData => {
      const items = rowData.original[itemAccessor];
      let totalWeight = getCombinedWeight(items);
      return totalWeight;
    },
    sortMethod: (a, b) => {
      const aWeight = getCombinedWeight(a);
      const bWeight = getCombinedWeight(b);
      return sortNumbers(aWeight, bWeight);
    }
  };
}

export function getTableColumnObjForFilterableStrings(string, exactMatch = false) {
  return {
    ...getTableColumnObjBasic(string),
    filterable: true,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        keys: [
          {
            threshold: matchSorter.rankings[exactMatch ? 'WORD_STARTS_WITH' : 'MATCH'],
            key: string
          },
          string
        ]
      })
  };
}

export function getTableColumnObjForFilterableHashes(
  string,
  dictionary,
  exactMatch = false,
  accessor = string
) {
  return {
    ...getTableColumnObjForFilterableStrings(string),
    sortMethod: (a, b) => {
      const aObj = dictionary[a];
      const bObj = dictionary[b];
      const aName = aObj ? aObj[string] : 'invalid';
      const bName = bObj ? bObj[string] : 'invalid';
      return aName.toLowerCase() > bName.toLowerCase() ? 1 : -1;
    },
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, {
        threshold: matchSorter.rankings[exactMatch ? 'WORD_STARTS_WITH' : 'MATCH'],
        key: accessor,
        keys: [
          keyObj => {
            const valObj = dictionary[keyObj[string]];
            return valObj ? valObj[accessor] : `INVALID ${string}_ID`;
          }
        ]
      })
  };
}

export function readableFundingSourceCell(rowData, fundingSources, accessor) {
  const hash = rowData.original[accessor];
  const obj = fundingSources[hash];
  // error msg changes depending on table to preserve intended behavior from old app
  const errorMsg = accessor === 'funding_source' ? '' : `INVALID ${accessor}`;
  const name = obj ? obj['id'] : errorMsg;
  return <span>{name}</span>;
}

export function getTablePromise(table, optCallback) {
  if (table === 'shipments' || table === 'receipts') {
    return new Promise((resolve, reject) => {
      table2Promise[table](optCallback).then(snapshot => {
        let tempArray = [];
        snapshot.forEach(child => {
          tempArray.push(child.val());
        });
        const data = tempArray.reverse();
        resolve(data);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      table2Promise[table](optCallback).then(snapshot => {
        const data = snapshot.val();
        resolve(data);
      });
    });
  }
}

/*
   data - list of customers or providers to sort through
   textAccessor - the accessor used to get the display value of an object in the data
   givenObjId - if there is a obj that is not active but should neverless be recognized by the Autocomplete, then give its hash here so that it can be added
*/
function getRelevantObjs(data, textAccessor, givenObjId = null) {
  return Object.values(data)
    .filter(obj => {
      return obj.status === 'active' || obj.uniq_id === givenObjId;
    })
    .map(obj => {
      return { value: obj.uniq_id, text: obj[textAccessor] };
    });
}

export function getRelevantCustomers(customers, givenCustomerId) {
  return getRelevantObjs(customers, 'customer_id', givenCustomerId);
}

export function getRelevantProviders(providers, givenProviderId) {
  return getRelevantObjs(providers, 'provider_id', givenProviderId);
}

/*
   data - takes an object that is a collection of sub-objects, and filters them by their 'status' field
 */
export function getActiveObjKeys(data) {
  return Object.values(data)
    .filter(obj => {
      return obj.status === 'active';
    })
    .map(obj => obj.uniq_id);
}

/*
   products - list of all prodcuts
   givenProductIds - products that might not be valid but are still relevant
 */
export function getRelevantProducts(products, fundsSource, fundingSources, givenProductIds) {
  return Object.values(products)
    .filter(product => {
      return (
        isProductValid(product, fundsSource, fundingSources) ||
        givenProductIds.includes(product.uniq_id)
      );
    })
    .map(product => ({ value: product.uniq_id, text: product.product_id }));
}

export function getValidProductIds(products, fundsSrcHashToFilterBy, fundingSources) {
  return Object.values(products)
    .filter(productObj => {
      return isProductValid(productObj, fundsSrcHashToFilterBy, fundingSources);
    })
    .map(productObj => {
      return productObj.uniq_id;
    });
}

function isProductValid(product, fundsSrcHashToFilterBy, fundingSources) {
  if (!product) {
    return false;
  }
  const fsHash = product.funding_source;
  const productFundingSourceDoesntExist = !fundingSources[fsHash];
  const fundingSourceToFilterBy = fundingSources[fundsSrcHashToFilterBy];
  const restriction = fundingSourceToFilterBy ? fundingSourceToFilterBy.restriction : undefined;
  const fundingSourcesDontMatch = fsHash !== fundsSrcHashToFilterBy;

  // filter out discontinued products
  if (product.status === 'discontinued') {
    return false;
  }
  // filter out conflicting funding sources
  else if (fundingSourcesDontMatch && !productFundingSourceDoesntExist) {
    return false;
  }
  // filter out products with no listed funding source if funding source is set to strict
  else if (
    productFundingSourceDoesntExist &&
    restriction === fundingSourceRestrictions.STRICT_MATCH
  ) {
    return false;
  }
  // else the product should appear in our autocomplete dropdown
  else {
    return true;
  }
}

export function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function transformToType(val, type) {
  if (val) {
    return type === 'number' ? Number(val) : val.toString();
  } else {
    return undefined;
  }
}

export function generateGenericFormItem(accessor, initialValue, onChange, getFieldDecorator, type) {
  const label = accessor
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return (
    <Form.Item
      style={{ width: '25%', flexGrow: 1, margin: '0px 1em 0em 1em' }}
      key={`form${accessor}`}
      label={label + ':'}
    >
      {getFieldDecorator(accessor, {
        initialValue: initialValue,
        rules: [
          {
            type: type,
            transform: val => transformToType(val, type),
            whitespace: true,
            message: `Please Enter A Valid ${label}`
          }
        ]
      })(
        type === 'number' ? (
          <InputNumber
            style={{ minWidth: '10em', width: '100%' }}
            placeholder={label}
            onChange={onChange}
          />
        ) : (
          <Input
            style={{ minWidth: '10em', width: '100%' }}
            placeholder={label}
            onChange={onChange}
          />
        )
      )}
    </Form.Item>
  );
}

export function deleteEmptyProductItems(items) {
  let filteredItems = items.filter(obj => {
    return (
      obj !== undefined &&
      obj['product'] !== undefined &&
      obj['product'] &&
      !obj['product'].includes('INVALID')
    );
  });
  return filteredItems;
}
