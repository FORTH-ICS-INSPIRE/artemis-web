import React from 'react';
import { Typography, Link } from '@material-ui/core';

class Copyright extends React.Component<any> {
  render() {
    const { _class } = this.props;
    return (
      <Typography variant="body2" className={_class}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.ics.forth.gr">
          FORTH-ICS
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    );
  }
}

export default Copyright;
