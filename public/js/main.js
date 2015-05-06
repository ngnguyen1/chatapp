$(document).ready(function() {
    var socket = io();

    $('input.text').focus();

    var nickname,
        id = null;

    while(nickname == null || nickname == "") {
        nickname = prompt("Your name?");
    }
    
    $('.username').html(nickname || "Anonymous");

    var showMess = function(message, timestamp) {
        $('.chat').append(message + '<span id="timemess">' + '</span><br />');
        $('.chat').scrollTop = $('.chat').scrollHeight;
    };


    var serverNotice = function(message) {
        $('.chat').append('<b style="color: red;">Server</b>: ' + message + '<br />');
    };


    var sendMess = function(message, timestamp) {
        var usname = $('#usname').html();


        socket.emit('sendMess', {
            message: message,
            content: '<span style="color:#000">' + usname + ': ' + message + '</span>',
            username: usname,
            toUser: 'all',
            idUser: id,
            timestamp: timestamp
        });
    };

    socket.emit('history:req');

    if (nickname != null && nickname != "") {
        socket.emit('join', nickname);
    }

    socket.on('old:mess', function(data) {
        showMess(data.mess, data.timestamp);
    });


    socket.on('users', function(users) {

        var dtList = $('#people li').map(function() {
            return $(this).data("id");
        }).get();

        var name, id;
        users.forEach(function(user) {

            name = user.split(':')[0];
            id = user.split(':')[1];

            if (name != nickname && dtList.indexOf(id)) {
                $('#people').append('<li data-id="' + id + '">' + name + '</li>');
            }

        });
    });

    socket.on('new:user', function(message) {
        showMess(message);
    });


    socket.on('user:leave', function(data) {
        showMess(data.name + ' has leave conversion!!');

        var dtList = $('#people li').map(function() {

            if (data.userId == $(this).data("id")) {

                $(this).css("display", "none");
            }

        }).get();

    });

    socket.on('welcome', function(data) {
        id = data.id;
        showMess(data.message);
    });

    socket.on('receive', function(data) {
        showMess(data.content);
    });


    $('#input').keypress(function(e) {
        var inputText = $(this).val().trim();
        if (e.which === 13 && inputText) {

            // if (nickname == null || nickname == "") {
            //     nickname = prompt('What is your name?');
            // } else {
            //     $('.username').html(nickname);
            //     socket.emit('join', nickname);
            // }

            sendMess(inputText);
            $(this).val('');
            return false;
        }
    });

});
