import React from 'react';
import Moment from 'moment';
import matchSorter from 'match-sorter';
import { table2Promise } from '../constants/constants';

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

function isProductRelevant(product, fundsSrcHashToFilterBy, fundingSources) {
  if (!product) {
    return false;
  }
  const fsHash = product.funding_source;
  const fundsSrcToFilterBy = fundingSources[fundsSrcHashToFilterBy];
  const fundsSource = fundingSources[fsHash];
  // if product matches shipment/receipt funds source, or there is
  // no given shipment/receipt funds source, or the given product has
  // no funds source, AND the product isn't discontinued, return true
  return (
    product.status !== 'discontinued' &&
    (fsHash === fundsSrcHashToFilterBy || !fundsSource || !fundsSrcToFilterBy)
  );
}

export function getAutocompleteOptionsList(productObjs, fundsSrcHashToFilterBy, fundingSources) {
  const autocompleteOptionsList = [];
  for (let i = 0; i < productObjs.length; i++) {
    if (isProductRelevant(productObjs[i], fundsSrcHashToFilterBy, fundingSources)) {
      autocompleteOptionsList.push({
        value: productObjs[i].uniq_id,
        text: productObjs[i].product_id
      });
    }
  }
  return autocompleteOptionsList;
}
