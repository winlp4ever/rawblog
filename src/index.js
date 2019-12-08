import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';
//import io from 'socket.io';
import "./_common.scss";
import $ from 'jquery';
import Post from './post/post';
import './comment/_comment.scss';
import './test.scss';
import a from './test/test';

function renderWeb() {
    ReactDOM.render(<Post postId={0}/>, document.getElementById('main'));
    console.log(a);
}
renderWeb();

if (module.hot) {

    module.hot.accept(
        [
            './post/post', 
            './test/test'
        ], () => {
            console.log('what merde');
            renderWeb();
        }
    );
    module.hot.accept();
}