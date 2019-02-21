/**
 *  A component
 */

import React from 'react';
import { db } from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import { tableKeys } from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';
import matchSorter from 'match-sorter';
import ProductForm from '../../components/form/types/ProductForm';
import {Button} from 'antd';


const keys = tableKeys['products'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24,
    formModalVisible: false,
  },
};

class Products extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount(){
      this.refreshTable();
  }

  refreshTable = () => {
    db.onceGetProducts().then(snapshot =>
      this.setState({ data: Object.values(snapshot.val()) })
    );
  }

  render() {
    return(
      <div style={styles.container}>
      <Button type="primary"
                onClick={ () => this.setState({ formModalVisible: true }) }>
          Add New Product
        </Button>

        <ProductForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          onCancel={ () => this.setState({ formModalVisible: false }) }
        />

        {console.log(this.state.data)}
        { !this.state.data ? <LoadingScreen/> :
          <ReactTable
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
              if(string === 'product_id'){
                return({
                  Header: "Product",
                  accessor: string,
                  filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['product_id'] }),
                  filterAll: true,
                  filterable:true,
                })}

              else if(string === 'unit_weight'){
                return({
                  Header: "Unit Weight",
                  id: string,
                  accessor: d => isNaN(Number(d.unit_weight)) ? 0 : Number(d.unit_weight),
                })}

              else{
                return({
                  Header: string.replace('_',' ').split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' '),
                  accessor: string,
                })}
            })}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        }
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Products);
