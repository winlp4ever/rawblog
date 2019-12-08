import Microlink from '@microlink/react';
import './_link-preview.scss';
import React, { Component } from 'react';

const LinkPreview = ({url}) => {
    return (
        <div className='link-preview'>
            <Microlink url={url} />
        </div>
    )
}

export default LinkPreview;