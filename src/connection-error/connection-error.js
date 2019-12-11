import React, { Component } from 'react';
import './connection-error.scss';

const ConnectionError = _ => {
    return (
        <div className='connection-error'>
            <p>Connection lost ...</p>
        </div>
    )
};

export default ConnectionError;