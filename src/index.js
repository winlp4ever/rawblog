import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';
import Post from './components/post/post';



function renderWeb() {
    ReactDOM.render(<Post postId={0}/>, document.getElementById('main'));
}
renderWeb();

if (module.hot) {
    module.hot.accept(
        [
            './components/post/post', 
        ], () => {
        renderWeb();
    });
    module.hot.accept();
}