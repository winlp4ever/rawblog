import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./_common.scss";
import Editor from './editor/editor';
import './behaviors';


function renderWeb() {
    ReactDOM.render(<Editor />, document.getElementById('main'));
}
renderWeb();


if (module.hot) {
    console.log('what fuct');
    module.hot.accept(
        [
            './editor/editor', 
        ], () => {
            console.log('what merde');
            renderWeb();
        }
    );
    module.hot.accept();
}