import React, { Component, useState, useContext, useEffect } from 'react';

const NotifContext = React.createContext({notifs: [], updateNotifs: () => {}});

const Notif = (props) => {
    const Nos = useContext(NotifContext);
    const duration = 5;

    useEffect(() => {
        const interval = setInterval(() => Nos.updateNotifs(), duration* 1000);
        return function cleanup() {
            clearInterval(interval);
        }
    })

    return (
        <div className='notifs'>
            {Nos.notifs.map((n, id) => <span key={id}>{n}</span>)}
        </div>
    )
}

export default Notif;
export { NotifContext };


