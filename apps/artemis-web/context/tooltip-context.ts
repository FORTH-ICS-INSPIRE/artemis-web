import React from 'react';

const TooltipContext = React.createContext({
  tooltips: {},
  setTooltips: (tooltip: any) => {
      // do nothing
  },
});

export default TooltipContext;
