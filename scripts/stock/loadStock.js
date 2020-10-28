const mongo = require('mongodb');
const mongodb = require('../../database/mongo');
const fs = require("fs");
const collection = "stock";

let pants_file = fs.readFileSync("scripts/stock/pants.json");
let pants = JSON.parse(pants_file);
pants.map(function(pant){
	let num = Math.floor(Math.random() * 50)
	pant.stock = num
})

let shirts_file = fs.readFileSync("scripts/stock/shirts.json");
let shirts = JSON.parse(shirts_file);
shirts.map(function(shirt){
	let num = Math.floor(Math.random() * 50)
	shirt.stock = num
})

let socks_file = fs.readFileSync("scripts/stock/socks.json");
let socks = JSON.parse(socks_file);
socks.map(function(sock){
	let num = Math.floor(Math.random() * 50)
	sock.stock = num
})

let trunks_file = fs.readFileSync("scripts/stock/trunks.json");
let trunks = JSON.parse(trunks_file);
trunks.map(function(trunk){
	let num = Math.floor(Math.random() * 50)
	trunk.stock = num
})

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.insert(collection, pants, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("Pants were added to stock collection.");
	    	}
	    });


	    mongodb.insert(collection, shirts, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("shirts were added to stock collection.");
	    	}
	    });


	    mongodb.insert(collection, socks, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("socks were added to stock collection.");
	    	}
	    });


	    mongodb.insert(collection, trunks, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("trunks were added to stock collection.");
	    	}
	    });

	}
});
