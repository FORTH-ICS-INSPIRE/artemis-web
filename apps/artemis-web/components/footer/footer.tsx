import { Container, CssBaseline } from '@material-ui/core';
import { useFooterStyles } from '../../utils/styles';
import React from 'react';
import Copyright from './copyright';

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

const Styles = () => {
  const classes = useFooterStyles();
  return <Footer classes={classes} />;
};

export default Styles;
