const mongo = require('mongodb');
const mongodb = require('../database/mongo');
const fs = require("fs");

let stock_file = fs.readFileSync("stock.json");
let stock = JSON.parse(stock_file);


mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

		for (var i = stock.length - 1; i >= 0; i--) {
			item = stock[i]
		    mongodb.updateStockfromScript(item, function (err, result) {
		    	if (err) {
		    		console.log (err);
		    		res.status(500).send({});
		    	} else {
		    		console.log ("item updated:  " + item.name + " " + item.color + " " + item.size);
		    	}
		    });	
		}
	}
});