import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  withStyles,
} from '@material-ui/core';
import { useGraphQl } from '../../utils/hooks/use-graphql';
import React, { Component, useEffect } from 'react';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#3f51b5',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: '#f50057',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

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
                    <IOSSwitch
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
