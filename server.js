var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser')




app.use(express.static(path.join(__dirname, "/static")));
app.use(bodyParser.urlencoded());

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var messages_array = [];
var users_array = [];
app.get('/', function(req, res) {
 res.render("index", {'messages': messages_array, 'users': users_array});
});

//Initiate the server & socket
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
}); 
var io = require('socket.io').listen(server)

// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function (socket) {
    console.log("WE ARE USING SOCKETS!");
    console.log(socket.id);

    //When a user enters the conversation board
    socket.on("user_joined", function (data){
        console.log('User joined: ' + data.name);
        users_array.push(data.name);
        io.emit('update_user_joined_board', {name: data.name});
   
    });

    //When a message is entered into the message board
    socket.on("message_entered", function (data){
        console.log('Message was submitted by: ' + data.name);
        messages_array.push({'name': data.name, 'message': data.message});
        io.emit('update_conversation_board', {name: data.name, message: data.message});
   
    });


});

