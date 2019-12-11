import Microlink from '@microlink/react';
import './_link-preview.scss';
import React, { Component } from 'react';

const LinkPreview = ({url}) => {
    if (url) {
        try {
            return (<div className='link-preview'><Microlink url={url} /></div>);
        } catch (err) {
            return (<div></div>)
        }
    } 
    return (<div></div>)
    
}

export default LinkPreview;