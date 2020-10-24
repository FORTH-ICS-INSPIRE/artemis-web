import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Footer = dynamic(() => import('../footer/footer'));
const Header = dynamic(() => import('../header/header'));

export default class Layout extends React.Component<any> {
  render() {
    const { children, pageTitle } = this.props;
    return (
      <>
        <Head>
          <title>{pageTitle ?? 'ARTEMIS'}</title>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          />
          <script
            src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
            integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossOrigin="anonymous"
          />
          <script
            src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossOrigin="anonymous"
          />
        </Head>
        <div className="layout">
          <Header />
          {children}
          <Footer />
        </div>
      </>
    );
  }
}
