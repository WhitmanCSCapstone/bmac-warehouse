import React from 'react';
import { Button } from 'antd';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  deleteBtn: {
    marginRight: 'auto'
  }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  onClick = () => {
    this.setState({ loading: true });
    this.props.handleOk();
  };

  render() {
    return (
      <div style={styles.container}>
        {this.handleDelete ? (
          <Button
            key="delete"
            style={styles.deleteBtn}
            disabled={this.props.rowData ? false : true}
            type="danger"
            onClick={this.handleDelete}
          >
            Delete
          </Button>
        ) : null}

        {this.props.handleLabel ? (
          <Button key="savelabel" type="primary" onClick={this.props.handleLabel}>
            Create Label
          </Button>
        ) : null}

        {this.props.handlePdf ? (
          <Button key="savepdf" type="primary" onClick={this.props.handlePdf}>
            Save Invoice
          </Button>
        ) : null}

        <Button key="Cancel" onClick={this.props.closeForm}>
          Cancel
        </Button>
        <Button key="submit" loading={this.state.loading} type="primary" onClick={this.onClick}>
          Submit
        </Button>
      </div>
    );
  }
}

export default Footer;
