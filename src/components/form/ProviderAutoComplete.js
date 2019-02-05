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
      data: [],
      selectedHash: null,
    }
  }

  componentDidMount(){
    db.onceGetProviders().then(snapshot => {

      var data = snapshot.val();
      var names = [];
      var dictionary = {};
      for(let [key, value] of Object.entries(data)){

        let name = value['provider_id'];

        if(name in dictionary || name === ""){
          console.log(`theres a dupe or an empty string in the providers table that should be deleted, here's its provider_id value: ${name}`);
        } else {
          dictionary[name] = key;
          names.push(name);
        }
      }

      this.setState({
        dictionary: dictionary,
        names: names,
      });

    });
  }

  onChange = (val) => {
    var hash = this.state.dictionary[val];
    this.props.onProviderChange('provider_id', hash);
  }

  render() {
    return(
      <AutoComplete
        dataSource={this.state.names}
        style={styles.container}
        onChange={ this.onChange }
        placeholder="Provider"
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
      />
    );
  }
}

export default ProviderAutoComplete;
