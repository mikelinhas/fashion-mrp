var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "warehouses"
const collectionPurchasing = "purchasing.warehouses"

exports.getReceivedFromOrder = function (req,res) {

	var purchase_number = req.params.purchase_number;

	var params = {"purchase_number": purchase_number}

	mongodb.find(collectionPurchasing, params, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.startReceivedInWarehouse = function (req,res) {

	var warehouse_object = req.body.warehouse_object;

	mongodb.insert(collectionPurchasing, warehouse_object, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.updateWarehouse_PurchaseReceived = function (req,res) {

	var purchase_number = req.body.purchase_number
	var warehouse = req.body.warehouse
	warehouse["_id"] = warehouse.id
	let warehouse_id = warehouse.id
	var item = req.body.item
	let difference = item.received - item.previous_received
	let material_id = new mongo.ObjectID(item.material_id)


	if (item.received == item.previous_received) {
     	res.status(200).send('order was not changed... it was the same!')
	} else {
	 	mongodb.updateWarehouse_PurchaseReceived(purchase_number, warehouse_id, item, function (err,result) {
			if (err){
				console.log(err);
				res.status(500).send({});
			} else {
				mongodb.updateWarehouse_modifyPurchase(purchase_number, item, function (err, result){
					if (err) {
						console.log(err)
					} else {
						console.log("updated " + purchase_number + " total received.")
					}
				})
				mongodb.updateWarehouse_modifyStock(warehouse, material_id, difference, function (err, result) {
				 	if (err){
				 		console.log(err);
				 		console.log("There was an error updating stock but not updating order");
						res.status(500).send({});
				 	} else {
				 		mongodb.logMaterialChange(purchase_number, warehouse, material_id, difference, function(err, result){
							res.status(200).send({});
				 		})
				 	}
				})
			}
		});
	}

}

exports.updateWarehouse_StockChange = function (req,res) {

	var warehouse = req.body.warehouse
	var item = req.body.item
	let difference = item.received - item.previous_received
	let id = new mongo.ObjectID(item.material_id)


	mongodb.updateWarehouse_modifyStock(warehouse, id, difference, function (err, result) {
	 	if (err){
	 		console.log(err);
	 		console.log("There was an error updating stock but not updating order");
			res.status(500).send({});
	 	} else {
	 		mongodb.logMaterialChange("Manually from producer", warehouse, item, difference, function(err, result){
				res.status(200).send({});
	 		})
	 	}
	})

}




