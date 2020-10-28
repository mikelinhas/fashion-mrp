var mongodb = require('./mongo')
var mongo  = require("mongodb");
const collection = "production"
var stockCollection = "stock"
var producersCollection = "producers"

//Este se usa directamente en views (no a traves de Express)
getNewOrderNumber = function (producer_initials, producer_id, cb) {
	mongodb.findProducerOrders(producer_id, function (err,result) {
		if (err){
			console.log(err);
			cb(err)
		} else {
			let orders = result
			var highest = orders.reduce(function(highest, order) {
				let order_number = order.order_number
				let number = Number(order_number.substr(order_number.length - 4))
				if (number > highest) {
					return number
				}
			}, 0)

			var new_highest = highest + 1
			var num = ("000" + new_highest)
			var padded_number = num.substr(num.length - 4)
			let order_number = producer_initials + "-" + padded_number 
			cb(null, order_number);
		}
	});
}

//Este se usa directamente en views (no a traves de Express)
getProducerName = function (producer_id, cb) {
	mongodb.findByID( producersCollection, producer_id, function(err, result){
		if (err) {
			console.log(err)
			cb(err)
		} else {
			cb(null, result.name)
		}
	})
}

exports.processOrder = function (req,res) {
	let order = req.body.order
	mongodb.insert(collection, order, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({})
		} else {
			res.status(200).send(result)
		}
	});
}



exports.getProductionOrders = function (req,res) {

	mongodb.findAll(collection, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getProductionOrder = function (req,res) {
	order_number = req.params.order_number

	mongodb.findProductionOrder(order_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getProductionOrderDate = function (req,res) {
	order_number = req.params.order_number
	mongodb.findProductionOrderDate(order_number, function (err,date) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(date);
		}
	});
}

exports.updateOrder_Finished = function (req,res) {

	var order_number = req.body.order_number
	var product_id = req.body.product_id
	var mongod_id = new mongo.ObjectId(req.body.product_id)
	var difference = req.body.difference
	console.log(difference)

	mongodb.updateOrder_Finished(order_number, product_id, difference, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			 mongodb.updateOrder_Finished_modifyStock(order_number, mongod_id, difference, function (err, result) {
			 	if (err){
			 		console.log(err);
			 		console.log("There was an error updating stock but not updating order");
			 	} else {
			 		mongodb.logStockChange(order_number, mongod_id, difference, function(err, result){
			 			if (err) {
			 				console.log(err)
			 			} else {
			 				res.status(200).send({})
			 			}
			 		})
			 	}
			 })
		}
	});
}

exports.updateOrder_Ordered = function (req,res) {

	var order_number = req.body.order_number
	var product_id = req.body.product_id
	var difference = req.body.difference
	console.log(difference)

	mongodb.updateOrder_Ordered(order_number, product_id, difference, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.openOrder = function (req,res) {
	let order_number = req.body.order_number
	console.log("Opening: " + order_number)
	mongodb.openOrder(order_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});

}

exports.closeOrder = function (req,res) {
	let order_number = req.body.order_number
	console.log("Closing: " + order_number)
	mongodb.closeOrder(order_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});

}

exports.deleteOrder = function (req,res) {

	let order_number = req.body.order_number
	console.log("Deleting: " + order_number)

	mongodb.deleteOrder(order_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			console.log(result)
			res.status(200).send({});
		}
	});
}
