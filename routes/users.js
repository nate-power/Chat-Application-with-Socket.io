const express = require('express');
const userModel = require('../models/User');
const cookieParser = require("cookie-parser");
const app = express();
const path = require('path');

app.use(cookieParser());

app.get("/", (req, res) => {
    if (req.cookies.user) {
        res.sendFile(path.join(__dirname, '../public/homepage.html'))
    }
    else {
        res.sendFile(path.join(__dirname, '../public/auth/login.html'))
    }
    
})

app.get("/login", (req, res) => {
    // check if id stored exists
    if (req.cookies.user) {
        res.redirect("/");
    }
    else {
        res.sendFile(path.join(__dirname, '../public/auth/login.html'))
    }
})

app.get("/register", (req, res) => {
    if (req.cookies.user) {
        res.redirect("/");
    }
    else {
        res.sendFile(path.join(__dirname, '../public/auth/register.html'))
    }
})

app.post("/register", (req, res) => {
    userModel.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json({error: "Username is already taken"})
        }
        else {
            if (req.body.password != req.body.password2) {
                return res.status(400).json({error: "Passwords do not match"});
            }
            else {
                const newUser = new userModel({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: req.body.password,
                })
                try {
                    newUser.save((err) => {
                      if(err){
                        res.send(err)
                      }else{
                        res.redirect("/");
                      }
                    });
                } 
                catch (err) {
                    res.send(err);
                }
            }            
        }
    })
})

app.post("/login", async (req, res) => {
    await userModel.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            return res.status(400).json({error: "User not found"})
        }
        else {
            if (user.password !== req.body.password) {
                return res.status(400).json({error: "Invalid username or password"})
            }
            else {
                res.cookie('user', JSON.stringify({
                    id: user._id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname
                }))
                res.redirect("/")
            }
        }
    })
})

module.exports = app