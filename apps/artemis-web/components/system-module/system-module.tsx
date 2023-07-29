import { Button, FormControlLabel, FormGroup, Grid } from '@material-ui/core';
import { AntSwitch, useStyles } from '../../utils/styles';
import React, { useState } from 'react';
import { useGraphQl } from '../../utils/hooks/use-graphql';

enum AutoModuleStatus {
  AUTO_ON = "automodule-on",
  AUTO_OFF = "automodule-off",
  AUTO_UNDEF = ""
}

const SystemModule = (props) => {
  const { modulesStateObj, labels, subModules, module } = props;
  // const [extraInfoState, setExtraInfoState] = useState("");

  const isChecked = () => {
    if (module === 'Autoconfiguration-1') return autoConfState === AutoModuleStatus.AUTO_ON;
    else return state[module];
  };

  const getState = () => {
    if (module === 'Autoconfiguration-1') return modulesStateObj["Autoconfiguration-1"] ? AutoModuleStatus.AUTO_ON : AutoModuleStatus.AUTO_OFF;
    else return "";
  };
  
  const [state, setState] = useState(modulesStateObj);
  const [autoConfState, setAutoConfState] = useState(getState());
  const key = module.substring(0, module.indexOf('-')).toLowerCase();
  let totalActive = 0;
  subModules[key].forEach((module) => (totalActive += module[1] ? 1 : 0));
  // if (module === 'Autoconfiguration-1' && autoConf !== AutoModuleStatus.AUTO_UNDEF) setAutoConfState(autoConf)
  if (module === 'Autoconfiguration-1') totalActive = (autoConfState === AutoModuleStatus.AUTO_ON ? 1 : 0);

  const totalModules = subModules[key].length;

  useGraphQl('setModuleState', {
    isLive: false,
    isMutation: true,
    running: state[module],
    isTesting: props.isTesting, 
    name: module.toLowerCase().substring(0, module.toLowerCase().indexOf('-')),
  });

  useGraphQl('setModuleExtraInfo', {
    isLive: false,
    isMutation: true,
    name: module.toLowerCase().substring(0, module.toLowerCase().indexOf('-')),
    extra_info: module.includes('Mitigation') ? (state[module] ? AutoModuleStatus.AUTO_ON : AutoModuleStatus.AUTO_OFF ) : (module === 'Autoconfiguration-1' ? autoConfState : ''),
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
                  totalActive > 0 || (module === 'Autoconfiguration-1' && autoConfState === AutoModuleStatus.AUTO_ON)
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
                      checked={isChecked()}
                      onChange={() => {
                        if (module === 'Autoconfiguration-1') {
                          if (autoConfState === AutoModuleStatus.AUTO_ON) {
                            totalActive = 0;
                            setAutoConfState(AutoModuleStatus.AUTO_OFF);
                          } else {
                            totalActive = 1;
                            setAutoConfState(AutoModuleStatus.AUTO_ON);
                          } 
                        } else {
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
