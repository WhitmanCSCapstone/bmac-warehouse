import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import {
  getTableColumnObjForDates,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableHashes,
  readableFundingSourceCell
} from '../../utils/misc.js';
import ShipmentForm from '../../components/form/types/ShipmentForm';
import { tableKeys } from '../../constants/constants';

const keys = tableKeys['shipments'];

function readableCustomerCell(rowData, customers) {
  var hash = rowData.original['customer_id'];
  var obj = customers[hash];
  var name = obj ? obj['customer_id'] : 'INVALID CUSTOMER_ID';
  return <span>{name}</span>;
}

function EditableShipmentTable(props) {
  return (
    <div>
      <ShipmentForm
        formModalVisible={props.formModalVisible}
        refreshTable={props.refreshTable}
        closeForm={props.closeForm}
        rowData={props.rowData}
      />

      {!props.data || !props.customers || !props.fundingSources ? (
        <LoadingScreen />
      ) : (
        <ReactTable
          getTrProps={(state, rowInfo) => ({
            onClick: () => props.onRowClick(rowInfo)
          })}
          data={props.filteredData && props.dateRange.length ? props.filteredData : props.data}
          columns={keys.map(string => {
            if (string === 'customer_id') {
              return {
                ...getTableColumnObjForFilterableHashes(string, props.customers),
                Cell: rowData => readableCustomerCell(rowData, props.customers)
              };
            }
            if (string === 'funds_source') {
              return {
                ...getTableColumnObjForFilterableHashes(string, props.fundingSources, true, 'id'),
                Cell: rowData =>
                  readableFundingSourceCell(rowData, props.fundingSources, 'funds_source')
              };
            }
            if (string === 'ship_date') {
              return getTableColumnObjForDates(string);
            } else {
              return getTableColumnObjBasic(string);
            }
          })}
          defaultPageSize={props.defaultPageSize}
          showPagination={props.showPagination}
          className="-striped -highlight"
        />
      )}
    </div>
  );
}

export default EditableShipmentTable;
