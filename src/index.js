import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';

import Comment from './components/comment/comment';

ReactDOM.render(<Comment postId={0}/>, document.getElementById('comment'));

if (module.hot) {
    module.hot.accept();
}