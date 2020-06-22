const mongo = require('mongodb');
const mongodb = require('../../database/mongo');
const fs = require("fs");
const collection = "stock";

//let bras_file = fs.readFileSync("bras.json");
//let bras = JSON.parse(bras_file);

//let briefs_file = fs.readFileSync("briefs.json");
//let briefs = JSON.parse(briefs_file);

//let additional_colors_file = fs.readFileSync("scripts/additional_colors.json");
//let additional_colors = JSON.parse(additional_colors_file);

//let socks_file = fs.readFileSync("scripts/socks.json");
//let socks = JSON.parse(socks_file);

//let bodies_file = fs.readFileSync("bodies.json");
//let bodies = JSON.parse(bodies_file);

//let men_file = fs.readFileSync("men.json");
//let men = JSON.parse(men_file);

//let swimwear_file = fs.readFileSync("scripts/swimwear.json");
//let swimwear = JSON.parse(swimwear_file);

let stock_file = fs.readFileSync("scripts/stock/stock.json");
let stock = JSON.parse(stock_file);

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")

	    //mongodb.insert(collection, briefs, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Briefs were added to stock collection.");
	    //	}
	    //});

	    //mongodb.insert(collection, bodies, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Bodies were added to stock collection.");
	    //	}
	    //});		

	    //mongodb.insert(collection, men, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Men's stuff was added to stock collection.");
	    //	}
	    //});	

	    //mongodb.insert(collection, bras, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Bras were added to stock collection.");
	    //	}
	    //});

	    //mongodb.insert(collection, swimwear, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Swimwear were added to stock collection.");
	    //	}
	    //});	

	    //mongodb.insert(collection, additional_colors, function (err, result) {
	    //	if (err) {
	    //		console.log (err);
	    //		res.status(500).send({});
	    //	} else {
	    //		console.log(result);
	    //		console.log ("Additional_colors were added to stock collection.");
	    //	}
	    //});

	    mongodb.insert(collection, stock, function (err, result) {
	    	if (err) {
	    		console.log (err);
	    		res.status(500).send({});
	    	} else {
	    		console.log(result);
	    		console.log ("Stock was were added to stock collection.");
	    	}
	    });

	}
});
