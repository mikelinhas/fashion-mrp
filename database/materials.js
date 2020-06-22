var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "materials"


exports.getMaterialByID = function (req,res) {
	var id = req.params.material_id;
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

exports.getMaterialsFromSupplier = function (req,res) {

	var supplier_id = req.params.supplier_id;

	mongodb.getMaterialsFromSupplier(supplier_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getMaterialsAtProducer = function (req,res) {

	var producer_id = req.params.producer_id;

	console.log(producer_id)

	mongodb.getMaterialsAtProducer(producer_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.updateMaterialStock = function(req, res) {

	var material = req.body.material
	var warehouse = req.body.producer
	let warehouse_id = warehouse._id
	var material_id = new mongo.ObjectID(material._id)
	var difference = material.stock - material.previous_stock

	if (material.stock == material.previous_stock) {
    	res.status(200).send('stock was not changed... it was the same!')
	} else {
		mongodb.updateMaterialStock(material_id, warehouse_id, difference, function(err, result) {
			if (err) {
				res.status(500).send({err})
			} else {
		 		mongodb.logMaterialChange("Producers page", warehouse, material_id, difference, function(err, result){
					res.status(200).send({});
	 			})
			}
		})
	}

};

exports.updateMaterialInfo = function (req,res) {

	let material_id = req.body.material_id
	let mongo_id = new mongo.ObjectID(material_id)
	let update = req.body.update

	mongodb.update(collection, mongo_id, update, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}


exports.addNewWarehouseStock = function(req, res) {

	var material = req.body.material
	var material_id = new mongo.ObjectID(material._id)
	var warehouse = req.body.producer
	var stock = material.stock
	var difference = stock

	mongodb.addNewWarehouseStock(material_id, warehouse, stock, function(err, result) {
		if (err) {
			res.status(500).send({err})
		} else {
	 		mongodb.logMaterialChange("Producers page", warehouse, material_id, difference, function(err, result){
				res.status(200).send({});
	 		})
		}
	})

};

exports.createMaterialFromSupplier = function (req,res) {

	let supplier = req.body.supplier
	let material = req.body.material

	let new_material = {
		name: material.name,
		description: material.description,
		stock: [],
		measure_unit: material.measure_unit,
		supplier_id: supplier._id,
		supplier_name: supplier.name,
		external_ref: material.external_ref,
		unit_price: material.unit_price
	}



	console.log("Creating material: " + new_material.name)

	//mongodb.findByID("users", req.session.passport.user, function(err,result){
	//	console.log(result.user + " created the new product")
	//})

	mongodb.insert(collection, new_material, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			console.log(result)
			res.status(200).send({});
		}
	});
}


exports.deleteMaterial = function (req,res) {

	let id = req.body.material_id
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
