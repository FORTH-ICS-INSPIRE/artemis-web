import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Footer from '../footer/footer';
import Sidebar from '../sidebar/sidebar';

export default class Layout extends React.Component<any> {
  constructor(props) {
    super(props);
    this.state = { path: 'login' };
  }

  render() {
    const { children, componentName } = this.props;
    const props = this.props;
    // const Footer = dynamic(() => import('../footer/footer'));
    const Header = dynamic(() => import('../header/header-small'));
    const isSidebarOpen = false;

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
          {/* <Header {...props} /> */}
          <div
            className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
          >
            {!(['LoginPage', 'SignupPage', 'HomePage'].includes(componentName)) && <Sidebar />}
            <div className="flex flex-col flex-1 w-full">
              {!(['LoginPage', 'SignupPage', 'HomePage'].includes(componentName)) && <Header />}
              <div style={{ overflow: 'scroll' }} className="bg-gray-100 main-container mb-0 mt-0">{children}</div>
              <Footer system_version={this.props.system_version} />
            </div>
          </div>
        </div>
      </>
    );
  }
}
