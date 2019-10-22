"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import cors from "cors";
var fs = require('fs');
var http = require('http');
var Path = require('path');
var app = (0, _express2.default)();
require('dotenv').config();

var cors = function cors(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
};

app.use([_express2.default.json(), cors, _bodyParser2.default.urlencoded({ extended: false })]);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function (req, res) {
	console.log(process.env.USERNAME);
	return res.status(200).send({
		message: "YAY! Congratulations! Your first endpoint is working"
	});
});

app.post("/api/form", function (req, res) {
	//res.send(bodyParser(req));
	//console.log(bodyParser(req));
	console.log("Alag sa identify", req.body.email);
	res.setHeader("Content-Type", "application/json");
	res.write("you posted:\n");
	res.end(JSON.stringify(req.body, null, 2));
	var transporter = _nodemailer2.default.createTransport({
		service: "gmail",
		auth: {
			user: "a7.nasik@gmail.com",
			pass: "Avisha@1979"
		}
	});
	var mailOptions = {
		from: "a7.nasik@gmail.com", // sender address
		to: req.body.email,
		cc: "a7.nasik@gmail.com", // list of receivers
		subject: "Registration successful", // Subject line
		html: "<div><h2>Lucian Paints Welcomes You..</h2> <br/>Details -  " + JSON.stringify(req.body) + "</div>"

		// plain text body
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) console.log(err);else console.log(info);
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(_express2.default.static('frontend/build'));
	app.get('*', function (req, res) {
		res.sendFile(path.resolve(__dirname, "frontend/", "build", "index.html"));
	});
}

app.listen(3002);
console.log("app running on port ", 3002);