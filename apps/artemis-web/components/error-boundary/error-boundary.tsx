import React, { Component } from 'react';

type PropsType = {
  customError: any;
  containsData: boolean;
  noDataMessage: string;
  errorImage?: boolean;
};

class ErrorBoundary extends Component<PropsType, {}> {
  state = {
    hasError: false,
    errorMessage: '',
  };

  componentDidMount() {
    if (this.props.customError) {
      this.setState({ hasError: true, errorMessage: this.props.customError });
    }
  }

  componentDidCatch = (error, info) => {
    this.setState({ hasError: true, errorMessage: error });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>
            <img alt="" width="256" src="error.png"></img>
          </p>
          <h3>{this.state.errorMessage}</h3>
        </div>
      );
    } else if (!this.props.containsData) {
      return (
        <div>
          <p>
            <img
              alt=""
              src={this.props.errorImage ? 'error.png' : 'checkmark.png'}
            ></img>
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
