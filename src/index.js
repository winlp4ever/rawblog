import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';
import Post from './components/post/post';
import LinkPrevew from './components/link-preview/link-preview';

function renderWeb() {
    ReactDOM.render(<Post postId={0}/>, document.getElementById('main'));
}
renderWeb();

if (module.hot) {
    module.hot.accept(
        [
            './components/post/post', 
            './components/link-preview/link-preview'
        ], () => {
        renderWeb();
    });
    module.hot.accept();
}