//const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

var app = express();
app.use(favicon(path.join(__dirname, 'imgs', 'favicon.ico')));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const config = require('./webpack.config.js');

const options = {
    contentBase: './public',
    hot: true,
    host: 'localhost'
};

// webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
//const server = new webpackDevServer(compiler, options);
//compiler.outputFileSystem = fs;

var posts = {
    0: {
        id: 0,
        content: {
            title: 'an example',
            text: 'this is an example'
        },
        likes: 0,
        comments: [
            'Hey yo',
            'this is an example'
        ]
    }
}
var count = 0;

comments = ['oofoof']

app.use(
    middleware(compiler, options)
);

app.use(require('webpack-hot-middleware')(compiler));


io.on('connection', function(socket){
    count ++;
    console.log(`${count} user connected with id: ${socket.id}`);
    socket.on('disconnect', function(){
        count --;
        console.log(`1 user disconnected, rest ${count}`);
    });
    socket.on('comment history', postId => {
        console.log('request history ...');
        console.log(posts[postId].comments);
        socket.emit(`comment history postId=${postId}`, posts[postId].comments);
    })
    

    socket.on('submit comment', function(msg){
        posts[msg.postId].comments.push(msg.comment);
        console.log('message: ' + msg.comment);
        io.emit(`new comment postId=${msg.postId}`, msg.comment);
    });
});

app.get('/', (req, res, next) => {
    var filename = path.join(compiler.outputPath,'index');
    
    compiler.outputFileSystem.readFile(filename, async (err, data) => {
        if (err) {
            return next(err);
        }
        res.set('content-type','text/html');
        res.send(data);
        res.end();
    });
});

app.post('/get-post', (req, res) => {
    let postId = req.query.postId;
    res.json(posts[postId].content);
})

http.listen(5000, function(){
    console.log('listening on *:5000');
});

process.on('SIGINT', _ => {
    console.log('now you quit!');
    fs.writeFileSync(path.join(__dirname, 'posts.json'), JSON.stringify(posts));
    fs.writeFileSync(path.join(__dirname, 'comments.json'), JSON.stringify(comments));
    process.exit();
})