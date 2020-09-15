import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "./Copyright";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    left: "0px;",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    position: "absolute",
    height: "4.5rem",
    bottom: "0",
    width: "100%",
    backgroundColor: theme.palette.grey[800],
  },
  link: {
    color: "#ffff",
    textAlign: "left",
    left: "-10%",
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
    const {classes} = this.props; 
    const {root, footer, link} = classes;

    return (
      <div className={root}>
        <CssBaseline />
        <footer className={footer}>
          <Container maxWidth="lg">
            <Copyright _class={link} />
          </Container>
        </footer>
      </div>
    );
  }
}

export default () => {
  const classes = useStyles();
  return <Footer classes={classes} />;
};
