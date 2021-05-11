import { useStyles } from "../../utils/styles";
import React from "react";
import { Button } from "@material-ui/core";

const ExportJSON = (props) => {
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
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(await res.json(), 'data.json', 'text/json');
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

export default ExportJSON