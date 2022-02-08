const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/users.js');
const groupMessageRouter = require('./routes/group_messages.js');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))


mongoose.connect('mongodb+srv://nate_power:Password-true7@fullstackdevelopmentcom.ucpu5.mongodb.net/f2022_comp3133_labtest1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});


const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {

    socket.on('joinRoom', (room) => {
        socket.join(room)
        //listen for chat message
        socket.on('chatMessage', (message) => {
            io.to(room).emit('message', message)
        })
        socket.on('privateMessage', (message) => {
          io.to(room).to(message.room).emit('message', message)
        })
        socket.on('typing', (message) => {
            socket.to(room).emit('typingMessage', message)
        })
    })
})

app.use(userRouter);
app.use(groupMessageRouter);

http.listen(3000, () => { console.log('Server is running...') });