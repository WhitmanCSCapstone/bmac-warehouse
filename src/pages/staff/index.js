import React from 'react';
import {db} from '../../firebase';
import ReactTable from 'react-table';
import LoadingScreen from '../../components/LoadingScreen';
import {tableKeys} from '../../constants/constants';
import withAuthorization from '../../components/withAuthorization';

const keys = tableKeys['staff'];

const styles = {
    container: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: 24
    }
};

class Staff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            formModalVisible: false,
        }
    }

    componentDidMount() {
        db
            .onceGetStaff()
            .then(snapshot => this.setState({
                data: Object.values(snapshot.val())
            }));
    }

    render() {
        return (
            <div style={styles.container}>
                {!this.state.data
                    ? <LoadingScreen/>
                    : <ReactTable
                        data={this.state.data
                        ? this.state.data
                        : []}
                        columns={keys.map(string => {
                        if (string === 'phone1') {
                            return ({Header: "Phone", accessor: string})
                        } else {
                            return ({
                                Header: string
                                    .replace('_', ' ')
                                    .split(' ')
                                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                    .join(' '),
                                accessor: string
                            })
                        }
                    })}
                        defaultPageSize={10}
                        className="-striped -highlight"/>
}
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Staff);
