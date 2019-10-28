const express = require('express')
// import cors from "cors";
const bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
const fs = require('fs')
const http = require('http')
const path = require('path')
const app = express();
require('dotenv').config();


const cors = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
};

app.use([express.json(), cors, bodyParser.urlencoded({ extended: false })]);


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
	console.log(process.env.USERNAME)
	return res.status(200).send({
		message: "YAY! Congratulations! Your first endpoint is working"
	});
});


app.post("/api/form", (req, res) => {
	//res.send(bodyParser(req));
	//console.log(bodyParser(req));
	console.log("Alag sa identify", req.body.email)
	res.setHeader("Content-Type", "application/json");
	res.write("you posted:\n");
	res.end(JSON.stringify(req.body, null, 2));
	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: "a7.nasik@gmail.com",
			pass: "Avisha@1979"
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
		}
	});
	const mailOptions = {
		from: "a7.nasik@gmail.com", // sender address
		to: req.body.email,
		cc: "a7.nasik@gmail.com", // list of receivers
		subject: "Registration successful", // Subject line
		html: `<div><h2>Lucian Paints Welcomes You..</h2> <br/>Details -  ${JSON.stringify(req.body)}</div>`

		// plain text body
	};
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) console.log(err);
		else console.log(info);
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static('Frontend/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "build", "index.html"))
	})
}

const port = process.env.PORT || 5000;
app.listen(port);
console.log("app running on port ", port);
