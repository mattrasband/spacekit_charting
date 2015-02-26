var bodyParser = require('body-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    helmet = require('helmet'),
    http = require('http'),
    path = require('path'),
    socketio = require('socket.io'),
    _ = require('lodash-node');

var app = express(),
    server = http.Server(app),
    io = socketio(server),
    port = process.env.PORT || 3000,
    ip = process.env.IP || '127.0.0.1';

var serial = require('./lib/serial');

serial.connect('/dev/tty.usbmodem1421', 9600)
    .then(function(conn) {
        conn.on('data', function(line) {
            if (!line || line.length === 0) {
                return;
            }

            line = line.trim();

            var tokens = line.split(',');
            if (tokens.length < 3) {
                return;
            }

            io.emit('sensorReport', _.zipObject(['uv', 'tmp102', 'tmpIR'], tokens));
        });
    })
    .catch(function(err) {
        console.error('Error establishing serial connection:', err);
        process.exit(1);
    });

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client')));
//app.use(favicon(path.join(__dirname, '../client/images/favicon.ico')));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

server.listen(port, ip, function() {
    console.info('Listening on ' + ip + ':' + port);
});
