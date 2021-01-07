import React, { Component, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { fetchTooltip } from '../../utils/fetch-data';

class Tooltip extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: '',
    };
    this.setTooltip = this.setTooltip.bind(this);
  }

  setTooltip(tooltip) {
    this.setState({ tooltip: tooltip });
  }

  render() {
    const { context, asn, label, html } = this.props;

    return (
      <>
        <div
          onMouseOver={() =>
            fetchTooltip(asn, context, {
              setTooltip: this.setTooltip,
            })
          }
          data-tip
          data-for={label}
        >
          {html || asn}
        </div>
        <ReactTooltip place="top" effect="solid" html={true} id={label}>
          {this.state.tooltip.length ? this.state.tooltip : 'Loading...'}
        </ReactTooltip>
      </>
    );
  }
}

export default Tooltip;
