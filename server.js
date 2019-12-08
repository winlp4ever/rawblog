//const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const http = require('http');

var app = express();
app.use(favicon(path.join(__dirname, 'imgs', 'favicon.ico')));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const config = require('./webpack.config.js');

const options = {
    //contentBase: './public',
    //hot: true,
    //host: 'localhost',
    proxy: { '*': 'http://localhost:5000' }
};

// webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
//const server = new webpackDevServer(compiler, options);
//compiler.outputFileSystem = fs;

const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});

var posts = {
    0: {
        id: 0,
        content: {
            title: 'an example',
            text: '<h1>example</h1>\n<p>this is an example</p>'
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
    

    socket.on('submit comment', msg => {
        posts[msg.postId].comments.push(msg.comment);
        console.log('message: ' + msg.comment);
        io.emit(`new comment postId=${msg.postId}`, msg.comment);
    });
    socket.on('likes', id => {
        posts[id].likes ++;
        console.log(posts[id]);
    })
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
    res.json({ content: posts[postId].content, likes: posts[postId].likes });
})

process.on('SIGINT', _ => {
    console.log('now you quit!');
    process.exit();
})