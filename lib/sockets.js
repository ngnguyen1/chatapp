var sio = require('socket.io');
require('colors');
var people = {};

module.exports = Sockets;

function Sockets(app, server) {

    var io = sio.listen(server, {
        transports: ['polling', 'websocket']
    });
    var crypto = require('crypto'),
        users = [];
    var client = app.get('redisClient');




    io.on('connection', function(socket) {


        var id = crypto.randomBytes(20).toString('hex');

        console.log('A new user connected - '.bgMagenta + id.bgMagenta);

        // Event to get all old messages from database
        socket.on('history:req', function() {
            loadHistoryMessage(socket);
        });


        socket.on('join', function(name) {

            var mess = name + ' has joined!';
            socket.broadcast.emit('new:user', mess);


            saveUser(id, name);


            socket.emit('welcome', {
                message: 'Welcome ' + name,
                id: id
            });


            getAllUser();


            socket.on('disconnect', function() {
                console.log(id.bgRed + ' disconnected'.bgRed);
                client.srem("users", name + ":" + id);
                io.sockets.emit('user:leave', {
                    name: name,
                    userId: id
                });
            });
        });

        socket.on('sendMess', function(data) {

            // If private send message -- comming soon =))
            if (data.toUser !== 'all') {
                users.forEach(function(user) {
                    if (user.id === data.toUser || user.id === data.idUser) {
                        user.socket.emit('receive', data);
                    }
                });
            } else {
                storeMessage(data);
                io.sockets.emit('receive', data);
            }
        });
    });



    var saveUser = function(id, name) {
        client.sadd("users", name + ":" + id);
    };

    // Method to save all message to redis db
    var storeMessage = function(data) {
        var message = JSON.stringify({
            name: data.username,
            data: data.message,
            timestamp: data.timestamp
        });

        client.lpush("messages", message, function(err, res) {
            client.ltrim("messages", 0, 10);
        });
    };

    // Load history message from redis database.
    var loadHistoryMessage = function(sc) {
        client.lrange("messages", 0, -1, function(err, messages) {
            messages = messages.reverse();
            messages.forEach(function(message) {
                message = JSON.parse(message);
                sc.emit('old:mess', {
                    mess: message.name + ": " + message.data,
                    timestamp: message.timestamp
                });
            });
        });
    };

    // Get all user from redis and broadcast to clients
    var getAllUser = function() {
        client.smembers("users", function(err, listuser) {
            io.sockets.emit('users', listuser.map(function(u) {
                return u;
            }));
        });
    };
};