import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Footer from '../footer/footer';

export default class Layout extends React.Component<any> {
  render() {
    const { children } = this.props;
    const props = this.props;
    const Header = dynamic(() => import('../header/header'));

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
          />
          <script
            src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
            integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
            crossOrigin="anonymous"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"
            crossOrigin="anonymous"
          ></script>
        </Head>
        <div className="layout">
          <Header {...props} />
          <div className="main-container">{children}</div>
          <Footer system_version={this.props.system_version} />
        </div>
      </>
    );
  }
}
