const mongo = require('mongodb');
const mongodb = require('../database/mongo');
const fs = require("fs");

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    mongodb.lookupHistory(7435, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    	}
	    });	
	}
});
