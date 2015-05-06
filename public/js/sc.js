$(document).ready(function() {
    $('#usname').focus();

    $('#btnConnect').on('click', connectAndsendUser);

});

function connectAndsendUser() {
    var uname = $('#usname').val();
    if (uname !== '') {
        window.location.href = "http://localhost:7777/main";
    } else {
        alert('Pls enter your nick name!!!');
    }
}

function enterKey(e) {
    var uname = $('#usname').val();
    if (uname !== '') {
        if (e.which == 13) {
            window.location.href = "http://localhost:7777/main";
        }
    }

}