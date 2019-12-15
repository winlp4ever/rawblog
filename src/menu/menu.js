import React, { Component } from 'react';
import './_menu.scss';

const Option = props => {
    return (
        <div>
            <button className='option'>
                <a href={props.url}>{props.name}</a>
            </button>
        </div>
    );
}

const Menu = props => {
    let links = [];
    for (const [i, link] of Object.entries(props.links)) {
        links.push(<Option key={i} url={link.url} name={link.name}/>);
    }
    return (
        <div className='menu'>
            {links}
        </div>
    )
}

export default Menu;