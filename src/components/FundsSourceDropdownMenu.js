/**
 *  Dropdown menu to select funding source, parent component keeps track of its state
 */

import React from 'react';
import { Select } from 'antd';
import { db } from '../firebase';

const { Option } = Select;

const styles = {
  select: {
    width: '100%',
    minWidth: '10em'
  },
  none: {
    color: '#C1C1C1'
  }
};

class FundsSourceDropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fundingSources: []
    };
  }

  componentDidMount() {
    db.onceGetFundingSources().then(snapshot => {
      const data = this.cleanFundingSourcesData(Object.values(snapshot.val()));
      this.setState({ fundingSources: data });
    });
  }

  cleanFundingSourcesData = data => {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      newData.push(data[i].id);
    }
    return newData;
  };

  //https://stackoverflow.com/questions/51283562/how-to-add-the-input-field-inside-the-select-option-using-ant-design-and-react
  render() {
    return (
      <div>
        <Select
          onChange={value => this.props.onClick(value)}
          disabled={this.props.disabled}
          style={styles.select}
          key={this.props.funds_source}
          defaultValue={this.props.rowData ? this.props.fundingSource : undefined}
          placeholder="Funding Source"
        >
          {this.state.fundingSources.map(name => {
            return (
              <Option key={name} value={name}>
                {name}
              </Option>
            );
          })}
          <Option key="None" value={null}>
            <em style={styles.none}>None</em>
          </Option>
        </Select>
      </div>
    );
  }
}

export default FundsSourceDropdownMenu;
