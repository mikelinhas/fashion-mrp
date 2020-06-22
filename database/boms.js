var mongo  = require("mongodb");
var mongodb = require('./mongo')
const collection = "boms"

exports.queryBillOfMaterials = function (req,res) {
	var id = req.params.product_id;
    let mongo_id = new mongo.ObjectID(id);

	mongodb.findBillOfMaterials(mongo_id, function (err,result) {
		if (err){
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result[0]);
		}
	});
}

exports.deleteFromBillOfMaterials = function (req,res) {

	var product_id = req.body.product_id
	let mongo_id = new mongo.ObjectID(product_id)
	var material_id = req.body.material_id

	mongodb.deleteMaterialFromBOM(mongo_id, material_id, function(err, result){
		if (err) {
			console.log(err);
			res.status(500).send({});
		} else {
			res.status(200).send(result)
		}
	})
}

exports.addToBillOfMaterials = function (req,res) {

	var product_id = req.body.product_id
	var material = req.body.material
	let mongo_id = new mongo.ObjectID(product_id)

	let bom = {
		"_id": mongo_id,
		"product_id": product_id,
		"materials": [material],
		"created_at": new Date(),
		"notes": ""
	}

	mongodb.findByID(collection, mongo_id, function(err, result){
		if (err) {
			console.log(err);
			res.status(500).send({});
		} else {
			if (result) {
				console.log("BOM exists... lets add material")
				mongodb.addMaterialToBOM(mongo_id, material, function (err, result){
					if (err) {
						console.log(err)
				 		res.status(500).send({});
					} else {
						res.status(200).send(result)
					}
				})

			} else {
				console.log("nothing yet... must create BOM")	
				 mongodb.insert(collection, bom, function (err,result) {
				 	if (err){
				 		console.log(err);
				 		res.status(500).send({});
				 	} else {
				 		res.status(200).send(result);
				 	}
				 });
			}
		}
	})
}