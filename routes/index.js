//Routing files
var views = require('./views');
var stock = require('../database/stock');
var production = require('../database/production');
var data = require('../database/data');
var suppliers = require('../database/suppliers');
var producers = require('../database/producers');
var warehouses = require('../database/warehouses');
var purchasing = require('../database/purchasing');
var materials = require('../database/materials');
var boms = require('../database/boms');
var history = require('../database/history');
var auth = require('../authentication/auth');


module.exports = exports = function(app, db, passport) {

	const authenticated = auth.authenticated
	const administrator = auth.administrator

	/** VIEWS */
	
	app.get('/', function(req, res) {
		res.redirect('/stock')
	});
	
	// LOGIN STUFF
	app.post('/login', (req, res, next) => {

		passport.authenticate('local', (err, user, info) => {
			console.log(' ')
			console.log('--- Inside passport.authenticate() callback ---');
			console.log('user: ' +  user)
			console.log('req.session.passport: ' + JSON.stringify(req.session.passport))
			console.log('req.user: ' + JSON.stringify(req.user))
			console.log(' ')

			req.login(user, (err) => {
				console.log(' ')
				console.log('--- Inside req.login() callback ---')
				console.log('req.session.passport: ' + JSON.stringify(req.session.passport))
				console.log('req.user: ' + JSON.stringify(req.user))
				console.log('authenticated and logged in')
				console.log(' ')
				return res.redirect('/');
			})

		})(req, res, next);
	})

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/login');
	});


	// VIEWS
	app.get('/purchasing', authenticated, views.purchasing)
	app.get('/purchasing/new_order', authenticated, views.purchasing_pickSupplier)
	app.get('/purchasing/new_order/:supplier_id', authenticated, views.purchasing_newOrder)
	app.get('/purchasing/:purchase_number', authenticated, views.purchasing_Order)

	app.get('/suppliers', authenticated, views.suppliers)
	app.get('/suppliers/:supplier_id', authenticated, views.supplierID)
	app.get('/suppliers/:supplier_id/:material_id', authenticated, views.materialID)

	app.get('/production', authenticated, views.production)
	app.get('/production/new_order', authenticated, views.production_pickProducer)
	app.get('/production/new_order/:producer_id', authenticated, views.newOrder)
	app.get('/production/:order_number', authenticated, views.productionOrder)

	app.get('/producers', authenticated, views.producers)
	app.get('/producers/:producer_id', authenticated, views.producerID)

	app.get('/stock', authenticated, views.stock);
	app.get('/stock/:product_id', authenticated, views.stockID);
	app.get('/data', authenticated, views.data);
	app.get('/login', views.login);


	// DATABASE STOCK QUERYS
	app.get('/db/queryStockItems', authenticated, stock.getStockItems);
	app.get('/db/queryStockCategories', authenticated, stock.getStockCategories); 
	app.get('/db/queryStockSizes', authenticated, stock.getStockSizes); 
	app.post('/db/updateProductStock', authenticated, stock.updateProductStock);
	app.get('/db/queryProductByID/:product_id', authenticated, stock.getProductByID);
	app.post('/db/createProduct', authenticated, stock.createProduct);
	app.post('/db/deleteProduct', administrator, stock.deleteProduct);


	// DATABASE DATA QUERYS
	app.get('/db/getStockCSV', authenticated, data.getStockCSV);
	app.get('/db/getProductionCSV', authenticated, data.getProductionCSV);


	// DATABASE PRODUCTION QUERYS
	app.get('/db/queryProductionOrders', authenticated, production.getProductionOrders);
	app.get('/db/queryOrder/:order_number', authenticated, production.getProductionOrder);
	app.get('/db/queryOrderDate/:order_number', authenticated, production.getProductionOrderDate);
	app.post('/db/updateOrder_Finished', authenticated, production.updateOrder_Finished);
	app.post('/db/updateOrder_Ordered', authenticated, production.updateOrder_Ordered);
	app.post('/db/processOrder', authenticated, production.processOrder);
	app.post('/db/closeOrder', authenticated, production.closeOrder);
	app.post('/db/openOrder', authenticated, production.openOrder);
	app.post('/db/deleteOrder', administrator, production.deleteOrder);


	// DATABASE SUPPLIERS QUERYS
	app.get('/db/getSuppliers', authenticated, suppliers.getSuppliers);
	app.get('/db/querySuppliersWithMaterials', authenticated, suppliers.getSuppliersWithMaterials);
	app.get('/db/querySuppliersWithMaterialsExceptProducer/:producer_id', authenticated, suppliers.getSuppliersWithMaterialsExceptProducer);
	app.get('/db/querySupplierByID/:supplier_id', authenticated, suppliers.getSupplierByID);
	app.post('/db/updateSupplierInfo', authenticated, suppliers.updateSupplierInfo);
	app.post('/db/createSupplier', authenticated, suppliers.createSupplier);
	app.post('/db/deleteSupplier', administrator, suppliers.deleteSupplier);


	// DATABASE PRODUCERS QUERYS
	app.get('/db/getProducers', authenticated, producers.getProducers);
	app.post('/db/updateSupplierInfo', authenticated, producers.updateProducerInfo);
	app.post('/db/createProducer', authenticated, producers.createProducer);
	app.post('/db/deleteProducer', administrator, producers.deleteProducer);
	app.get('/db/queryProducerByID/:producer_id', authenticated, producers.getProducerByID);



	// DATABASE PRODUCERS.WAREHOUSES QUERYS
	app.get('/db/queryReceivedFromOrder/:purchase_number', authenticated, warehouses.getReceivedFromOrder);
	app.post('/db/startReceivedInWarehouse', authenticated, warehouses.startReceivedInWarehouse);
	app.post('/db/updateWarehouse_PurchaseReceived', authenticated, warehouses.updateWarehouse_PurchaseReceived);



	// DATABASE PURCHASING QUERYS
	app.get('/db/queryPurchaseOrders', authenticated, purchasing.getPurchaseOrders);
	app.get('/db/queryPurchaseOrder/:purchase_number', authenticated, purchasing.getPurchaseOrder);
	app.post('/db/updatePurchaseOrder_Date', authenticated, purchasing.updatePurchaseOrder_Date);
	app.post('/db/updatePurchaseOrder_ItemPrice', authenticated, purchasing.updatePurchaseOrder_ItemPrice);
	app.post('/db/updatePurchaseOrder_Ordered', authenticated, purchasing.updatePurchaseOrder_Ordered);
	app.post('/db/processPurchaseOrder', authenticated, purchasing.processPurchaseOrder);
	app.post('/db/closePurchaseOrder', authenticated, purchasing.closePurchaseOrder);
	app.post('/db/openPurchaseOrder', authenticated, purchasing.openPurchaseOrder);
	app.post('/db/deletePurchaseOrder', administrator, purchasing.deletePurchaseOrder);


	// DATABASE MATERIALS QUERYS
	app.get('/db/queryMaterialByID/:material_id', authenticated, materials.getMaterialByID);
	app.get('/db/querySupplierStock/:supplier_id', authenticated, materials.getMaterialsFromSupplier);
	app.get('/db/queryProducerStock/:producer_id', authenticated, materials.getMaterialsAtProducer);
	app.post('/db/createMaterialFromSupplier', authenticated, materials.createMaterialFromSupplier);
	app.post('/db/updateMaterialStock', authenticated, materials.updateMaterialStock);
	app.post('/db/updateMaterialInfo', authenticated, materials.updateMaterialInfo);
	app.post('/db/addNewWarehouseStock', authenticated, materials.addNewWarehouseStock);
	app.post('/db/deleteMaterial', authenticated, materials.deleteMaterial);


	// Bill Of Material Stuff (MATERIALS)
	app.get('/db/queryBillOfMaterials/:product_id', authenticated, boms.queryBillOfMaterials);
	app.post('/db/addToBillOfMaterials', authenticated, boms.addToBillOfMaterials);
	app.post('/db/deleteFromBillOfMaterials', authenticated, boms.deleteFromBillOfMaterials);


	// DATABASE STOCK HISTORY QUERYS
	app.get('/db/queryItemHistory/:product_id', authenticated, history.getItemHistory);
	app.get('/db/queryMaterialHistory/:material_id', authenticated, history.getMaterialHistory);


}