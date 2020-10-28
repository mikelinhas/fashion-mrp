const mongo = require('mongodb');
const mongodb = require('/database/mongo');
const fs = require("fs");
const collection = "production"


let orders_file = fs.readFileSync("scripts/orders.json");
let orders = JSON.parse(orders_file);


mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.insert(collection, orders, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log ("Orders were added to production collection.");
	    		process.exit()
	    	}
	    });	
	}
});
