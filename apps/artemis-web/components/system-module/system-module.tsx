import { Button, FormControlLabel, FormGroup, Grid } from '@material-ui/core';
import { AntSwitch, useStyles } from '../../utils/styles';
import React, { useState } from 'react';
import { useGraphQl } from '../../utils/hooks/use-graphql';

const SystemModule = (props) => {
  const { modulesStateObj, labels, subModules, module } = props;
  const [state, setState] = useState(modulesStateObj);
  const [extraInfoState, setExtraInfoState] = useState("");

  const key = module.substring(0, module.indexOf('-')).toLowerCase();
  let totalActive = 0;
  subModules[key].forEach((module) => (totalActive += module[1] ? 1 : 0));
  const totalModules = subModules[key].length;

  useGraphQl('setModuleState', {
    isLive: false,
    isMutation: true,
    running: state[module],
    isTesting: props.isTesting,
    extra_info: extraInfoState,
    name: extraInfoState.length === 0 ? module.toLowerCase().substring(0, module.toLowerCase().indexOf('-')) : 'Exabgptap-1',
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
                style={{ marginTop: '9px', cursor: 'default' }}
                className={
                  totalActive > 0
                    ? classes.activeButton
                    : classes.inactiveButton
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
                        if (module === 'Autoconfiguration-1') {
                          if (state[module]) setExtraInfoState("autoconf-off");
                          else setExtraInfoState("autoconf-on");

                          setState((prevState) => ({
                            ...prevState,
                            [module]: !state[module],
                          }));
                        } else {
                          setExtraInfoState("");
                          setState((prevState) => ({
                            ...prevState,
                            [module]: !state[module],
                          }));
                        }
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
