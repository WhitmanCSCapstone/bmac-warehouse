import React from 'react';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import {
  getTableColumnObjForDates,
  getTableColumnObjForIntegers,
  getTableColumnObjBasic,
  getTableColumnObjForFilterableHashes,
  readableFundingSourceCell
} from '../../utils/misc.js';
import ReceiptForm from '../../components/form/types/ReceiptForm';
import { tableKeys } from '../../constants/constants';

const keys = tableKeys['receipts'];

function readableProviderCell(rowData, providers) {
  var hash = rowData.original['provider_id'];
  var obj = providers[hash];
  var name = obj ? obj['provider_id'] : 'INVALID PROVIDER_ID';
  return <span>{name}</span>;
}

function EditableReceiptTable(props) {
  return (
    <div>
      <ReceiptForm
        formModalVisible={props.formModalVisible}
        refreshTable={props.refreshTable}
        closeForm={props.closeForm}
        rowData={props.rowData}
      />

      {!props.data || !props.providers || !props.fundingSources ? (
        <LoadingScreen />
      ) : (
        <ReactTable
          getTrProps={(state, rowInfo) => ({
            onClick: () => props.onRowClick(rowInfo)
          })}
          data={props.filteredData && props.dateRange.length ? props.filteredData : props.data}
          columns={keys.map(string => {
            if (string === 'provider_id') {
              return {
                ...getTableColumnObjForFilterableHashes(string, props.providers),
                Cell: rowData => readableProviderCell(rowData, props.providers)
              };
            }
            if (string === 'payment_source') {
              return {
                ...getTableColumnObjForFilterableHashes(string, props.fundingSources, true, 'id'),
                Cell: rowData =>
                  readableFundingSourceCell(rowData, props.fundingSources, 'payment_source')
              };
            }
            if (string === 'billed_amt') {
              return getTableColumnObjForIntegers(string);
            }
            if (string === 'recieve_date') {
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

export default EditableReceiptTable;
