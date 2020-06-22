var mongo  = require("mongodb");
var mongodb = require('./mongo')
var collection = "stock"
var productionCollection = "production"


// Note: time is an hour more in Spain

// GET
	
exports.getStockItems = function (req,res) {

	mongodb.findStock(function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getProductByID = function (req,res) {
	var id = req.params.product_id;
    let mongo_id = new mongo.ObjectID(id);

	mongodb.findByID(collection, mongo_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getStockCategories = function (req,res) {

	mongodb.findStockCategories(function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			let result_array = result.map(a => a.name)
			res.status(200).send(result_array);
		}
	});
}

exports.getStockSizes = function (req,res) {

	mongodb.findStockSizes(function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

// POST

exports.updateProductStock = function(req, res) {

	var product_id = req.body.product_id
	var mongo_id = new mongo.ObjectID(product_id)
	var difference = req.body.difference

	console.log(difference)

	mongodb.updateProductStock(mongo_id, difference, function(err, result) {
		if (err) {
			res.status(500).send({err})
		} else {
			mongodb.logStockChange("Stock page", mongo_id, difference, function(err, result){
    			res.status(200).send({})
			})
		}
	})

};


exports.createProduct = function (req,res) {

	let product = req.body.product

	var products_array = []
	product.colors.forEach(function(color){
		product.sizes.forEach(function(size){
	  		let new_product = {}
	  		new_product.name = product.name
	  		new_product.category = product.category
	  		new_product.stock = product.stock
	  		new_product.color = color
	    	new_product.size = size
	    	products_array.push(new_product)
		})
	})
	//console.log(products_array)

	console.log("Creating stock product: " + product.name)

	mongodb.findByID("users", req.session.passport.user, function(err,result){
		console.log(result.user + " created the new product")
	})

	mongodb.insert(collection, products_array, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			console.log(result)
			res.status(200).send({});
		}
	});
}


exports.deleteProduct = function (req,res) {

	let id = req.body.product_id
    let mongo_id = new mongo.ObjectID(id);

	console.log("Deleting stock item: " + id)

	mongodb.deleteByID(collection, mongo_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

