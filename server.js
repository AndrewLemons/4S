const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
var  randomString = require("randomstring");

//Express
const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('trust proxy', true)

//Database
var db = mysql.createConnection({
	host: "localhost",
	user: "nodeServer",
	password: "password1234",
	database: "4S"
});

db.connect(function(err) {
	if (err) throw err;
});

//Requests
app.get('/', (req, res) => {
	res.redirect('/login')
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.post('/login', (req, res) => {
	db.query("SELECT * FROM users WHERE username = '"+ req.body.username +"'", function (err, users) {
		if (users.length > 0) {
			if (req.body.password == users[0].password) {
				var newKey = randomString.generate(32);
				console.log(users[0].userid);
				db.query("UPDATE users SET `activeKey` = '"+newKey+"' WHERE (`userid` = '"+users[0].userid+"')", function (err, result) {
					res.cookie("key", newKey);
					res.redirect("/console");
				});
			} else {
				res.status(403).send('Incorrect Password');
			}
		} else {
			res.status(403).send('Incorrect Username');
		}
	});
});

app.get('/console', (req, res) => {
	res.render("console", {status: "Safe"});
});

app.get('/info', (req, res) => {
	var ip = req.ip;
	var cookies = JSON.stringify(req.cookies);
	res.render("info", {ip: ip, cookies: cookies});
});

//Start listening
const server = app.listen(80, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});