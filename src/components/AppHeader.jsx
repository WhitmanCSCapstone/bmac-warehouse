import React from 'react';
import SignOutButton from './SignOut';
import { Icon, Button } from 'antd';

const styles = {
  container: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 50,
    paddingLeft: 50,
    alignItems: 'center',
    borderBottom: '1px solid #EBEDF0'
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold'
  },
  signOutButton: {
    paddingTop: '.4%',
    marginLeft: '1em'
  },
  icon: {
    fontSize: '1.5em'
  },
  accountBtn: {
    display: 'flex',
    alignItems: 'center',
    color: '#595959'
  },
  name: {
    fontSize: '1.05em'
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center'
  }
};

function AppHeader(props) {
  return (
    <div style={styles.container}>
      <span key="plsUpdate" style={styles.title}>
        {props.current === 'FundingSources' ? 'Funding Sources' : props.current}
      </span>
      <div style={styles.rightSide}>
        <Button style={styles.accountBtn} disabled={true}>
          <span style={styles.name}>
            {props.users && props.users[props.userUid]
              ? props.users[props.userUid].username.split(' ')[0]
              : ''}
          </span>
          <Icon style={styles.icon} type="user" />
        </Button>
        <div style={styles.signOutButton}>
          <SignOutButton type="danger" />
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
