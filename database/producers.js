var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "producers"

exports.getProducers = function (req,res) {

	mongodb.findAll(collection, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}


exports.getProducerByID = function (req,res) {

	var id = req.params.producer_id;

	mongodb.findByID(collection, id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
}

exports.updateProducerInfo = function (req,res) {

	let producer_id = req.body.producer_id
	let update = req.body.update

	console.log("Updating producer: " + producer_id)

	mongodb.update(collection, producer_id, update, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.createProducer = function (req,res) {

	let producer = req.body.producer

	console.log("Creating producer: " + producer.name)

	mongodb.insert(collection, producer, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}

exports.deleteProducer = function (req,res) {
	let id = req.body.id
    //let mongo_id = new mongo.ObjectID(id);

	console.log("Deleting producer: " + req.body.producer.name)

	mongodb.deleteByID(collection, id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send({});
		}
	});
}



