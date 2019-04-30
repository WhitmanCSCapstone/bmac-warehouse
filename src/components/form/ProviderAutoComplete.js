import React from 'react';
import { AutoComplete } from 'antd';
import { db } from '../../firebase';

const styles = {
  container: {
    width: '100%',
  },
};

class ProviderAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceTypeItemList: null,
      dictionary: {},
      defaultValue: null,
    };
  }

  componentDidMount() {
    db.onceGetProviders().then((snapshot) => {
      const data = snapshot.val();
      const dictionary = {};
      const dataSourceTypeItemList = [];

      for (const [key, value] of Object.entries(data)) {
        const name = value.provider_id;
        dataSourceTypeItemList.push({ value: key, text: name });
        dictionary[key] = name;
      }

      this.setState({
        dataSourceTypeItemList,
        dictionary,
        defaultValue: this.props.rowData ? dictionary[this.props.rowData.provider_id] : null,
      });
    });
  }

  onChange = (val) => {
    this.props.onProviderChange(val);
  }

  render() {
    return (
      <AutoComplete
        dataSource={this.state.dataSourceTypeItemList}
        defaultValue={this.state.defaultValue}
        key={this.state.defaultValue}
        style={styles.container}
        onChange={this.onChange}
        placeholder="Provider"
        filterOption={(inputValue, option) => {
            if (option.props.children) {
              return option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
}
            }
        }
      />
    );
  }
}

export default ProviderAutoComplete;
