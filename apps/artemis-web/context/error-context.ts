import React from 'react';

const ErrorContext = React.createContext({
    error: "",
    setError: (error: any) => {
        // do nothing
    },
});

export default ErrorContext;
