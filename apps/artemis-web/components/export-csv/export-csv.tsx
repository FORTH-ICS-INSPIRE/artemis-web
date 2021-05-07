import { useStyles } from "../../utils/styles";
import React from "react";
import { Button } from "@material-ui/core";

const ExportCSV = (props) => {
    const _csrf = props._csrf;
    const action = props.action;

    const handleClick = async () => {
        const res = await fetch('/api/download_tables', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: action, _csrf: _csrf }),
        });
        const x = window.open();
        x.document.open();
        x.document.write(
            '<html><body><pre>' +
            JSON.stringify(await res.json(), null, '\t') +
            '</pre></body></html>'
        );
        x.document.close();
    };

    const classes = useStyles();

    return (
        <div style={{ display: 'inline' }}>
            <Button
                style={{ float: 'left', marginBottom: '10px', width: "192px" }}
                variant="contained"
                className={classes.button}
                onClick={handleClick}
            >
                Download Table
            </Button>
        </div>
    );
};

export default ExportCSV