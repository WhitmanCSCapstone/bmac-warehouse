import React from 'react';
import { DatePicker } from 'antd';

const styles = {
  container: {}
};

class CustomDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: props.value ? props.value[0] : undefined,
      endDate: props.value ? props.value[1] : undefined,
      disabled: props.disabled ? props.disabled : false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.startDate &&
      this.state.endDate &&
      (this.state.startDate !== prevState.startDate || this.state.endDate !== prevState.endDate)
    ) {
      this.props.onDateChange([this.state.startDate, this.state.endDate]);
    }
  }

  onChange = (date, prop) => {
    this.setState({ [prop]: date });
  };

  render() {
    const format = 'MM/DD/YYYY';
    return (
      <div style={styles.container}>
        <DatePicker
          placeholder={'Start Date'}
          onChange={date => this.onChange(date, 'startDate')}
          disabled={this.state.disabled}
          value={this.state.startDate}
          format={format}
        />
        <DatePicker
          placeholder={'End Date'}
          onChange={date => this.onChange(date, 'endDate')}
          disabled={this.state.disabled}
          value={this.state.endDate}
          format={format}
        />
      </div>
    );
  }
}

export default CustomDatePicker;
