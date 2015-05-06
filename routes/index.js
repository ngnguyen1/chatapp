module.exports = myRoute;



function myRoute(app) {

    var client = app.get('redisClient');

    app.get('/main', function(req, res) {
        res.render('index');
    });



    app.get('/', function(req, res) {

        // console.log(client);

        // client.lpush("usernames", "NamNguyen", function(err, reply) {
        //     console.log(reply);
        // });

        // client.lrange("usernames", 0, -1, function(err, users) {
        //     console.log(users);

        // });

        res.render('main');

    });
};