import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./_common.scss";
import App from './app/app';
import './behaviors';


function renderWeb() {
    ReactDOM.render(<App />, document.getElementById('main'));
}
renderWeb();


if (module.hot) {
    console.log('what fuct');
    module.hot.accept(
        [
            './app/app', 
        ], () => {
            console.log('what merde');
            renderWeb();
        }
    );
    module.hot.accept();
}