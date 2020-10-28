const mongo = require('mongodb');
const mongodb = require('/database/mongo');
const fs = require("fs");
const collection = "materials"

let materials_file = fs.readFileSync("scripts/materials.json");
let materials = JSON.parse(materials_file);

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.insert(collection, materials, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("Materials were added to materials collection.");
	    	}
	    });

	}
});
