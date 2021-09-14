import React, { Component } from 'react';
import Image from 'next/image';

type PropsType = {
  customError: any;
  containsData: boolean;
  noDataMessage: string;
  errorImage?: boolean;
};

class ErrorBoundary extends Component<PropsType, unknown> {
  state = {
    hasError: false,
    errorMessage: '',
  };

  componentDidMount() {
    if (this.props.customError) {
      this.setState({ hasError: true, errorMessage: this.props.customError });
    }
  }

  componentDidCatch = (error: any, info) => {
    this.setState({ hasError: true, errorMessage: error });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>
            <Image alt="" height="256" width="256" src="/error.png" />
          </p>
          <h3>{this.state.errorMessage}</h3>
        </div>
      );
    } else if (!this.props.containsData) {
      return (
        <div>
          <p>
            <Image
              alt=""
              height="256"
              width="256"
              src={this.props.errorImage ? '/error.png' : 'c/heckmark.png'}
            />
          </p>
          <h3>{this.props.noDataMessage}</h3>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
