/**
 *  Dropdown menu to select funding source, parent component keeps track of its state
 */

import React from 'react';
import { db } from '../../firebase';
import { AutoComplete } from 'antd';

const styles = {
  container: {
    width: '100%'
  }
};

class FundsSourceAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceTypeItemList: [],
      dictionary: {},
      defaultValue: null
    };
  }

  componentDidMount() {
    db.onceGetFundingSources().then(snapshot => {
      var data = snapshot.val();
      var dictionary = {};
      var dataSourceTypeItemList = [];

      for (let [key, value] of Object.entries(data)) {
        let name = value['id'];
        dataSourceTypeItemList.push({ value: key, text: name });
        dictionary[key] = name;
      }

      this.setState({
        dataSourceTypeItemList: dataSourceTypeItemList,
        dictionary: dictionary,
        defaultValue: this.props.rowData
          ? dictionary[this.props.rowData[this.props.accessor]]
          : undefined
      });
    });
  }

  onChange = val => {
    this.props.onFundsSourceChange(val);
  };

  render() {
    return (
      <AutoComplete
        dataSource={this.state.dataSourceTypeItemList}
        defaultValue={this.state.defaultValue}
        key={this.state.defaultValue}
        style={styles.container}
        onChange={this.onChange}
        placeholder="Funding Source"
        filterOption={(inputValue, option) => {
          if (option.props.children) {
            return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
          }
        }}
      />
    );
  }
}

export default FundsSourceAutoComplete;
