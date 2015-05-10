## Chat app demo using Nodejs, socketIO and redis

### Requirement
- Nodejs(You can download at https://nodejs.org/ )
- [Redis](http://redis.io/)

### Install
-  Clone the project `git clone https://github.com/NgaNguyenDuy/chatapp.git`
-  Change to directory `chatapp` and install all dependencies (include main dependancies and dev dependencies) by type: `npm install`
-  Start redis server
-  Start chat server with command: `DEBUG=chatapp:init node server.js` and go to `http://localhost:7777` in your browser and enjoy.


### Config
You can change the port or redis connect URL in file config.json that located
at config/config.json

### Flow
All the processing logic are in two files: `lib/socket.js` for server side
and `public/js/main.js` for client side.

I used to `expressjs` module for web framework. See more at [Expressjs](http://expressjs.com/).

I also used to `socket.io` module for in interaction between client and server
side. See more at [socket.io](http://socket.io)


In server, you must install socket.io module and require it to your server
side. In client side, you must require `socket.io/socket.js`. In this case, i
have configured for `socket.io` and my server listen in same port. So you
don't enter the absolute path when client require `socket.io` library.


The first, i start application and the server(include websocket) will listen in a port (in this case
is 7777). When started, `socket.io` will listen a default event -
`connection`. So all clients side when connect to server, their will auto emit
event `connection`.


From now, the client and server side will communicate directly with each other
through events. To emit a event, use `.emit('event_name', 'data')`, to listen
a event, use `.on('event_name', callback)`. To broadcast, use
`.broadcast.emit('event_name', 'data')`. Broadcasting means sending a
message to everyone else except for the socket that starts it.


Events in application:
- `connection`: Default event of `socket.io`, will be fired when any client
connect.
- `disconnect`: Default event of `socket.io`, will be fired when any client
disconnect.
- `history:req`: The event will load old messages newest from redis database.
- `join`: The event will do something: broadcasting to clients that a new user
connected, get all user (except itself - that socket) list from redis
database, save user to database.
- `welcome`: The event will be emit a string welcome to client that connected.
- `sendMess`: The event will listen the messages that user has sent, then emit to
  all clients (include itself). In this event, we also save message to database.


Working with database - Redis: Redis is an open source, BSD licensed, advanced
key-value cache and store. See more at [Redis.io](http://redis.io)

You must require [redis](https://github.com/mranney/node_redis) module to
manipulating with Redis database.

In this application, i only manipulate with database when a new user
connected, user send new message. So here are some API:
- redisClient.sadd('users', user_name) will add a `user_name` to the key
`users`. It will ignored if `user_name` has exist in this key.
- redisClient.lpush('messages', messages, callback) will add all messages to
key `messages`.
- redisClient.ltrim('messages', start_point, end_point) will trim an existing
list that it will contain only elements in range from `start_point` to
`end_point`.
- redisClient.lrange('messages', start_offset, end_offset, callback) will get
  specified elements of key `messages`. The `start_offset` and `end_offset`
  are zero-based indexes, it means 0 being the first element of list (the head
  of list), 1 being the next element.
  The offsets can also be negative numbers indicating offsets starting at the
  end of list. For example, -1 is the last element of the list, -2 for
  penultimate and so on.
- redisClient.smembers('users', callback) will get all of key `users`.


### Some screenshots
![Screenshot1](https://github.com/NgaNguyenDuy/chatapp/blob/master/screenshots/2015-05-06-151424_1366x768_scrot.png)

![Screenshots2](https://github.com/NgaNguyenDuy/chatapp/blob/master/screenshots/2015-05-06-151544_1366x768_scrot.png)


### License 
MIT
