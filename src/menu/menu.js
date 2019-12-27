import React, { Component } from 'react';
import './_menu.scss';

const Option = props => {
    let classN = 'option';
    if (props.isActive) classN += ' active';
    return (
        <div>
            <button className={classN} onClick={_ => props.onClick()}>
                <a>{props.name}</a>
            </button>
        </div>
    );
}

const Menu = props => {
    let links = [];
    for (const [i, link] of Object.entries(props.links)) {
        links.push(<Option key={i} {...link} isActive={props.activeTab == i}/>);
    }
    return (
        <div className='menu'>
            {links}
        </div>
    )
}

export default Menu;