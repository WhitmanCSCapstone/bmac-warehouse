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
      saveLoading: false,
      deleteLoading: false
    };
  }

  onSaveClick = () => {
    const showLoadingAnimation = () => this.setState({ saveLoading: true });
    this.props.handleOk(showLoadingAnimation);
  };

  onDeleteClick = () => {
    const showLoadingAnimation = () => this.setState({ deleteLoading: true });
    this.props.handleDelete(showLoadingAnimation);
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
            loading={this.state.deleteLoading}
            onClick={this.onDeleteClick}
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
        <Button
          key="save"
          disabled={this.props.saveDisabled}
          loading={this.state.saveLoading}
          type="primary"
          onClick={this.onSaveClick}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default Footer;
