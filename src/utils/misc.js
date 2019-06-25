export function makeProductItemsReadable(row, itemsAccessor, products) {
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
