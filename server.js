var log = require('debug')('chatapp:init'),
    express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    router = express.Router();

log('Loading init chat app');
require('./init')(app);

log('Loading socket handler');
require('./lib/sockets')(app, server);

log('Loading router');
require('./routes')(app);

app.use(router);


server.listen(app.get('port'), function() {
    log('Listening on port ' + app.get('port'));
});