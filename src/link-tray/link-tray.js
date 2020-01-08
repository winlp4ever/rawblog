import React, { Component } from 'react';
import './_link-tray.scss';

export default class LinkTray extends Component {
    state = {
        links: [
            {name: 'facebook', url: 'https://facebook.com', a_tag: <i className="fab fa-facebook-f fa-fw"></i>},
            {name: 'linkedin', url: 'https://linkedin.com', a_tag: <i className="fab fa-linkedin-in fa-fw"></i>},
            {name: 'instagram', url: 'https://instagram.com', a_tag: <i className="fab fa-instagram fa-fw"></i>}
        ]
    }

    render() {
        return (
            <div className='link-tray'>
                <div className='link'>
                    {this.state.links.map((e, id) => (
                        <a href={e.url} target='_blank' key={id}>{e.a_tag}</a>
                    ))}
                </div>
                <div className='tray'></div>
            </div>
        )
    }
}