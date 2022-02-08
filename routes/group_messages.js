const express = require('express');
const groupMessageModel = require('../models/GroupMessage');
const cookieParser = require("cookie-parser");
const app = express();
const path = require('path');

app.get("/room", (req, res) => {
    if (req.cookies.user) {
        res.sendFile(path.join(__dirname, '../public/room.html'))
    }
    else {
        res.sendFile(path.join(__dirname, '../public/auth/login.html'))
    }
    
})

app.get("/get-messages/:room", async (req, res) => {
    try {
        const messageList = await groupMessageModel.find({room: req.params.room})
        return res.status(200).send(messageList);
    } 
    catch (error) {
        return res.status(500).send(error);
    }

    
})

app.post("/send-group-message", (req, res) => {
    const message = new groupMessageModel(req.body)
    try {
        message.save()
    }
    catch (error) {
        res.status(500).send(err)
    }
})

module.exports = app