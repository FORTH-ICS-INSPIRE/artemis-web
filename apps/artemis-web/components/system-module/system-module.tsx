import { Button, FormControlLabel, FormGroup, Grid } from '@material-ui/core';
import { AntSwitch, useStyles } from '../../utils/styles';
import React, { useState } from 'react';
import { useGraphQl } from '../../utils/hooks/use-graphql';

const SystemModule = (props) => {
  const { module, modulesStateObj, labels, subModules } = props;
  const [state, setState] = useState(modulesStateObj);

  const key = module.substring(0, module.indexOf('-')).toLowerCase();
  let totalActive = 0;
  subModules[key].forEach((module) => (totalActive += module[1] ? 1 : 0));
  const totalModules = subModules[key].length;

  useGraphQl('setModuleState', {
    isLive: false,
    isMutation: true,
    running: state[module],
    name: module.toLowerCase().substring(0, module.toLowerCase().indexOf('-')),
  });

  const classes = useStyles();

  return (
    <Grid item xs={3}>
      <div className="">
        <div className="shadow-lg px-4 py-6 w-full bg-white dark:bg-gray-700 relative">
          <p className="text-xl text-gray-700 dark:text-white font-bold">
            {labels[key]}
          </p>
          <p className="text-gray-400 text-sm mt-4">
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
          </p>
        </div>
      </div>
    </Grid>
  );
};

export default SystemModule;
