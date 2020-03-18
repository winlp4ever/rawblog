import React, { useState } from 'react';
import './_menu.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const Option = props => {
    let classN = 'option';
    if (props.isActive) classN += ' active';
    return (
        <div>
            <Link to={props.path}>
                <Button className={classN} onClick={_ => props.onClick()} startIcon={props.icon}>
                    {props.name}
                </Button>
            </Link>
        </div>
    );
}

const Menu = props => {
    let links = [];
    const [on, setOn] = useState(true);
    for (const [i, link] of Object.entries(props.links)) {
        links.push(<Option key={i} onClick={_ => props.onClick(i)} isActive={props.activeTab == i} {...link}/>);
    }
    return (
        <div className='menu'>
            {links}
        </div>
    )
}

export default Menu;