var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "purchasing"
const supplierCollection = "suppliers"

//Este se usa directamente en views (no a traves de Express)
getNewPurchaseNumber = function (supplier_initials, supplier_id, cb) {
	mongodb.findSupplierPurchases(supplier_id, function (err,result) {
		if (err){
			console.log(err);
			cb(err)
		} else {
			let orders = result
			var highest = orders.reduce(function(highest, order) {
				let purchase_number = order.purchase_number
				let number = Number(purchase_number.substr(purchase_number.length - 4))
				if (number > highest) {
					return number
				}
			}, 0)

			var new_highest = highest + 1
			var num = ("000" + new_highest)
			var padded_number = num.substr(num.length - 4)
			let purchase_number = supplier_initials + "-" + padded_number 
			cb(null, purchase_number);
		}
	});
}

//Este se usa directamente en views (no a traves de Express)
getSupplierName = function (supplier_id, cb) {
	mongodb.findByID( supplierCollection, supplier_id, function(err, result){
		if (err) {
			console.log(err)
			cb(err)
		} else {
			cb(null, result.name)
		}
	})
}

// IDEAS ...
exports.getSomePurchases = function (req,res) {
}

exports.getPurchaseOrder= function (req,res) {
	purchase_number = req.params.purchase_number
	mongodb.getPurchaseOrder(purchase_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.getPurchaseOrders = function (req,res) {

	mongodb.findAll(collection, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.updatePurchaseOrder_Date = function (req,res) {

	var purchase_number = req.body.purchase_number
	var delivery_date = req.body.delivery_date

	mongodb.updatePurchaseOrder_Date(purchase_number, delivery_date, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.updatePurchaseOrder_ItemPrice = function (req,res) {

	var purchase_number = req.body.purchase_number
	var difference = Number(req.body.item.unit_price) - Number(req.body.item.previous_price)
	var total_difference = difference*Number(req.body.item.ordered)
	var material_id = req.body.item.material_id

	mongodb.updatePurchaseOrder_ItemPrice(purchase_number, material_id, difference, total_difference, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.updatePurchaseOrder_Ordered = function (req,res) {

	var purchase_number = req.body.purchase_number
	var difference = Number(req.body.item.ordered) - Number(req.body.item.previous_ordered)
	var material_id = req.body.item.material_id
	var price_difference = Number(req.body.item.unit_price)*difference

	mongodb.updatePurchaseOrder_Ordered(purchase_number, material_id, difference, price_difference, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.processPurchaseOrder = function (req,res) {
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

exports.openPurchaseOrder = function (req,res) {
	let purchase_number = req.body.purchase_number
	console.log("Opening: " + purchase_number)
	mongodb.openPurchaseOrder(purchase_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});

}

exports.closePurchaseOrder = function (req,res) {
	let purchase_number = req.body.purchase_number
	console.log("Closing: " + purchase_number)
	mongodb.closePurchaseOrder(purchase_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});

}

exports.deletePurchaseOrder = function (req,res) {

	let purchase_number = req.body.purchase_number
	console.log("Deleting: " + purchase_number)

	mongodb.deletePurchaseOrder(purchase_number, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			mongodb.deletePurchaseOrderWarehouses(purchase_number, function(err, result){
				if (err) {
					console.log(err)
				} else {
					res.status(200).send({});
				}
			})
		}
	});
}

