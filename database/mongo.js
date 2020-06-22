var mongo  = require("mongodb");
var MongoClient = mongo.MongoClient;
require('dotenv').config();
var db;

if (process.env.NODE_ENV === 'development') {
    console.log("Using local DB")
    var DB_URL = process.env.DB_URL_DEV
}

if (process.env.NODE_ENV === 'production') {
    console.log("\x1b[33m", "Caution: Using production DB", "\x1b[30m")
    var DB_URL = process.env.DB_URL_PROD
}

// CONNECTION to DATABASE
exports.init = function(cb){
        //db.open(cb);
        console.log("Connecting to MongoDB...");
        MongoClient.connect(DB_URL, 
            // {server: {
            //     auto_reconnect: true,
            //     socketOptions: {
            //         connectTimeoutMS: 3000,
            //         socketTimeoutMS:  3000,
            //         keepAlive:        3000
            //     }
            // }}, 
            function(err, dbinstance) {
                if (err){
                    //log(err);
                    cb(err,0);
                } else {
                    db = dbinstance;
                    cb(0,dbinstance);
                }
        });
};


/** 
 * AUTHENTICATION 
 */

exports.findUser = function(username, cb){
    db.collection("users", function(err, collection) {
        collection.findOne({"user": username}, cb)
    })
};

exports.findUserById = function(id, cb){
    db.collection("users", function(err, collection) {
        collection.findOne({"_id": id}, cb)
    })
};

// INSERT: Inserts users coming from the script function
exports.insertUsersFromScript = function(data, cb){
    db.collection("users", function(err, collection) {
        collection.insert(data, cb)
    })
}


/** 
 * GENERAL 
 */

exports.findAll = function(collection, cb) {
    db.collection(collection, function(err,collection) {
        collection.find({},{}).toArray(cb);
    })
}

exports.findByID = function(collection, id, cb) {
    db.collection(collection, function(err,collection) {
        collection.findOne({"_id": id}, cb);
    })
}

exports.find = function(collection, params, cb) {
    db.collection(collection, function(err, collection) {
        collection.find(params,{}).toArray(cb)
    })
}

exports.insert = function(collection, data, cb) {
    db.collection(collection, function(err, collection) {
        collection.insert(data, cb)
    })
}

exports.update = function(collection, id, params, cb) {
    db.collection(collection, function(err, collection) {
        collection.update({"_id": id}, {$set: params}, {}, cb)
    })
}

exports.deleteByID = function(collection, id, cb) {
    db.collection(collection, function(err, collection) {
        collection.deleteOne({"_id": id}, cb)
    })
}

/** 
 * PRODUCTION 
 */

// QUERY: get orders to producer
exports.findProducerOrders = function(id, cb) {
    db.collection("production", function(err, collection) {
        collection.find({"producer_id": id},{}).toArray(cb)
    })
}

// QUERY: Finds one production order that matches order_number
exports.findProductionOrder = function(order_number, cb){
    db.collection("production", function(err, collection) {
        collection.aggregate([
            {$match: {'order_number': order_number}},
            {$unwind: "$items"},
            {$project: { items: 1}},
            {$group: {
                _id : "$items.name",
                name : {"$first": "$items.name"},
                category : {"$first": "$items.category"},
                ordered_items: {$addToSet: "$items"}
            }},
            {$group: {
                _id : "$category",
                category : {"$first": "$category"},
                name_groups: {$push: "$$ROOT"}
            }},
        ]).toArray(cb)
    })
}

// QUERY: Finds one production order that matches order_number returns DATE
exports.findProductionOrderDate = function(order_number, cb){
    db.collection("production", function(err, collection) {
        collection.findOne({"order_number": order_number}, {date: 1, modified_at: 1}, cb)
    })
}


// DELETE: Deletes order
exports.deleteOrder = function(order_number, cb){
    db.collection("production", function(err, collection) {
        collection.deleteOne( {"order_number" : order_number}, cb)
    })
}

// UPDATE: reopens order
exports.openOrder = function(order_number, cb) {
    db.collection("production", function(err, collection) {
        collection.update(
            {"order_number": order_number},
            {$set : {"closed": 0}},
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Closes order
exports.closeOrder = function(order_number, cb) {
    db.collection("production", function(err, collection) {
        collection.update(
            {"order_number": order_number},
            {$set : {"closed": 1}},
            {safe:true, upsert:false}, cb);
    })
}


// UPDATE: Updates specific item's {finished} value
exports.updateOrder_Finished = function(order_number, product_id, difference, cb){
    db.collection("production", function(err, collection) {
        console.log(order_number)
        console.log(product_id)
        console.log(difference)
        collection.update(
            {"order_number" : order_number , 
             "items" : 
                {
                "$elemMatch": {
                    "product_id": product_id
                    }
                }
            }, 
            {$inc : {"items.$.finished" : difference}}, 
            {safe:true, upsert:false}, cb);
    })
}
 
// UPDATE: Modifies specific item's {ordered} value
exports.updateOrder_Ordered = function(order_number, product_id, difference, cb){
    db.collection("production", function(err, collection) {
        collection.update(
            {"order_number" : order_number , 
             "items" : 
                {
                "$elemMatch": {
                    "product_id": product_id
                    }
                }
            }, 
            {$inc : {"items.$.ordered" : difference}, $push : {"modified_at": new Date()}}, 
            {safe:true, upsert:false}, cb);
    })
}  

// UPDATE: Updates the stock after modifying ordered items in specific production order
exports.updateOrder_Finished_modifyStock = function(order_number, product_id, difference, cb){
    db.collection("stock", function(err, collection) {
        collection.update(
            {"_id": product_id}, {$inc: {"stock": difference}}, 
            {safe:true, upsert:false}, cb)
    })
}


/** 
 * STOCK collection 
 */


// QUERY: finds all stock and groups them
exports.findStock = function(cb) {
    db.collection("stock", function(err,collection) {
        collection.aggregate([
            {$lookup: {
                "from": "production",
                "let": { "productId": "$_id" },
                "pipeline": [
                  {$match: { "closed": 0}},
                  {$unwind: "$items" },
                  {$match: { $expr: { "$eq": [{$toObjectId:"$items.product_id"}, "$$productId"] }}}
                ],
                "as": "orders"
                }},
            {$project: {
                "ordered": {$sum: "$orders.items.ordered" },
                "received": {$sum: "$orders.items.finished" },
                "product_id" : 1, "category" : 1, "name" : 1, "color" : 1, "size" : 1, "stock": 1
                }},
            {$group: { _id : "$name", name: {"$first": "$name"}, 
                       category: {$first: "$category"}, stock: { $push: "$$ROOT"}}},
            {$group: { _id : "$category", category: {$first: "$category"}, 
                       items: { $push: "$$ROOT"}}}       
        ]).toArray(cb)
    })
}

// QUERY: finds different stock Categories
exports.findStockCategories = function(cb){
    db.collection("stock", function(err, collection) {
        collection.aggregate([
            {$group: { _id : "$category", name: {"$first": "$category"}}},
            {$project: {"name": 1, "_id":0}}               
        ]).toArray(cb)
    })
}

// QUERY: finds different stock Colors
exports.findStockColors = function(cb){
    db.collection("stock", function(err, collection) {
        collection.aggregate([
            {$group: { _id : "$color", name: {"$first": "$color"}}}               
        ]).toArray(cb)
    })
}

// QUERY: finds different stock Sizes
exports.findStockSizes = function(cb){
    db.collection("stock", function(err, collection) {
        collection.aggregate([
            {$group: { _id : "$size", name: {"$first": "$size"}}}               
        ]).toArray(cb)
    })
}

// UPDATE: updates stock count on a product
exports.updateProductStock = function(product_id, difference, cb){
    db.collection("stock", function(err, collection) {
        collection.update(
            {'_id': product_id}, 
            {$inc: {"stock": difference}}, 
            {safe:true, upsert:false}, cb )
    })
};


// UPDATE: updates stock coming from the script function
exports.updateStockfromScript = function(item, cb){  //same as insert
    db.collection("stock", function(err, collection) {
        collection.update({'name': item.name, 'color': item.color, 'size': item.size}, 
                          {$set: {"stock": item.stock}}, {safe:true, upsert:false});

        // Otra chapuza
        cb(null, "ok")

    })

};

/** 
 * SUPPLIER collection 
 */

// QUERY: groups all materials into suppliers.
exports.findSuppliersWithMaterials = function(cb) {
    db.collection("materials", function(err,collection) {
        collection.aggregate([
            {$group: { _id : "$supplier_id", 
                       name : {"$first": "$supplier_name"}, 
                       materials: {$push: "$$ROOT"}
            }}
        ]).toArray(cb)
    })
}

// QUERY: groups all materials into suppliers except those that already have producer.
exports.findSuppliersWithMaterialsExceptProducer = function(producer_id, cb) {
    db.collection("materials", function(err,collection) {
        collection.aggregate([
            {$match: {"stock.warehouse_id": {$nin: [producer_id]}}},
            {$group: { _id : "$supplier_id", 
                       name : {"$first": "$supplier_name"}, 
                       materials: {$push: "$$ROOT"}
            }}
        ]).toArray(cb)
    })
}

/** 
 * BILL OF MATERIALS collection 
 */

// adds a material usage to the product's bill of material
exports.addMaterialToBOM = function(product_id, material, cb) {
    db.collection("boms", function(err, collection) {
        collection.update(
            {"_id": product_id}, 
            {$push: {"materials": material}},
            {safe:true, upsert:false}, cb);
    })
}

// adds a material usage to the product's bill of material
exports.deleteMaterialFromBOM = function(product_id, material_id, cb) {
    db.collection("boms", function(err, collection) {
        collection.update(
            {"_id": product_id}, 
            {$pull: { "materials": {"material_id": material_id }}},
            {}, cb);
    })
}

// builds BOM
exports.findBillOfMaterials = function(product_id, cb) {
    db.collection("boms", function(err,collection) {
        collection.aggregate([
            {$match: {"_id": product_id}},
            {$unwind: "$materials"},
            {$lookup: {
                "from": "materials",
                "let": {"materialId": "$materials.material_id"},
                "pipeline": [
                  {$match: { $expr: { "$eq": [{$toObjectId: "$$materialId"}, "$_id"]}}}
                ],
                "as":"material_info"
            }},
            {$lookup: {
                "from": "suppliers",
                "let": {"supplierId": "$materials.supplier_id"},
                "pipeline": [
                  {$match: { $expr: { "$eq": ["$$supplierId", "$_id"]}}}
                ],
                "as":"supplier_info"
            }},
            {$addFields: {
                "materials.name": {$arrayElemAt: ["$material_info.name", 0]},
                "materials.description": {$arrayElemAt: ["$material_info.description", 0]},
                "materials.measure_unit": {$arrayElemAt: ["$material_info.measure_unit", 0]},
                "materials.external_ref": {$arrayElemAt: ["$material_info.external_ref", 0]},
                "materials.supplier_name": {$arrayElemAt: ["$supplier_info.name", 0]}
            }},
            {$group: {
                _id: { _id: "$_id"},
                "product_id": {$first: "$product_id"},
                "materials" : {$addToSet: "$materials"},
                "created_at" : {$first: "$created_at"},
                "notes" : {$first: "$notes"},
            }},
            {$project: { "_id": 0}}
        ]).toArray(cb)
    })
}

/** 
 * MATERIALS collection 
 */

// QUERY: get materials from supplier (retrieves BOM + Production + Purchases)
exports.getMaterialsFromSupplier = function(supplier_id, cb) {
    db.collection("materials", function(err,collection) {
        collection.aggregate([
            {$match: {"supplier_id": supplier_id}},
            {$lookup: {
                "from": "boms",
                "let": {"materialId": "$_id"},
                "pipeline": [
                  {$unwind: "$materials"},
                  {$project: {"product_id": 1, "materials": 1}},
                  {$match: { $expr: { "$eq": [{$toObjectId: "$materials.material_id"}, "$$materialId"]}}}
                ],
                "as":"existing_boms"
            }},
            {$addFields: {
                "boms": {$concatArrays: [ "$existing_boms", ["no_bom"]]}
            }},
            {$project: {"existing_boms": 0}},
            {$unwind: "$boms"},
            {$addFields: {
              "product_id": "$boms.product_id",
              "quantity": "$boms.materials.quantity"
            }},
            {$lookup: {
                "from": "production",
                "let": {"productId": "$product_id"},
                "pipeline": [
                  {$match: {"closed": 0}},
                  {$project: {"items": 1, "producer_id": 1, "producer_name": 1, "order_number": 1}},
                  {$unwind: "$items"},
                  {$match: { $expr: { "$eq": ["$items.product_id", "$$productId"]}}}
                ],
                "as":"existing_productions"
            }},
            {$addFields: {
                "production": {$concatArrays: [ "$existing_productions", ["no_production"]]}
            }},
            {$project: {"existing_productions": 0}},
            {$unwind: "$production"},
            {$addFields: {
                "in_production_producer":  "$production.producer_id",
                "in_production_producer_name":  "$production.producer_name",
                "in_production": {
                    $cond: [
                        {$eq:  ["$production", "no_production"] }, 0, 
                        {$multiply: [
                            {$subtract:[{$sum: "$production.items.ordered"},{$sum: "$production.items.finished"}]},
                            "$quantity"
                        ]}
                    ]
                }
            }},
            {$project: {
              "production": 0, "boms": 0
            }},
            {$group: {
                _id: { material_id: "$_id", producer_id: "$in_production_producer"},
                "material_id": {$first: "$_id"},
                "name" : {$first: "$name"},
                "description" : {$first: "$description"},
                "stock" : {$first: "$stock"},
                "measure_unit" : {$first: "$measure_unit"},
                "supplier_id" : {$first: "$supplier_id"},
                "supplier_name" : {$first: "$supplier_name"},
                "in_production_quantity" : {$sum: "$in_production"},
                "in_production_producer" : {$first: "$in_production_producer"},
                "in_production_producer_name" : {$first: "$in_production_producer_name"},
                "external_ref": {$first: "$external_ref"},
                "unit_price": {$first: "$unit_price"}
            }},
            {$addFields: {
                "in_production" : {
                  "quantity": "$in_production_quantity",
                  "producer_id": "$in_production_producer",
                  "producer_name": "$in_production_producer_name"
                }
            }},         
            {$group: {
                _id: { material_id: "$material_id"},
                "material_id": {$first: "$material_id"},
                "name" : {$first: "$name"},
                "description" : {$first: "$description"},
                "stock" : {$first: "$stock"},
                "measure_unit" : {$first: "$measure_unit"},
                "supplier_id" : {$first: "$supplier_id"},
                "supplier_name" : {$first: "$supplier_name"},
                "in_production" : {$addToSet: "$in_production"},
                "external_ref": {$first: "$external_ref"},
                "unit_price": {$first: "$unit_price"}
            }},
            {$lookup: {
                "from": "purchasing",
                "let": { "materialId": "$material_id" },
                "pipeline": [
                  {$match: { "closed": 0}},
                  {$unwind: "$materials" },
                  {$match: { $expr: { "$eq": [{$toObjectId: "$materials.material_id"}, "$$materialId"] }}}
                ],
                "as": "orders"
                }},
            {$project: {"_id": 0}},
            {$addFields: {
                "_id": "$material_id",
                "ordered": {$sum: "$orders.materials.ordered" },
                "received": {$sum: "$orders.materials.received" },
                "will_receive_on": {$max: "$orders.delivery_date"},
                }},
            {$project: {"material_id": 0, "orders":0}}
        ]).toArray(cb)
    })
}

// QUERY: get materials at Producer's warehouse 
exports.getMaterialsAtProducer = function(producer_id, cb) {
    db.collection("materials", function(err,collection) {
        collection.aggregate([
            {$lookup: {
                "from": "boms",
                "let": {"materialId": "$_id"},
                "pipeline": [
                  {$unwind: "$materials"},
                  {$project: {"product_id": 1, "materials": 1}},
                  {$match: { $expr: { "$eq": [{$toObjectId: "$materials.material_id"}, "$$materialId"]}}}
                ],
                "as":"existing_boms"
            }},
            {$addFields: {
                "boms": {$concatArrays: [ "$existing_boms", ["no_bom"]]}
            }},
            {$unwind: "$boms"},
            {$addFields: {
              "product_id": "$boms.product_id",
              "quantity": "$boms.materials.quantity"
            }},
            {$lookup: {
                "from": "production",
                "let": {"productId": "$product_id"},
                "pipeline": [
                  {$match: {"closed": 0, "producer_id": producer_id}},
                  {$project: {"items": 1, "producer_id": 1, "producer_name": 1, "order_number": 1}},
                  {$unwind: "$items"},
                  {$match: { $expr: { "$eq": ["$items.product_id", "$$productId"]}}}
                ],
                "as":"existing_productions"
            }},
            {$addFields: {
                "production": {$concatArrays: [ "$existing_productions", ["no_production"]]}
            }},
            {$unwind: "$production"},
            {$addFields: {
                "in_production_producer":  "$production.producer_id",
                "in_production_producer_name":  "$production.producer_name",
                "in_production_producer_order":  "$production.order_number",
                "in_production": {
                    $cond: [
                        {$eq:  ["$production", "no_production"] }, 0, 
                        {$multiply: [
                            {$subtract:[{$sum: "$production.items.ordered"},{$sum: "$production.items.finished"}]},
                            "$quantity"
                        ]}
                    ]
                }
            }},
            {$project: {
              "production": 0, "boms": 0
            }},
            {$group: {
                _id: { material_id: "$_id", order_number: "$in_production_producer_order"},
                "material_id": {$first: "$_id"},
                "name" : {$first: "$name"},
                "description" : {$first: "$description"},
                "stock" : {$first: "$stock"},
                "measure_unit" : {$first: "$measure_unit"},
                "supplier_id" : {$first: "$supplier_id"},
                "supplier_name" : {$first: "$supplier_name"},
                "in_production_quantity" : {$sum: "$in_production"},
                "in_production_producer" : {$first: "$in_production_producer"},
                "in_production_producer_name" : {$first: "$in_production_producer_name"},
                "in_production_producer_order" : {$first: "$in_production_producer_order"},
                "external_ref": {$first: "$external_ref"}
            }},
            {$addFields: {
                "in_production" : {
                  "quantity": "$in_production_quantity",
                  "producer_id": "$in_production_producer",
                  "producer_name": "$in_production_producer_name",
                  "order_number": "$in_production_producer_order"
                }
            }},         
            {$group: {
                _id: { material_id: "$material_id"},
                "material_id": {$first: "$material_id"},
                "name" : {$first: "$name"},
                "description" : {$first: "$description"},
                "stock" : {$first: "$stock"},
                "measure_unit" : {$first: "$measure_unit"},
                "supplier_id" : {$first: "$supplier_id"},
                "supplier_name" : {$first: "$supplier_name"},
                "in_production" : {$addToSet: "$in_production"},
                "external_ref": {$first: "$external_ref"}
            }},
            {$lookup: {
                "from": "purchasing",
                "let": { "materialId": "$material_id" },
                "pipeline": [
                  {$match: { "closed": 0}},
                  {$unwind: "$materials" },
                  {$match: { $expr: { "$eq": [{$toObjectId: "$materials.material_id"}, "$$materialId"] }}}
                ],
                "as": "orders"
                }},
            {$project: {"_id": 0}},
            {$addFields: {
                "_id": "$material_id",
                "ordered": {$sum: "$orders.materials.ordered" },
                "received": {$sum: "$orders.materials.received" },
                "will_receive_on": {$max: "$orders.delivery_date"},
                }},
            {$project: {"material_id": 0, "orders":0}},
            {$unwind: "$stock"},
            {$match: { $expr: { "$eq": ["$stock.warehouse_id", producer_id] }}},
            {$addFields: {
                "warehouse_stock": { $cond:
                  [{ $eq: ["$stock.warehouse_id", producer_id] }, "$stock.stock", 0]
                }}
            },
            {$group: {
                _id: { material_id: "$_id"},
                "material_id": {$first: "$_id"},
                "name" : {$first: "$name"},
                "description" : {$first: "$description"},
                "stock" : {$sum: "$warehouse_stock"},
                "measure_unit" : {$first: "$measure_unit"},
                "supplier_id" : {$first: "$supplier_id"},
                "supplier_name" : {$first: "$supplier_name"},
                "in_production" : {$first: "$in_production"},
                "ordered" : {$first: "$ordered"},
                "received" : {$first: "$received"},
                "external_ref": {$first: "$external_ref"}
            }},
            {$project: {"_id": 0}},
            {$addFields: {
                "_id": "$material_id"}},
            {$project: {"material_id": 0}},
            {$group: { 
                _id : "$supplier_id",
                name: {$first: "$supplier_name"},
                materials: {$push: "$$ROOT"},
            }}              
        ]).toArray(cb)
    })
}

// UPDATE: updates stock count in warehouse
exports.updateMaterialStock = function(id, warehouse_id, difference, cb){
    db.collection("materials", function(err, collection) {
        collection.update(
            {"_id": id, "stock.warehouse_id": warehouse_id},
            {$inc: {"stock.$.stock":difference}}, cb)         
    })
};


// UPDATE: Adds new stock count in warehouse
exports.addNewWarehouseStock = function(id, warehouse, stock, cb){
    db.collection("materials", function(err, collection) {

        //first check if there is already item in array
        collection.find(
            {"_id": id, "stock": { $elemMatch: { "warehouse_id":warehouse._id}}},{})
            .toArray( function (err, result) {

                //Add the item to the warehouse if it doesnt exist
                if (result.length == 0) {
                    console.log("doesnt exist.. creating it in array")
                    collection.update(
                        {"_id": id},
                        {$push: { "stock": {"warehouse_id":warehouse._id,"warehouse_name":warehouse.name, "stock":stock}}}, 
                        cb)
                } else {
                    console.log("it exists! this shouldnt happen brah!")
                    cb("ERROR!", 0)
                }

        })

    })
};

/** 
 * PURCHASING.WAREHOUSE collection 
 */


// UPDATE: Updates specific item's {received} value
exports.updateWarehouse_PurchaseReceived = function(purchase_number, warehouse_id, item, cb){
    var received = Number(item.received)
    var id = item.material_id
    db.collection("purchasing.warehouses", function(err, collection) {
        if (err) {
            console.log(err)
        }
        collection.update(
            {"purchase_number" : purchase_number , "warehouse_id": warehouse_id,  
             "materials" : 
                {
                "$elemMatch": {
                    "material_id": id,
                    }
                }
            }, 
            {$set : {"materials.$.received" : received}}, 
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Updates specific item's {total received} value in purchase number
exports.updateWarehouse_modifyPurchase = function(purchase_number, item, cb){
    let difference = item.received - item.previous_received
    var id = item.material_id
    db.collection("purchasing", function(err, collection) {
        if (err) {
            console.log(err)
        }
        collection.update(
            {"purchase_number" : purchase_number ,  
             "materials" : 
                {
                "$elemMatch": {
                    "material_id": id,
                    }
                }
            }, 
            {$inc : {"materials.$.received" : difference}}, 
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Updates the materials stock
exports.updateWarehouse_modifyStock = function(warehouse, id, difference, cb){
    db.collection("materials", function(err, collection) {

        //first check if there is already item in array
        collection.find(
            {"_id": id, "stock": { $elemMatch: { "warehouse_id":warehouse.id}}},{})
            .toArray( function (err, result) {

                //Add the item to the warehouse if it doesnt exist
                if (result.length == 0) {
                    console.log("doesnt exist.. creating it in array")
                    collection.update(
                        {"_id": id},
                        {$push: { "stock": {"warehouse_id":warehouse.id,"warehouse_name":warehouse.name, "stock":Number(difference)}}}, 
                        cb)
                } else {
                    console.log("it exists! updating stock in array")
                    collection.update(
                        {"_id": id, "stock.warehouse_id": warehouse.id},
                        {$inc:{"stock.$.stock":difference}}, cb)
                }

        })

    })
}



/** 
 * PURCHASING collection 
 */


// QUERY: get ONE purchase order
exports.getPurchaseOrder = function(num, cb) {
    db.collection("purchasing", function(err,collection) {
        collection.findOne({"purchase_number": num}, cb)
    })
}


// QUERY: get purchases to supplier
exports.findSupplierPurchases = function(id, cb) {
    db.collection("purchasing", function(err, collection) {
        collection.find({"supplier_id": id},{}).toArray(cb)
    })
}


// UPDATE: Updates purchase order's delivery date
exports.updatePurchaseOrder_Date = function(purchase_number, delivery_date, cb){
    db.collection("purchasing", function(err, collection) {
        collection.update(
            {"purchase_number" : purchase_number}, 
            {$set : {"delivery_date" : delivery_date}}, 
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Updates purchase order's delivery date
exports.updatePurchaseOrder_ItemPrice = function(purchase_number, material_id, difference, total_difference, cb){
    db.collection("purchasing", function(err, collection) {
        collection.update(
            {"purchase_number" : purchase_number, 
             "materials" : {"$elemMatch": {"material_id": material_id}}
            }, 
            {$inc : {"materials.$.unit_price" : difference , "total_price": total_difference}}, 
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Updates purchase order's specific ordered item
exports.updatePurchaseOrder_Ordered = function(purchase_number, material_id, difference, price_difference, cb){
    db.collection("purchasing", function(err, collection) {
        collection.update(
            {"purchase_number" : purchase_number, 
             "materials" : {"$elemMatch": {"material_id": material_id}}
            }, 
            {$inc : {"materials.$.ordered" : difference, "total_price": price_difference }}, 
            {safe:true, upsert:false}, cb);
    })
}



// DELETE: Deletes purchase order
exports.deletePurchaseOrder = function(purchase_number, cb){
    db.collection("purchasing", function(err, collection) {
        collection.deleteOne( {"purchase_number" : purchase_number}, cb)
    })
}

// DELETE: Deletes purchase order
exports.deletePurchaseOrderWarehouses = function(purchase_number, cb){
    db.collection("purchasing.warehouses", function(err, collection) {
        collection.deleteMany( {"purchase_number" : purchase_number}, {}, cb)
    })
}

// UPDATE: reopens purchase order
exports.openPurchaseOrder = function(purchase_number, cb) {
    db.collection("purchasing", function(err, collection) {
        collection.update(
            {"purchase_number": purchase_number},
            {$set : {"closed": 0}},
            {safe:true, upsert:false}, cb);
    })
}

// UPDATE: Closes purchase order
exports.closePurchaseOrder = function(purchase_number, cb) {
    db.collection("purchasing", function(err, collection) {
        collection.update(
            {"purchase_number": purchase_number},
            {$set : {"closed": 1}},
            {safe:true, upsert:false}, cb);
    })
}



/** 
 * STOCK-HISTORY collection 
 */

// QUERY: finds specific item's history
exports.findItemHistory = function(id, cb) {
    db.collection("stockHistory", function(err,collection) {
        collection.find({"product_id": id},{}).sort({updated_at: -1}).toArray(cb);
    })
}

exports.logStockChange = function(updated_from, product_id, difference, cb) {
    db.collection("stock", function(err, collection) {
        collection.findOne({"_id": product_id}, function (err, result) {
            console.log()
            let stock = result.stock
            let previous_stock = stock - difference

            let item = {}
            item["product_id"] = product_id            
            item["stock"] = stock
            item["previous_stock"] = previous_stock
            item["change_in_stock"] = difference
            item["updated_at"] = new Date()
            item["updated_from"] = updated_from
                
            db.collection("stockHistory").insert(item, cb)
        })
    })
}


// QUERY: Gets historic stock changes and appends info from stock collectionexports.findStock = function(cb) {
exports.findAllHistoric = function(cb){
    db.collection("stockHistory", function(err,collection) {
        collection.aggregate([
            {$lookup: {
                "from": "stock",
                "let": { "productId": "$product_id" },
                "pipeline": [
                  {$match: { $expr: { "$eq": ["$product_id", "$$productId"] }}}
                ],
                "as": "stockInfo"
                }
            },
            {$unwind: "$stockInfo"},
            {$project: {
                "product_id" : 1, 
                "name" : "$stockInfo.name", 
                "color" : "$stockInfo.color", 
                "size" : "$stockInfo.size",
                "category": "$stockInfo.category", 
                "change_in_stock" : 1,
                "stock": 1,
                "updated_at": 1
                }
            },
        ]).toArray(cb)
    })
}


/** 
 * MATERIAL-HISTORY collection 
 */

// QUERY: finds specific item's history
exports.findMaterialHistory = function(id, cb) {
    let mongo_id = new mongo.ObjectID(id)
    db.collection("materialHistory", function(err,collection) {
        collection.find({"material_id": mongo_id},{}).sort({updated_at: -1}).toArray(cb);
    })
}

exports.logMaterialChange = function(updated_from, warehouse, material_id, difference, cb) {
    db.collection("materials", function(err, collection) {
        collection.findOne({"_id": material_id}, function (err, result) {
            
            var total_stock = 0
            var warehouse_stock = 0
            var measure_unit = result.measure_unit    

            console.log(result.stock.length)

            if (result.stock.length == 1) {
                total_stock = result.stock[0].stock
            } else {
                total_stock = result.stock.reduce(function (acc, obj) {
                    return acc + obj.stock
                }, 0)
                console.log(total_stock)
            }

            result.stock.forEach(function(obj){
                if (obj.warehouse_id == warehouse._id) {
                    warehouse_stock = obj.stock
                }
            })

            let stock_item = {}
            stock_item["change_in_stock"] = difference
            stock_item["total_stock"] = total_stock
            stock_item["warehouse_stock"] = warehouse_stock
            stock_item["measure_unit"] = measure_unit
            stock_item["warehouse_name"] = warehouse.name
            stock_item["warehouse_id"] = warehouse._id
            stock_item["updated_at"] = new Date()
            stock_item["updated_from"] = updated_from
            stock_item["material_id"] = material_id

            console.log("Added material to history logs")

            db.collection("materialHistory").insert(stock_item, cb)
        })
 
    })
}


