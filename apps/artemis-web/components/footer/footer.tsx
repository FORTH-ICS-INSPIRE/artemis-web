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
  system_version: string;
};

class FooterComponent extends React.Component<MyProps> {
  render() {
    const { classes, system_version } = this.props;
    const { root, footer, link } = classes;

    return (
      <footer className="footer">
        <Container
          style={{ marginLeft: '0px', paddingLeft: '8.333333%' }}
          maxWidth="lg"
        >
          ARTEMIS v.'{system_version}@
          {process.env.NEXT_PUBLIC_REVISION || 'HEAD'}'
          {/* <Copyright _class={link} /> */}
        </Container>
      </footer>
    );
  }
}

const Footer = (props: MyProps): unknown => {
  const system_version = props.system_version;
  const classes = useFooterStyles();
  return <FooterComponent system_version={system_version} classes={classes} />;
};

export default Footer;
