import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const styles = {
  select: {
    minWidth: '8em',
    width: '100%'
  }
};

function FundsSourceDropdown(props) {
  return (
    <Select
      placeholder="Funding Source"
      style={styles.select}
      value={props.value ? props.value : undefined}
      onChange={val => props.onChange(val)}
    >
      {Object.entries(props.fundingSources).map(entry => {
        return (
          <Option key={entry[0]} value={entry[0]}>
            {entry[1].id}
          </Option>
        );
      })}
    </Select>
  );
}

export default FundsSourceDropdown;
