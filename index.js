const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http'),
    cors = require('cors'),
    path = require('path'),
    api = require('./routes/api');

const db = require('./bin/db');

app.use(cors());        // in order to pass access control check: No 'Access-Control-Allow-Origin' header


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname + '/dist')));

// Set our api routes
app.use('/api', api);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const server = http.createServer(app);

server.listen(process.env.PORT || '3000', function () {
    const port = server.address().port;
    console.log('Server listening on port %s.', port);
});