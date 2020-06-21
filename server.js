const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
    
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    
    socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id); 
    messages.push(message);
    socket.broadcast.emit('message', message)
  });

    socket.on('join',(user) => {
        users.push({name: user, id: socket.id})
        socket.broadcast.emit('newUser', user);
    });
    
    socket.on('disconnect', () => { 
        let user = '';
        users = users.filter(userName => {
            if(userName.id === socket.id){
                user = userName.name;
            }; 
        });

    users = users.filter(userName => (userName.id !== socket.id));
    socket.broadcast.emit('removeUser', user);
    console.log('Oh, socket ' + socket.id + ' has left');
});

    console.log('I\'ve added a listener on message and disconnect events \n');
});