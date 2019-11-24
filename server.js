const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('trust proxy', true)

var rawUserData = fs.readFileSync('users.json');
var users = JSON.parse(rawUserData);

var schoolStatus = "Safe";

app.get('/', (req, res) => {
	res.redirect('/login')
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.get('/console', (req, res) => {
	res.render("console", {status: schoolStatus});
});

app.get('/ip', (req, res) => {
	var ip = req.ip;
	res.render("ip", {ip: ip});
});

const server = app.listen(80, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});