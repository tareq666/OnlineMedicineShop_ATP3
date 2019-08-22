const express = require('express');
const Sequelize = require('sequelize');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const path = require('path');
const sess = require('express-session');
var cookieParser = require('cookie-parser');

 


const app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); 
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sess({secret: 'bmv', saveUninitialized: true,cookie: { maxAge: 8*60*60*1000 }, resave:true}));



const connection = new Sequelize('oms','root','',  {
    host: "127.0.0.1",
    dialect: "mysql",
    port: 3306,
    define: {
        paranoid: true
    }
});

const user = connection.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    username: {
        type: Sequelize.STRING
    },

    password: {
        type: Sequelize.STRING
    },


    type: {
        type: Sequelize.STRING
    }
});

const medicine = connection.define('medicine', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING
    },

    genre: {
        type: Sequelize.STRING
    },


    type: {
        type: Sequelize.STRING
    },

    vendor: {
        type: Sequelize.STRING
    },

    quantity: {
        type: Sequelize.INTEGER
    }


});

connection.sync();


connection.authenticate().then(function(){
    console.log("sucess");
  }).catch(function(error){
    console.log("error: "+error);
});

//var ssn = sess();
app.get('/', function (req, res) {

    res.render('login');

});

app.post('/', function (req, res) {
    sess.usr = req.body.username;
    sess.pss = req.body.password;
    //sess.save();
    //req.session.save();
    

    if(sess.usr !== null && sess.usr !== '' && sess.pss !== null && sess.pss !== ''){
            

        user.findOne({ attributes: ['type','id'], where: { username: sess.usr,password:sess.pss } }).then(ust => {
            sess.type = ust.get({ plain: true });
            sess.flag = sess.type['type'];
            sess.id = sess.type['id'];
            //sess.save();
            

            //res.send(sess.flag + ' ' + sess.id);
        });

        if(sess.flag === 'customer'){
            res.render('store');
        }
        
        else if(sess.flag === 'admin'){
            res.render('panel');
        }

        else{
            res.render('login');
        }
       
    }
    else{
        res.render('login');
    }

});

app.get('/Register', function (req, res) {

    res.render('reg');

});

app.post('/Register', function(req, res) {
    if(req.body.password === req.body.cpassword )
    {
        user.create({
            username:req.body.username,
            password:req.body.password,
            type:req.body.selectpicker
        });

        res.send('success');


    }
    else
    res.send('Failure');
});

// app.get('/Panel', function (req, res) {

    

//         if(sess.flag == 'admin'){
//             res.render('panel');
//         }
//         else if(sess.flag == 'customer'){
//             res.render('store');
//         }

//         else{
//             res.render('login');
//         }

// });

app.get('/Store', function (req, res) {

    console.log(sess.id);

});


app.listen(3000, function () {
    console.log('Running');
});