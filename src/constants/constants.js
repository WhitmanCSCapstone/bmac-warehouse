import { db } from '../firebase';

export const tableKeys = {
  shipments: [
    'customer_id',
    'ship_date',
    'funds_source',
    //"ship_via",
    //"ship_rate",
    //"total_weight",
    'total_weight' // warning: key is built-in but not reliably correct, must be computed on client
    //"total_price",
    //"invoice_date",
    //"invoice_no",
    //"notes",
    //"uniq_id",
  ],

  users: ['username', 'email', 'role'],

  customers: [
    'customer_id',
    //"code",
    'address',
    //"city",
    //"state",
    //"zip",
    //"county",
    //"contact",
    'phone'
    //"email",
    //"status",
    //"notes",
    //"uniq_id",
  ],

  receipts: [
    'provider_id',
    'recieve_date',
    'payment_source',
    'total_weight' // warning: not a built in key, must be computed on client
    //'billed_amt',
    //'notes'
    //"uniq_id",
  ],

  products: [
    'product_id',
    'material_number',
    //"product_code",
    'funding_source',
    'unit_weight',
    //"unit_price",
    'initial_date',
    //"initial_stock",
    //"minimum_stock",
    //"history",
    //"current_stock",
    //"inventory_date",
    'status'
    //"notes",
    //"uniq_id",
  ],

  providers: [
    'provider_id',
    //"code",
    //"type",
    'address',
    //"city",
    //"state",
    //"zip",
    //"county",
    //"contact",
    'phone'
    //"email",
    //"status",
    //"notes",
    //"uniq_id",
  ],

  fundingSources: [
    'id',
    'restriction'
    //"uniq_id"
  ]
};

export const reportKeys = {
  'Inventory Shipments': [
    'product',
    'material_number',
    'ship_date',
    'funds_source',
    'customer_id',
    'case_lots',
    'total_weight'
  ],
  'Inventory Receipts': [
    'product',
    'material_number',
    'recieve_date',
    'payment_source',
    'provider_id',
    'total_weight'
  ],
  'Current Inventory': [],
  'Current Customers': ['customer_id', 'ship_date', 'funds_source', 'total_weight'],
  'Current Providers': [
    'provider_id',
    'address',
    'payment_source',
    'recieve_date',
    'billed_amt',
    'total_weight'
  ]
};

export const radioValue2ReportType = {
  '1': 'Inventory Shipments',
  '2': 'Inventory Receipts',
  '3': 'Current Inventory',
  '4': 'Current Customers',
  '5': 'Current Providers',
  '6': 'Active',
  '7': 'Inactive/Discontinued'
};

export const reportType2TableName = {
  'Inventory Shipments': 'shipments',
  'Inventory Receipts': 'receipts',
  'Current Inventory': 'products',
  'Current Customers': 'shipments', // sorts shipments by customers
  'Current Providers': 'receipts' // sorts receipts by providers
};

export const reportType2DateAccessor = {
  'Inventory Shipments': 'ship_date',
  'Inventory Receipts': 'recieve_date',
  'Current Inventory': 'initial_date',
  'Current Customers': 'ship_date', // uses shipments table rather than customers table
  'Current Providers': 'recieve_date' // uses reciepts table
};

export const reportType2DateRangeRelavancy = {
  'Inventory Shipments': true,
  'Inventory Receipts': true,
  'Current Inventory': false,
  'Current Customers': true,
  'Current Providers': true
};

export const reportType2TotalColumnByFieldArgs = {
  'Inventory Shipments': {
    fieldToGroupBy: 'product',
    fieldToTotal: 'case_lots',
    totalColumnHeader: 'total_case_lots'
  },
  'Inventory Receipts': {
    fieldToGroupBy: 'product',
    fieldToTotal: 'total_weight',
    totalColumnHeader: 'totals'
  },
  'Current Inventory': null,
  'Current Customers': {
    fieldToGroupBy: 'customer_id',
    fieldToTotal: 'total_weight',
    totalColumnHeader: 'totals'
  },
  'Current Providers': {
    fieldToGroupBy: 'provider_id',
    fieldToTotal: 'total_weight',
    totalColumnHeader: 'totals'
  }
};

export const table2Promise = {
  shipments: db.onceGetShipments,
  receipts: db.onceGetReceipts,
  products: db.onceGetProducts,
  users: db.onceGetUsers,
  providers: db.onceGetProviders,
  customers: db.onceGetCustomers,
  fundingSources: db.onceGetFundingSources
};

export const fundingSourceRestrictions = {
  STRICT_MATCH: 'Strict Match'
};
