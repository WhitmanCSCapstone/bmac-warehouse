import React from 'react';
import { AutoComplete } from 'antd';
import { db } from '../../firebase';

const styles = {
  container: {
    width: '100%',
  },
}

class ProviderAutoComplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSourceTypeItemList: null,
    }
  }

  componentDidMount(){
    db.onceGetProviders().then(snapshot => {
      var data = snapshot.val();
      var dataSourceTypeItemList = [];
      for(let [key, value] of Object.entries(data)) {
        let name = value['provider_id'];
        dataSourceTypeItemList.push({value: key, text: name});
      }
      this.setState({
        dataSourceTypeItemList: dataSourceTypeItemList,
      });
    });
  }

  onChange = (val) => {
    this.props.onProviderChange('provider_id', val);
  }

  render() {
    return(
      <AutoComplete
        dataSource={this.state.dataSourceTypeItemList}
        style={styles.container}
        onChange={ this.onChange }
        placeholder="Provider"
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  }
}

export default ProviderAutoComplete;
