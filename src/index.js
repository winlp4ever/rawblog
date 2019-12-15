import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./_common.scss";
import Main from './main/main';
import './behaviors';


function renderWeb() {
    ReactDOM.render(<Main />, document.getElementById('main'));
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