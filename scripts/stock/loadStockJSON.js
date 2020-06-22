const mongo = require('mongodb');
const mongodb = require('../../database/mongo');
const fs = require("fs");
const collection = "stock";

let stock_file = fs.readFileSync("scripts/stock/stock.json");
let stock = JSON.parse(stock_file);

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

		stock.forEach( function(item){
			item._id = mongo.ObjectID(item._id)
		    
		    mongodb.insert(collection, item, function (err, result) {
		    	if (err) {
		    		console.log (err);
		    		res.status(500).send({});
		    	} else {
		    		console.log(result);
		    		//console.log ("Item was were added to stock collection.");
		    	}
		    });
			
		})

	}
});
