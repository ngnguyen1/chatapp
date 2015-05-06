var log = require('debug')('chatapp:init'),
    express = require('express'),
    bodyParser = require('body-parser'),
    redis = require('redis'),
    expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession),
    path = require('path'),
    url = require('url'),
    config = {};

module.exports = Init;

function Init(app) {
    log("Load from config.json");
    try {
        config = require('./config/config.json');
        log('loaded config json file');
    } catch (err) {
        log('Failed to load ' + err);
    }

    log('Setting view engine as %s', 'jade');
    app.set('view engine', 'jade');

    log('Parse application/x-www-form-urlencoded');
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    log('Parse application/json');
    app.use(bodyParser.json());

    log('Views directory as views/themes/defaul');
    app.set('views', __dirname + '/views/themes/default');

    log('Set static folder');
    app.use(express.static('public'));

    log('Save configuration values in app %j', config);
    app.set('config', config);

    log('Setting port as %d', config.app.port);
    app.set('port', config.app.port);

    log('Setting redisURL', config.redisURL);
    app.set('redisURL', config.redisURL);

    log('Opening a redis client connection');
    var rdConfig = url.parse(config.redisURL);
    var redisClient = redis.createClient(rdConfig.port, rdConfig.hostname);

    redisClient
        .on('error', function(err) {
            log('Error connecting to redis %j', err);
        }).on('connect', function() {
            log('Connected to redis.');
        }).on('ready', function() {
            log('Redis client ready.');
        });


    log('Saving redisClient connection in app');
    app.set('redisClient', redisClient);

    log('Creating and saving a session store instance with redis client.');
    app.set('sessionStore', new RedisStore({
        client: redisClient
    }));

    log('Use of express session middleware.');
    app.use(expressSession({
        secret: config.session.secret,
        store: app.get('redisClient'),
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
    }));
}