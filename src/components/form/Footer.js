import React from 'react';
import { Button, Icon } from 'antd';

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
        {this.props.handleDelete ? (
          <Button
            key="delete"
            style={styles.deleteBtn}
            disabled={this.props.rowData ? false : true}
            type="danger"
            onClick={this.props.handleDelete}
          >
            Delete
          </Button>
        ) : null}

        {this.props.handleLabelClick ? (
          <Button key="savelabel" type="primary" onClick={this.props.handleLabelClick}>
            Label
            <Icon type="file-pdf" />
          </Button>
        ) : null}

        {this.props.handleInvoiceClick ? (
          <Button key="saveInvoice" type="primary" onClick={this.props.handleInvoiceClick}>
            Invoice <Icon type="file-pdf" />
          </Button>
        ) : null}

        {this.props.handleReceiptClick ? (
          <Button key="saveReceipt" type="primary" onClick={this.props.handleReceiptClick}>
            Receipt
            <Icon type="file-pdf" />
          </Button>
        ) : null}

        <Button key="Cancel" onClick={this.props.closeModal}>
          Cancel
        </Button>
        <Button key="submit" loading={this.state.loading} type="primary" onClick={this.onClick}>
          Save
        </Button>
      </div>
    );
  }
}

export default Footer;
