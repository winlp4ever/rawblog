import React, {Component} from "react";
import ReactDOM from "react-dom";
//import '../node_modules/socket.io-client/dist/socket.io';

import "./_common.scss";
import $ from 'jquery';

//var socket = io();
$(function () {
    var socket = io();
    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');                    
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        console.log(msg);
    });
});

if (module.hot) {
    module.hot.accept();
}