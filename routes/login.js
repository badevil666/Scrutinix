var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('cookie-session');
var {credentials} = require('../config');
var dbClient = require('../db');

var app = express();

app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
    resave : false,
    saveUninitialized: false,
    secret : credentials.cookieSecret,
    key : "sessionID"
}));

var router = express.Router();

console.log("login.js loaded");
// Get login page

router.get('/', (req, res) => {
    console.log("im inside login.js");
    res.render('login', {title : 'Scrutinix Login Page'});
});

router.post('/', (req, res) => {
    const {username, password} = req.body;

    dbClient.connect().then(() => console.log("Connected to Postgresql")).catch(err => console.error("Connection error", err.stack));
    
    dbClient.query('select * from faculty where facultyid = $1 and facultypassword = $2', [username, password], (err, result) => {
        if(err)
        {
            console.log(result);
            console.log('inside error');
            res.send("Internal Server error. Sorry for the inconvinience." + err);
        }
        else
        {
            console.log('inside else');
            if(result.rows.length)
            {
                res.cookie('sessionID', 'extremely hard hash', {signed : true});
                res.send(`Welcome ${result.rows[0].facultyname} to scrutinix`);
            }
            else 
            {
                res.send('Sorry invalid credentials.');
            }
        }
    });
    

    //res.send(`hi ${req.body.username} your password is ${req.body.password}`);
});

module.exports = router;