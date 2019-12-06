//const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const utils = require('./server-utils/utils');

var app = express();
app.use(favicon(path.join(__dirname, 'imgs', 'favicon.ico')));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

app.use(
    middleware(compiler, options)
);

app.use(require('webpack-hot-middleware')(compiler));



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

app.listen(5000, 'localhost', () => {
    console.log('dev server listening on port 5000');
});

process.on('SIGINT', _ => {
    console.log('now you quit!');
    fs.writeFileSync(path.join(__dirname, 'posts.json'), JSON.stringify(posts));
    fs.writeFileSync(path.join(__dirname, 'comments.json'), JSON.stringify(comments));
    process.exit();
})