import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { fetchTooltip } from '../../utils/fetch-data';

class Tooltip extends Component<any, any> {
  render() {
    const { context, asn, label, tooltips, setTooltips } = this.props;

    return (
      <>
        <div
          onMouseOver={() =>
            fetchTooltip(asn, context, {
              tooltips: tooltips,
              setTooltips: setTooltips,
            })
          }
          data-tip
          data-for={label}
        >
          {asn}
        </div>
        <ReactTooltip place="top" effect="solid" html={true} id={label}>
          {tooltips[asn] ?? 'Loading...'}
        </ReactTooltip>
      </>
    );
  }
}

export default Tooltip;
