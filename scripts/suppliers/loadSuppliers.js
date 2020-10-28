const mongo = require('mongodb');
const mongodb = require('/database/mongo');
const fs = require("fs");
const collection = "suppliers"

let suppliers_file = fs.readFileSync("scripts/suppliers.json");
let suppliers = JSON.parse(suppliers_file);

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.insert(collection, suppliers, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("Suppliers were added to supplier collection.");
	    	}
	    });

	}
});
