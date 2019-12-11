import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';
import ConnectionError from './connection-error/connection-error';
import Main from './main/main';
import io from 'socket.io-client';
import './behaviors';


function renderWeb() {
    ReactDOM.render(<Main />, document.getElementById('main'));
    ReactDOM.render(<ConnectionError />, document.getElementById('notifs'));
}
renderWeb();


if (module.hot) {
    console.log('what fuct');
    module.hot.accept(
        [
            './main/main', 
        ], () => {
            console.log('what merde');
            renderWeb();
        }
    );
    module.hot.accept();
}