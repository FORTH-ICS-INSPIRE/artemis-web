import { useStyles } from '../../utils/styles';
import React from 'react';
import { Button } from '@material-ui/core';
import { ReactElement } from 'react';

function getExportCondition(exportFilters, dateField = 'timestamp', type = '') {
  if (
    exportFilters.hasDateFilter ||
    exportFilters.hasColumnFilter ||
    exportFilters.statusFilter ||
    exportFilters.key
  ) {
    let condition = `(`;
    if (exportFilters.hasDateFilter)
      condition =
        condition +
        `${dateField}.gte.${exportFilters.dateRange.dateFrom},${dateField}.lte.${exportFilters.dateRange.dateTo},`;
    if (exportFilters.hasColumnFilter) {
      Object.keys(exportFilters.columnFilter).forEach((column) => {
        const filterValue = exportFilters.columnFilter[column].filterVal;
        if (column.includes('original'))
          column = column.replace('_original', '');
        else if (column === 'as_path2') column = 'as_path';

        if (column === 'service') {
          condition = condition + `${column}.like.*${filterValue}*,`;
        } else if (column === 'type' && type === 'hijacks') {
          condition = condition + `${column}.like.*${filterValue}*,`;
        } else if (column !== 'as_path')
          condition =
            condition +
            `${column}.eq.${filterValue.replace(/ -> |-> | -> |->/gi, '|')},`;
      });
    }
    if (exportFilters.key)
      condition = condition + `hijack_key.cs.{${exportFilters.key}},`;
    if (exportFilters.hasStatusFilter) {
      condition = condition + `${exportFilters.statusFilter}`;
    }
    condition = condition + ')';
    return condition.replace(',)', ')');
  } else return '';
}

const ExportJSON = (props: any): ReactElement => {
  const _csrf = props._csrf;
  const action = props.action;
  const { exportFilters, dateField } = props;
  const conditions = getExportCondition(exportFilters, dateField);

  const handleClick = async () => {
    const res = await fetch('/api/download_tables', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        _csrf: _csrf,
        parameters: conditions && conditions.length > 2 ? conditions : null,
      }),
    });
    function download(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    const data = await res.json();
    download(JSON.stringify(data), 'data.json', 'text/json');
  };

  const classes = useStyles();

  return (
    <div style={{ display: 'inline' }}>
      <Button
        style={{ float: 'left', marginBottom: '10px', width: '192px' }}
        variant="contained"
        className={classes.button}
        onClick={handleClick}
      >
        Download Table
      </Button>
    </div>
  );
};

export default ExportJSON;
