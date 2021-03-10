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

class FooterComponent extends React.Component<MyProps> {
  render() {
    const { classes } = this.props;
    const { root, footer, link } = classes;

    return (
      <footer className="footer">
        <Container
          style={{ marginLeft: '0px', paddingLeft: '8.333333%' }}
          maxWidth="lg"
        >
          <Copyright _class={link} />
        </Container>
      </footer>
    );
  }
}

const Footer = () => {
  const classes = useFooterStyles();
  return <FooterComponent classes={classes} />;
};

export default Footer;
