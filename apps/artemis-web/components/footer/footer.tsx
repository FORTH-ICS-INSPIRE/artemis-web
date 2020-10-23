import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './copyright';
import Flexbox from 'flexbox-react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    left: '0px;',
    width: '100%',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    paddingLeft: '8%',
    // position: 'absolute',
    height: '4.5rem',
    bottom: '0',
    width: '100%',
    backgroundColor: theme.palette.grey[800],
  },
  link: {
    color: '#ffff',
    textAlign: 'left',
    left: '-10%',
  },
}));

type MyProps = {
  classes: {
    root: string;
    footer: string;
    link: string;
  };
};

class Footer extends React.Component<MyProps> {
  render() {
    const { classes } = this.props;
    const { root, footer, link } = classes;

    return (
      <Flexbox element="footer" height="4.5rem" width="100%">
        <div className={root}>
          <CssBaseline />
          {/* <footer className={footer}> */}
          <Container maxWidth="lg" className={footer}>
            <Copyright _class={link} />
          </Container>
          {/* </footer> */}
        </div>
      </Flexbox>
    );
  }
}

const Styles = () => {
  const classes = useStyles();
  return <Footer classes={classes} />;
};

export default Styles;
