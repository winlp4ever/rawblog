import Microlink from '@microlink/react';
import './_link-preview.scss';
import React, { Component } from 'react';

class LinkPreview extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(newProps) {
        return JSON.stringify(newProps.url) != JSON.stringify(this.props.url);
    }

    render() {
        if (this.props.url) {
            try {
                return (<div className='link-preview'><Microlink url={this.props.url} /></div>);
            } catch (err) {
                return (<div></div>)
            }
        } 
        return (<div></div>)
    }
}

export default LinkPreview;