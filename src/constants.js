export const tableKeys = {

  shipments: [
    "customer_id",
    "funds_source",
    "ship_date",
    "ship_via",
    "ship_rate",
    "total_weight",
    "total_price",
    "invoice_date",
    "invoice_no",
    "notes"
  ],

  customers: [
    "customer_id",
    "code",
    "address",
    "city",
    "state",
    "zip",
    "county",
    "contact",
    "phone",
    "email",
    "status",
    "notes"
  ],

  receipts: [
    "provider_id",
    "recieve_date",
    "payment_source",
    "billed_amt",
    "notes"
  ],

  products: [
    "product_id",
    "product_code",
    "funding_source",
    "unit_weight",
    "unit_price",
    "initial_date",
    "initial_stock",
    "minimum_stock",
    "history",
    "current_stock",
    "inventory_date",
    "status",
    "notes"
  ],

  providers: [
    "provider_id",
    "code",
    "type",
    "address",
    "city",
    "state",
    "zip",
    "county",
    "contact",
    "phone",
    "email",
    "status",
    "notes"
  ],

  staff: [
    "unique_id",
    "username",
    "last_name",
    "first_name",
    "address",
    "city",
    "zip",
    "phone1",
    "phone2",
    "email",
    "type",
    "status",
    "notes",
    "password"
  ],
}
