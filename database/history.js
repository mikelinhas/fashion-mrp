var mongo  = require("mongodb");
var mongodb = require('./mongo')


// GET

exports.getItemHistory = function (req,res) {
	var product_id = req.params.product_id;
	var mongo_id = new mongo.ObjectID(product_id);

	mongodb.findItemHistory(mongo_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
} 

exports.getMaterialHistory = function (req,res) {
	var id = req.params.material_id;

	mongodb.findMaterialHistory(id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result);
		}
	});
} 