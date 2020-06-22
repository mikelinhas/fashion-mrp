const mongo = require('mongodb');
const mongodb = require('/database/mongo');
const fs = require("fs");
const collection = "purchasing"

let po_file = fs.readFileSync("scripts/purchasing/purchase_order.json");
let purchase_order = JSON.parse(po_file);

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.insert(collection, purchase_order, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("Purchasing orders were added to purchasing collection.");
	    	}
	    });

	}
});
