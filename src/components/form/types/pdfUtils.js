import * as jspdf from 'jspdf';
import Moment from 'moment';
import { db } from '../../../firebase';
import { makeProductItemsReadable, getCombinedWeight } from '../../../utils/misc.js';

function writeBmacAddressToPdf(pdf) {
  pdf.setFontType('italic');
  pdf.text(55, 17.5, 'Blue Mountain Action Council');
  pdf.text(55, 25, 'Walla Walla, WA, 99362');
}

function writeProductItemsToPdfAndReturnY(pdf, items, y_old) {
  let y = Number(JSON.parse(JSON.stringify(y_old)));

  const base_x = 5;
  const prodX = base_x;
  const materialNumX = prodX + 85;
  const unitWeightX = materialNumX + 25;
  const caseLotX = unitWeightX + 25;
  const totalWeightX = caseLotX + 25;

  pdf.text(10, 90, 'Items Shipped:');
  pdf.setFontType('bold');
  pdf.text(prodX, 100, 'Product');
  pdf.text(materialNumX, 100, 'Material #');
  pdf.text(unitWeightX, 100, 'Unit Weight');
  pdf.text(caseLotX, 100, 'Case Lots');
  pdf.text(totalWeightX, 100, 'Total Weight');
  pdf.setFontType('normal');

  let total_case_lots = 0;

  for (let i = 0; i < items.length; i++) {
    const product = items[i].product;
    const material_number = items[i].material_number;
    const unit_weight = items[i].unit_weight;
    const case_lots = items[i].case_lots;
    const total_weight = items[i].total_weight;
    product ? pdf.text(prodX, y, String(product)) : pdf.text(prodX, y, '-');
    material_number
      ? pdf.text(materialNumX, y, String(material_number))
      : pdf.text(materialNumX, y, '-');
    unit_weight ? pdf.text(unitWeightX, y, String(unit_weight)) : pdf.text(unitWeightX, y, '-');
    case_lots ? pdf.text(caseLotX, y, String(case_lots)) : pdf.text(caseLotX, y, '-');
    total_weight ? pdf.text(totalWeightX, y, String(total_weight)) : pdf.text(totalWeightX, y, '-');
    y += 5;
    total_case_lots += parseInt(case_lots, 10);
  }

  pdf.setFontType('bold');
  pdf.text(unitWeightX, y + 5, 'Totals: ');
  pdf.text(caseLotX, y + 5, String(total_case_lots));
  pdf.text(totalWeightX, y + 5, String(getCombinedWeight(items)));
  pdf.text(totalWeightX + 15, y + 5, 'pounds');

  return y;
}

/*
   @param 1 - X Coordinate (in units declared at inception of PDF document)
   @param 2 - Y Coordinate (in units declared at inception of PDF document)
   @param 3 - String or array of strings to be added to the page. Each line
   is shifted one line down per font, spacing settings declared
   before this call.
 */
export function handleInvoiceClick(state) {
  const pdf = new jspdf();
  db.onceGetSpecificCustomer(state.customer_id).then(customerObj => {
    let customerName = customerObj.child('customer_id').val();
    let address = customerObj.child('address').val();
    let city = customerObj.child('city').val();
    let stateUS = customerObj.child('state').val();
    let zip = customerObj.child('zip').val();
    let fullAddress = address + ', ' + city + ', ' + stateUS + ', ' + zip;

    pdf.setFont('helvetica');
    pdf.setFontSize('20');
    pdf.setFontType('bold');
    pdf.text(55, 10, 'BMAC Shipment Invoice');
    writeBmacAddressToPdf(pdf);

    pdf.setFontType('italic');
    pdf.setFontSize('12');
    pdf.text(10, 40, 'Invoice No:' + state.ship_date);
    pdf.text(10, 50, 'Ship Date: ' + Moment.unix(state.ship_date).format('MMM D, YYYY'));
    pdf.text(70, 50, 'Ship Via: ' + state.ship_via);
    db.onceGetSpecificFundingSource(state.funds_source).then(fundsSrcObj => {
      pdf.text(130, 50, 'Funds Source: ' + fundsSrcObj.child('id').val());
      pdf.text(10, 65, 'Ship To: ');
      pdf.text(15, 75, customerName);
      pdf.text(15, 80, fullAddress);

      db.onceGetProducts().then(snapshot => {
        const products = snapshot.val();
        const items = makeProductItemsReadable(state.ship_items, products);
        const clean_ship_items = deleteEmptyProductItems(items);
        let y = 105;

        y = writeProductItemsToPdfAndReturnY(pdf, clean_ship_items, y);

        pdf.setFontType('normal');
        pdf.setFontType('italic');
        pdf.text(10, y + 20, 'Rate: ' + state.ship_rate);
        pdf.text(70, y + 20, 'Billed Amount: ' + state.total_price);
        pdf.text(10, y + 30, 'Notes: ' + state.notes);
        pdf.text(10, y + 50, 'BMAC Signature - ____________________________________________');
        pdf.text(10, y + 60, 'Agency Signature - ___________________________________________');

        pdf.save('shipment_invoice');
      });
    });
  });
}

export function handleReceiptClick(state) {
  const pdf = new jspdf();
  db.onceGetSpecificProvider(state.provider_id).then(providerObj => {
    let providerName = providerObj.child('provider_id').val();
    let address = providerObj.child('address').val();
    let city = providerObj.child('city').val();
    let stateUS = providerObj.child('state').val();
    let zip = providerObj.child('zip').val();
    let fullAddress = address + ', ' + city + ', ' + stateUS + ', ' + zip;

    pdf.setFont('helvetica');
    pdf.setFontSize('20');
    pdf.setFontType('bold');
    pdf.text(55, 10, 'BMAC Receipt');
    writeBmacAddressToPdf(pdf);

    pdf.setFontType('italic');
    pdf.setFontSize('12');
    pdf.text(10, 40, 'Invoice No: ' + state.recieve_date);
    pdf.text(10, 50, 'Recieve Date: ' + Moment.unix(state.recieve_date).format('MMM D, YYYY'));
    db.onceGetSpecificFundingSource(state.payment_source).then(fundsSrcObj => {
      pdf.text(130, 50, 'Funds Source: ' + fundsSrcObj.child('id').val());
      pdf.text(10, 65, 'Provider: ');
      pdf.text(15, 75, providerName);
      pdf.text(15, 80, fullAddress);

      db.onceGetProducts().then(snapshot => {
        const products = snapshot.val();
        const items = makeProductItemsReadable(state.receive_items, products);
        const clean_recieve_items = deleteEmptyProductItems(items);
        let y = 105;

        y = writeProductItemsToPdfAndReturnY(pdf, clean_recieve_items, y);

        pdf.setFontType('normal');
        pdf.setFontType('italic');
        pdf.text(70, y + 20, 'Billed Amount: ' + state.billed_amt);
        pdf.text(10, y + 30, 'Notes: ' + state.notes);
        pdf.text(10, y + 50, 'BMAC Signature - ____________________________________________');

        pdf.save('receipt');
      });
    });
  });
}

export function handleLabelClick(state) {
  const pdf = new jspdf();

  db.onceGetSpecificCustomer(state.customer_id).then(customerObj => {
    let customerName = customerObj.child('customer_id').val();
    let address = customerObj.child('address').val();
    let city = customerObj.child('city').val();
    let stateUS = customerObj.child('state').val();
    let zip = customerObj.child('zip').val();
    let fullAddress = city + ', ' + stateUS + ', ' + zip;

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
    pdf.text(50, 90, fullAddress);

    pdf.setFontSize(12).setFontType('normal');
    pdf.text(10, 110, 'Invoice no: ' + state.ship_date);
    db.onceGetSpecificFundingSource(state.funds_source).then(fundsSrcObj => {
      pdf.text(130, 110, 'Funds Source: ' + fundsSrcObj.child('id').val());
      pdf.text(10, 120, 'Ship Date: ' + Moment.unix(state.ship_date).format('MMM D, YYYY'));
      pdf.text(70, 120, 'Ship Via: ' + state.ship_via);
      pdf.text(130, 120, 'Total Weight: ' + getCombinedWeight(state.ship_items));

      pdf.save('Label');
    });
  });
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
