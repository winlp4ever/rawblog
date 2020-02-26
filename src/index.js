import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./_common.scss";
import App from './app/app';
import './behaviors';
import $ from 'jquery';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

var lastScrollTop = $(window).scrollTop();

$(window).on({
    scroll: (e) => {
        let n = $(window).scrollTop();
        if (n == 0) $('.menu').attr('class', 'menu init');
        else if (n - lastScrollTop < -25) $('.menu').attr('class', 'menu display');
        else if (n - lastScrollTop > 0) $('.menu').attr('class', 'menu hide');
        lastScrollTop = n; 
    }
})


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