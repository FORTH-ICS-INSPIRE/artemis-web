import { Button, FormControlLabel, FormGroup, Grid } from '@material-ui/core';
import { AntSwitch, useStyles } from '../../utils/styles';
import React from 'react';
import Switch from 'react-ios-switch';
import { useGraphQl } from '../../utils/hooks/use-graphql';

const SystemModule = (props) => {
  const { module, state, setState, labels, subModules } = props;
  const key = module.substring(0, module.indexOf('-')).toLowerCase();
  let totalActive = 0;
  subModules[key].forEach((module) => (totalActive += module[1] ? 1 : 0));
  const totalModules = subModules[key].length;

  useGraphQl('setModuleState', {
    isLive: false,
    isMutation: true,
    running: state[module],
    name: module.toLowerCase(),
  });

  const classes = useStyles();

  return (
    <Grid item xs={3}>
      <div className="card">
        <div className="card-header"> {labels[key]} </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-6">
              <Button
                variant="contained"
                style={{ marginTop: '9px' }}
                className={
                  state[module] ? classes.activeButton : classes.inactiveButton
                }
              >
                {
                  <span>
                    Active{' '}
                    <span className="badge badge-light">
                      {totalActive}/{totalModules}
                    </span>
                  </span>
                }
              </Button>
            </div>
            <div className="col-lg-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <AntSwitch
                      checked={state[module]}
                      onChange={() => {
                        setState((prevState) => ({
                          ...prevState,
                          [module]: !state[module],
                        }));
                      }}
                      name="checkedB"
                    />
                  }
                  label=""
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default SystemModule;
