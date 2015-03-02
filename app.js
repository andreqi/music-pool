var nodejsx = require('node-jsx').install();

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var app = require('./app/app');
var _ = require('lodash');
var config = require('./config');

var server = express();

var port = 1234;
var playlist = [];

server.listen(port);

server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json());

server.set('view engine', 'jade');

server.get('/view', function (req, res) {
    res.render('home', {
        playlist: playlist,
        props: JSON.stringify(
            playlist[0] || { url: '', duration: '' }
        ),
    });
});

server.get('/list', function (req, res) {
    res.render('list', { playlist: playlist });
});

server.post('/view', function (req, res) {
    console.log(req.body);
    playlist.shift();
    res.render('home', {
        playlist: playlist,
        props: JSON.stringify(
            playlist[0] || { url: '', duration: '' }
        ),
    });
});

server.get('/', function (req, res) {
    res.render('submit');
});


server.post('/', function (req, res) {
    console.log(req.body);
    if (req.body.video_url) {
        var url = req.body.video_url.trim();
        if (url) { 
            var matches = url.match(/.*v\=([^\s&]*)/);
            var id = matches[1];
            console.log(id);
            request.get('https://www.googleapis.com'+
                        '/youtube/v3/videos?'+
                        'part=snippet%2C+contentDetails&'+
                        'id='+id + '&key=' + config.API_KEY,
                        function (err, res, body) {
                var data = JSON.parse(body)
                               .items[0]
                               .contentDetails;
                var snippet = JSON.parse(body)
                               .items[0]
                               .snippet;
                playlist.push({
                    url: id,
                    title: snippet.title,
                    duration: data.duration,
                });
                console.log(data);
            });
        }
    }
    res.render('submit');
});


