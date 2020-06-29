const mongo = require('mongodb');
const mongodb = require('../database/mongo');
const fs = require("fs");
const passwordHash = require('password-hash');

var hashed_password = passwordHash.generate('aaa');
//var hashed_password_trini = passwordHash.generate('---')

var users = [
				//{"_id": "1", "user": "ana", "password": hashed_password},
				//{"_id": "2", "user": "clara", "password": hashed_password},
				//{"_id": "3", "user": "sara", "password": hashed_password},
				//{"_id": "4", "user": "almudena", "password": hashed_password}
		    ]

//For protection purposes
//process.exit()

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")


		mongodb.insertUsersFromScript(users, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log ("users were added to DB");
	    		process.exit()
	    	}
	    });	
	}
});