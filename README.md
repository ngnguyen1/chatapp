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
You can change the port or redis connect URL in file config.json that located at config/config.json
