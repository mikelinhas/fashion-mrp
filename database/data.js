var mongodb = require('./mongo')
var stockCollection = "stock"
var productionCollection = "production"
var Json2csvParser = require('json2csv').Parser

const parser = new Json2csvParser()


// GET
	
	exports.getStockCSV = function (req,res) {

		mongodb.findAll("stock", function (err,result) {
			if (err){
				console.log(err);
				res.status(500).send({});
			} else {
				csv = parser.parse(result)
				res.status(200).send(new Buffer(csv));
			}
		});
	}

	exports.getProductionCSV = function (req,res) {
		mongodb.findAll("production", function (err,result) {
			if (err){
				console.log(err);
				res.status(500).send({});
			} else {
				csv = parser.parse(result)
				res.status(200).send(new Buffer(csv));
			}
		});
	}
