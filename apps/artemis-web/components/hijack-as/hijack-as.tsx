import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import { animated, useTransition } from 'react-spring';
import { getSeen, getWithdrawn } from '../../utils/token';
import Tooltip from '../tooltip/tooltip';

const HijackAS = (props) => {
  const seenTransitions = useTransition(props.seenState, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const withdrawnTransitions = useTransition(props.withdrawState, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const hijackDataState = props.hijackDataState;
  const classes = props.classes;
  const tooltips = props.tooltips;
  const setTooltips = props.setTooltips;
  const context = props.context;

  return (
    <div className="row">
      <div className="col-lg-6">
        {props.seenState && (
          <div className="card">
            {seenTransitions.map(({ item, key, props }) =>
              item ? (
                <animated.div
                  key={key}
                  style={props}
                  className={'card-header multi-collapse collapse show'}
                >
                  <div
                    className="card-header"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}
                  >
                    Peers Seen Hijack BGP Announcement:
                  </div>
                  <div className="card-body">
                    <Grid container spacing={3}>
                      {getSeen(hijackDataState).map((value, i) => {
                        const asn = value;
                        if (value !== undefined)
                          return (
                            <Grid key={i} item xs={3}>
                              <Paper className={classes.paper}>
                                <Tooltip
                                  tooltips={tooltips}
                                  setTooltips={setTooltips}
                                  asn={asn}
                                  label={`seen${i}`}
                                  context={context}
                                />
                              </Paper>
                            </Grid>
                          );
                        else return <> </>;
                      })}
                    </Grid>
                  </div>
                </animated.div>
              ) : (
                <animated.div key={key}></animated.div>
              )
            )}
          </div>
        )}
      </div>
      <div className="col-lg-6">
        {props.withdrawState && (
          <div className="card" style={{ borderTop: '0px' }}>
            {withdrawnTransitions.map(({ item, key, props }) =>
              item ? (
                <animated.div
                  key={key}
                  style={{ ...props, borderTop: '0px' }}
                  className={'card-header multi-collapse collapse show'}
                >
                  <div
                    className="card-header"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}
                  >
                    Peers Seen Hijack BGP Withdrawal:
                  </div>
                  <div className="card-body">
                    <Grid container spacing={3}>
                      {getWithdrawn(hijackDataState).map((value, i) => {
                        const asn = value;
                        if (value !== undefined)
                          return (
                            <Grid key={i} item xs={3}>
                              <Paper className={classes.paper}>
                                <Tooltip
                                  tooltips={tooltips}
                                  setTooltips={setTooltips}
                                  asn={asn}
                                  label={`withdrawn${i}`}
                                  context={context}
                                />
                              </Paper>
                            </Grid>
                          );
                        else return <> </>;
                      })}
                    </Grid>
                  </div>
                </animated.div>
              ) : (
                <animated.div key={key}></animated.div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HijackAS;
