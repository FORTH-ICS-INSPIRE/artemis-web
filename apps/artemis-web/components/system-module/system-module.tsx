import { Button, FormControlLabel, FormGroup, Grid } from '@material-ui/core';
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

  return (
    <Grid item xs={3}>
      <div className="card">
        <div className="card-header"> {labels[key]} </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-5">
              <Button
                variant="contained"
                color={state[module] ? 'primary' : 'secondary'}
              >
                {`Active (${totalActive}/${totalModules})`}
              </Button>
            </div>
            <div className="col-lg-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state[module]}
                      onColor="#3f51b5"
                      offColor="#f50057"
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
