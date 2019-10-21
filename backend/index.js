import express from "express";
// import cors from "cors";
import { tableData } from "./data/tableData";
import Nexmo from "nexmo";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
const fs = require('fs')  
const http=require('http')
const Path=require('path')
const app = express();
// require('dotenv').config();


const cors = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
};

app.use([express.json(), cors, bodyParser.urlencoded({ extended: false })]);
const nexmo = new Nexmo({
	apiKey: "2139d7a0",
	apiSecret: "NUtqL5aRDryHG9wK"
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
	console.log(process.env.USERNAME)
	return res.status(200).send({
		message: "YAY! Congratulations! Your first endpoint is working"
	});
});

app.get("/api/table", function(req, res) {
	res.status(200).send(tableData);
});

app.get("/file",function(req,res){
	// let url = 'https://drive.google.com/open?id=1vzK4YvK5LXyXzgvf5D1-vf2OP1QhEGpu'
	// let dest = Path.resolve(__dirname, 'lucian.xlsx')
	// var download = function(url, dest, cb) {
		const downloadPath=process.chdir('C:/Users/HP/Downloads')
		const pathUsed=require('path').basename(`${downloadPath}`);
		try {
			
			console.log(`New directory: ${process.cwd()}`);
		  } catch (err) {
			console.error(`chdir: ${err}`);
		  }
		  console.log(Path.resolve(pathUsed, 'lucian.xlsx'))
		var file = fs.createWriteStream(Path.resolve(process.cwd(), 'lucian.xls'));
		var request = http.get('http://drive.google.com/open?id=1vzK4YvK5LXyXzgvf5D1-vf2OP1QhEGpu', function(response) {
		  response.pipe(file);
		  file.on('finish', function() {
			file.close();
			console.log("File download Success")
		  });
		  file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
				reject("File already exists");
				alert("Already Downloaded")
            } else {
                fs.unlink(Path.resolve(__dirname, 'lucian.xlsx'), () => {}); // Delete temp file
                reject(err.message);
            }
        })
		});
})

app.post("/api/form", (req, res) => {
	//res.send(bodyParser(req));
	//console.log(bodyParser(req));
	console.log("Alag sa identify",req.body)
	res.setHeader("Content-Type", "application/json");
	res.write("you posted:\n");
	res.end(JSON.stringify(req.body, null, 2));
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tanaymainkar25@gmail.com",
			pass: "tannu5934"
		}
	});
	const mailOptions = {
		from: "tanaymainkar25@gmail.com", // sender address
		to: req.body.email,
		cc:"", // list of receivers
		subject: "Registration successful", // Subject line
		html: `<div><h2>Lucian Paints Welcomes You..</h2> <br/>Details -  ${JSON.stringify(req.body)}</div>`
		
		// plain text body
	};
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) console.log(err);
		else console.log(info);
	});
});

app.listen(3002);
console.log("app running on port ", 3002);
