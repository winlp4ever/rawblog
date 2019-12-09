import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';
import Post from './post/post';
import './comment/_comment.scss';
import io from 'socket.io-client';


var socket = io();

function renderWeb() {
    ReactDOM.render(<Post postId={0} socket={socket}/>, document.getElementById('main'));
}
renderWeb();


if (module.hot) {
    console.log('what fuct');
    module.hot.accept(
        [
            './post/post', 
        ], () => {
            console.log('what merde');
            renderWeb();
        }
    );
    module.hot.accept();
}