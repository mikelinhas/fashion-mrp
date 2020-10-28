/*
 * RENDER views.
 */


exports.login = function(req, res) {
	console.log(' ')
	console.log('session is: ' + req.sessionID)
	console.log(' ')
    res.render('views/login');
};

exports.purchasing = function(req, res) {
    res.render('views/purchasing');
};

exports.purchasing_pickSupplier = function(req, res) {
    res.render('views/purchasing_pickSupplier');
};

exports.purchasing_newOrder = function(req, res) {
    let supplier_id = req.params.supplier_id
    getSupplierName (supplier_id, function(err, result) {
        console.log(result)
        let initials = result.substring(0,3).toUpperCase()
        getNewPurchaseNumber (initials, supplier_id, function(err, result){
            if (err) {
                console.log(err)
            }
            var new_purchase_number = result
            res.render('views/purchasing_newOrder', {supplier_id: req.params.supplier_id, purchase_number: new_purchase_number});
        })
    })
};

exports.purchasing_Order = function(req, res) {
    console.log(req.params.purchase_number)
    res.render('views/purchasing_Order', {purchase_number:req.params.purchase_number});
};

exports.production = function(req, res) {
    res.render('views/production');
};

exports.production_pickProducer = function(req, res) {
    res.render('views/production_pickProducer');
};

exports.productionOrder = function(req, res) {
    console.log(req.params.order_number)
    res.render('views/productionOrder', {order_number:req.params.order_number});
};

exports.newOrder = function(req, res) {
    // from prouduction.js
    let producer_id = req.params.producer_id
    getProducerName (producer_id, function(err, result) {
        console.log(result)
        let initials = result.substring(0,3).toUpperCase()
        getNewOrderNumber (initials, producer_id, function(err, result){
            if (err) {
                console.log(err)
            }
            var new_order_number = result
            res.render('views/newOrder', {producer_id: req.params.producer_id, order_number: new_order_number});
        })
    })
    
};

exports.stock = function(req, res) {
    res.render('views/stock');
};

exports.stockID = function(req, res) {
    console.log(req.params.product_id)
    res.render('views/stockID', {product_id:req.params.product_id});
};

exports.data = function(req, res) {
    res.render('views/data');
};

exports.suppliers = function(req, res) {
    res.render('views/suppliers');
};

exports.supplierID = function(req, res) {
    res.render('views/supplierID', {supplier_id:req.params.supplier_id});
};

exports.producers = function(req, res) {
    res.render('views/producers');
};

exports.producerID = function(req, res) {
    res.render('views/producerID', {producer_id:req.params.producer_id});
};

exports.materialID = function(req, res) {
    console.log(req.params.material_id)
    res.render('views/materialID', {material_id:req.params.material_id, supplier_id: req.params.supplier_id});
};