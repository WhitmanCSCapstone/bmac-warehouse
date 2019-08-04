import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import Moment from 'moment';
import { db } from '../../../firebase';
import {
  makeProductItemsReadable,
  getCombinedWeight,
  deleteEmptyProductItems
} from '../../../utils/misc.js';

function writeBmacAddressToPdf(pdf, base_x) {
  pdf.setFontType('italic');
  pdf.text(base_x, 22.5, 'Blue Mountain Action Council');
  pdf.text(base_x, 30, 'Walla Walla, WA, 99362');
}

function writeLabelValue(pdf, obj, base_x, y, x_diff) {
  pdf.setFontType('bold');
  pdf.text(base_x, y, obj.label);
  pdf.setFontType('normal');
  pdf.text(base_x + x_diff, y, '' + obj.value);
}

function writeProductItemsToPdfAndReturnY(pdf, items, y_old, base_x) {
  let y = Number(JSON.parse(JSON.stringify(y_old)));

  pdf.setFontType('bold');
  pdf.text(10, y, 'Items Shipped:');
  pdf.setFontType('normal');

  let total_case_lots = 0;

  const headers = [['Material #', 'Product', 'Unit Weight', 'Case Lots', 'Total Weight']];
  const tableData = [];

  for (let i = 0; i < items.length; i++) {
    const product = items[i].product;
    const material_number = items[i].material_number;
    const unit_weight = items[i].unit_weight;
    const case_lots = items[i].case_lots;
    const total_weight = items[i].total_weight;

    const row = [material_number, product, unit_weight, case_lots, total_weight];

    tableData.push(row);

    total_case_lots += parseInt(case_lots, 10);
  }

  const lastRow = ['', '', 'Totals:', total_case_lots, getCombinedWeight(items)];

  tableData.push(lastRow);

  pdf.autoTable({
    startY: y + 5,
    head: headers,
    margin: { left: base_x },
    body: tableData,
    styles: { fontSize: 11 }
  });

  y = pdf.previousAutoTable.finalY;

  return y;
}

/*
     @param 1 - X Coordinate (in units declared at inception of PDF document)
     @param 2 - Y Coordinate (in units declared at inception of PDF document)
     @param 3 - String or array of strings to be added to the page. Each line
     is shifted one line down per font, spacing settings declared
     before this call.
   */
export function handleInvoiceClick(state, customers, products, fundingSources) {
  const pdf = new jspdf();
  const customerObj = customers[state.customer_id];
  let customerName = customerObj.customer_id;
  let address = customerObj.address;
  let city = customerObj.city;
  let stateUS = customerObj.state;
  let zip = customerObj.zip;
  let fullAddress = address + ', ' + city + ', ' + stateUS + ', ' + zip;

  const base_x = 10;
  var y = 15;

  const fundsSrcObj = fundingSources[state.funds_source];
  const fundsSource = fundsSrcObj.id;

  pdf.setFont('helvetica');
  pdf.setFontSize('20');
  pdf.setFontType('bold');
  pdf.text(base_x, y, 'BMAC Shipment Invoice');
  writeBmacAddressToPdf(pdf, base_x);

  pdf.setFontSize('12');
  pdf.setFontType('normal');

  y = y + 25;

  const info = [
    { label: 'Invoice No:', value: state.ship_date },
    { label: 'Ship Date:', value: Moment.unix(state.ship_date).format('MMM D, YYYY') },
    { label: 'Ship Via:', value: state.ship_via },
    { label: 'Funds Src:', value: fundsSource }
  ];

  let x_diff = 25;
  info.forEach(obj => {
    writeLabelValue(pdf, obj, base_x, y, x_diff);
    y += 5;
  });

  y += 5;
  pdf.setFontType('bold');
  pdf.text(base_x, y, 'Ship To: ');
  pdf.setFontType('normal');
  y += 5;
  pdf.text(base_x, y, customerName);
  y += 5;
  pdf.text(base_x, y, fullAddress);
  y += 10;

  const items = makeProductItemsReadable(state.ship_items, products);
  const clean_ship_items = deleteEmptyProductItems(items);

  y = writeProductItemsToPdfAndReturnY(pdf, clean_ship_items, y, base_x);

  const data = [
    { label: 'Rate:', value: state.ship_rate ? state.ship_rate : '' },
    { label: 'Billed Amt:', value: state.total_price ? state.total_price : '' },
    { label: 'Notes:', value: state.notes ? state.notes : '' }
  ];

  y += 10;

  x_diff = 25;
  data.forEach(obj => {
    writeLabelValue(pdf, obj, base_x, y, x_diff);
    y += 5;
  });

  y += 10;

  pdf.text(base_x, y, 'BMAC Signature - ____________________________________________');
  y += 10;
  pdf.text(base_x, y, 'Agency Signature - ___________________________________________');

  pdf.save('shipment_invoice');
}

export function handleReceiptClick(state, providers, products, fundingSources) {
  const pdf = new jspdf();
  const providerObj = providers[state.provider_id];
  let providerName = providerObj.provider_id;
  let address = providerObj.address;
  let city = providerObj.city;
  let stateUS = providerObj.state;
  let zip = providerObj.zip;
  let fullAddress = address + ', ' + city + ', ' + stateUS + ', ' + zip;

  const base_x = 10;
  let y = 15;

  const fundsSrcObj = fundingSources[state.payment_source];
  const fundsSource = fundsSrcObj.id;

  pdf.setFont('helvetica');
  pdf.setFontSize('20');
  pdf.setFontType('bold');
  pdf.text(base_x, y, 'BMAC Receipt');
  writeBmacAddressToPdf(pdf, base_x);

  pdf.setFontSize('12');
  pdf.setFontType('normal');

  y = y + 25;

  const info = [
    { label: 'Invoice No:', value: state.recieve_date },
    { label: 'Recieve Date:', value: Moment.unix(state.recieve_date).format('MMM D, YYYY') },
    { label: 'Payment Src:', value: fundsSource }
  ];

  let x_diff = 30;
  info.forEach(obj => {
    writeLabelValue(pdf, obj, base_x, y, x_diff);
    y += 5;
  });

  y += 5;
  pdf.setFontType('bold');
  pdf.text(base_x, y, 'Provider: ');
  pdf.setFontType('normal');
  y += 5;
  pdf.text(base_x, y, providerName);
  y += 5;
  pdf.text(base_x, y, fullAddress);
  y += 10;

  const items = makeProductItemsReadable(state.receive_items, products);
  const clean_recieve_items = deleteEmptyProductItems(items);

  y = writeProductItemsToPdfAndReturnY(pdf, clean_recieve_items, y, base_x);

  const data = [
    { label: 'Billed Amt:', value: state.billed_amt ? state.billed_amt : '' },
    { label: 'Notes:', value: state.notes ? state.notes : '' }
  ];

  y += 10;

  x_diff = 25;
  data.forEach(obj => {
    writeLabelValue(pdf, obj, base_x, y, x_diff);
    y += 5;
  });

  y += 10;

  pdf.text(base_x, y, 'BMAC Signature - ____________________________________________');

  pdf.save('receipt');
}

export function handleLabelClick(state, customers, fundingSources) {
  const pdf = new jspdf();

  const customerObj = customers[state.customer_id];
  const fundsSrcObj = fundingSources[state.funds_source];

  let customerName = customerObj.customer_id;
  let address = customerObj.address + '';
  let city = customerObj.city;
  let stateUS = customerObj.state;
  let zip = customerObj.zip;
  let cityStateZip = city + ', ' + stateUS + ', ' + zip;

  pdf
    .setFont('Helvetica')
    .setFontSize(28)
    .setFontType('italic');

  pdf.text(10, 20, 'From:');
  pdf.text(50, 30, 'Blue Mountain Action Council');
  pdf.text(50, 40, 'Walla Walla, WA 99362');

  pdf.text(10, 60, 'Ship To: ');
  pdf.text(50, 70, customerName);
  pdf.text(50, 80, address);
  pdf.text(50, 90, cityStateZip);

  pdf.setFontSize(12).setFontType('normal');

  pdf.text(10, 110, 'Invoice no: ' + state.ship_date);
  pdf.text(130, 110, 'Funds Source: ' + fundsSrcObj.id);
  pdf.text(10, 120, 'Ship Date: ' + Moment.unix(state.ship_date).format('MMM D, YYYY'));
  pdf.text(70, 120, 'Ship Via: ' + state.ship_via);
  pdf.text(130, 120, 'Total Weight: ' + getCombinedWeight(state.ship_items));

  pdf.save('Label');
}
