/**
 *  A component
 */

import React from "react";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { Button } from "antd";
import { db } from "../../firebase";
import LoadingScreen from "../../components/LoadingScreen";
import { tableKeys } from "../../constants/constants";
import withAuthorization from "../../components/withAuthorization";
import ProviderForm from "../../components/form/types/ProviderForm";

const keys = tableKeys.providers;

const styles = {
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: 24
  }
};

class Providers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filteredData: null,
      dateRange: null,
      formModalVisible: false,
      rowData: null
    };
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    db.onceGetProviders().then(snapshot => this.setState({ data: Object.values(snapshot.val()) }));
  };

  render() {
    return (
      <div style={styles.container}>
        <Button
          type="primary"
          onClick={() => this.setState({ formModalVisible: true, rowData: null })}
        >
          Add New Provider
        </Button>

        <ProviderForm
          formModalVisible={this.state.formModalVisible}
          refreshTable={this.refreshTable}
          closeForm={() => this.setState({ formModalVisible: false })}
          rowData={this.state.rowData}
        />
        {!this.state.data ? (
          <LoadingScreen />
        ) : (
          <ReactTable
            getTrProps={(state, rowInfo) => ({
              onClick: () =>
                this.setState({
                  rowData: rowInfo.original,
                  formModalVisible: true
                })
            })}
            data={this.state.data ? this.state.data : []}
            columns={keys.map(string => {
              if (string === "provider_id") {
                return {
                  Header: "Provider",
                  accessor: string,
                  filterable: true,
                  filterAll: true,
                  filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["provider_id"] })
                };
              }
              return {
                Header: string
                  .replace("_", " ")
                  .split(" ")
                  .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(" "),
                accessor: string
              };
            })}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        )}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

const adminOnly = false;

export default withAuthorization(authCondition, adminOnly)(Providers);
