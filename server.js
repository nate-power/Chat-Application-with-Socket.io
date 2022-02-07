const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users.js');
const groupMessageRouter = require('./routes/group_messages.js');
const privateMessageRouter = require('./routes/private_messages.js');

const app = express();
app.use(express.json());


mongoose.connect('mongodb+srv://nate_power:Password-true7@fullstackdevelopmentcom.ucpu5.mongodb.net/f2022_comp3133_labtest1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.use(userRouter);
app.use(groupMessageRouter);
app.use(privateMessageRouter);

app.listen(3000, () => { console.log('Server is running...') });