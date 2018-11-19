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

const keys = tableKeys['staff'];

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
};

class Staff extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount(){
    db.onceGetStaff().then(snapshot =>
      this.setState({ data: snapshot.val() })
    );
  }

  render() {
    return(
      <div style={styles.container}>
        { !this.state.data ? <LoadingScreen/> :
          <ReactTable
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
              if(string=='username'){
                return({
                  Header: string,
                  accessor: string,
                  filterable: true,
                  filterAll: true,
                  filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ['username'] }),
                })}
                else{
                  return({
                    Header: string,
                    accessor: string,
                  })
                }
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

export default withAuthorization(authCondition)(Staff);
