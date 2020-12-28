import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from '@material-ui/core';
import { useGraphQl } from '../../utils/hooks/use-graphql';
import React, { Component, useEffect } from 'react';

const SystemModule = (props) => {
  const { module, state, setState } = props;

  useGraphQl('setModuleState', {
    isLive: false,
    isMutation: true,
    running: state[module],
    name: module.toLowerCase(),
  });

  return (
    <Grid item xs={4}>
      <div className="card">
        <div className="card-header"> {module} Module</div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3">
              <Button
                variant="contained"
                color={state[module] ? 'primary' : 'secondary'}
              >
                {state[module] ? 'Active (1/1)' : 'Active (0/1)'}
              </Button>
            </div>
            <div className="col-lg-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={state[module]}
                      onChange={() => {
                        setState((prevState) => ({
                          ...prevState,
                          [module]: !state[module],
                        }));
                      }}
                      size="medium"
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
