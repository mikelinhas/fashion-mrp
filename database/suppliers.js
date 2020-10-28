var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "suppliers"

exports.getSuppliers = function (req,res) {

	mongodb.findAll(collection, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getSuppliersWithMaterials = function (req,res) {

	mongodb.findSuppliersWithMaterials( function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getSuppliersWithMaterialsExceptProducer = function (req,res) {

	var producer_id = req.params.producer_id

	mongodb.findSuppliersWithMaterialsExceptProducer ( producer_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.getSupplierByID = function (req,res) {

	var id = req.params.supplier_id;

	mongodb.findByID(collection, id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.updateSupplierInfo = function (req,res) {

	let supplier_id = req.body.supplier_id
	let update = req.body.update

	console.log("Updating supplier: " + supplier_id)

	mongodb.update(collection, supplier_id, update, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.createSupplier = function (req,res) {

	let supplier = req.body.supplier

	console.log("Creating supplier: " + supplier.name)

	mongodb.insert(collection, supplier, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.deleteSupplier = function (req,res) {
	let id = req.body.id
    //let mongo_id = new mongo.ObjectID(id);

	console.log("Deleting supplier : " + req.body.supplier.name)

	mongodb.deleteByID(collection, id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}



