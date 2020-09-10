import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      left: "0px;"
    },
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
    },
    footer: {
      padding: theme.spacing(3, 2),
      marginTop: 'auto',
      position: 'absolute',
      bottom: '0',
      left: "0px;",
      width: '100%',
      backgroundColor:
        theme.palette.grey[800],
    },
    link: {
      color: "#ffff",
      textAlign: "left",
    }
}));

class Copyright extends React.Component<any> {
  render() {
    return (
        <Typography variant="body2" className={this.props.class}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.ics.forth.gr">
            FORTH-ICS
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
  }
}

type MyProps = {
    classes: {
        root: string,
        footer: string,
        link: string
    }
};

class Footer extends React.Component<MyProps> {

    render() {
        return (
            <div className={this.props.classes.root}>
            <CssBaseline />
            <footer className={this.props.classes.footer}>
                <Container maxWidth="md">
                <Copyright class={this.props.classes.link} />
                </Container>
            </footer>
            </div>
        );
    }
}

export default () => {
    const classes = useStyles();
    return (
        <Footer classes={classes} />
    )
};
