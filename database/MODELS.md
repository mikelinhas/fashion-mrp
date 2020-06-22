# Example data models for databases

There are no predefined datamodels since that is the beauty of MongoDB and NoSQL databases. 

These are the default models we should take into account to save and query the data in each **collection**.

An idea would be to combine **suppliers** and **producers** into a new **contacts** collection, but not for now. Life is easier this way.

## 'purchasing' 
---

```javascript
{
	"_id" : ObjectId("5ece94756a1b717eb1b80f65"),
	"purchase_number" : "GRO-00001",
	"supplier_id" : "SUPPLIERCIF",
	"supplier_name" : "Grobelastic S.L.",
	"created_at" : "2020-05-27T16:25:24.579Z",
	"status" : "",
	"closed" : 0,
	"total_price": 0,6,
	"materials" : [
		{
			"material_id" : "5ece517a6a1b717eb1b80f5e",
			"name" : "materialname",
			"measure_unit" : "m",
			"ordered" : 6,
			"received" : 0,
			"unit_price": 0.1
		}
	]
}
```

**Notes:** As you can see, the received products are separated into _producers_ which later on might be _warehouses_, dunno. 

--> UPDATE: yes, i have to create a ***producers.warehouses*** collection.
It was waayyy too crazy to have double nested arrays.


## 'purchasing.warehouses'
--- 

```javascript
{
	"_id" : "ORDER NUM -- PRODUCER CIF",
	"warehouse_name" : "PRODUCER NAME",
	"warehouse_id" : "PRODUCER CIF",
	"purchase_number" : "GRO-00001",
	"supplier_id" : "SUPPLIER CIF",
	"supplier_name" : "SUPPLIER NAME",
	"materials" : [
		{
			"material_id" : "5ece517a6a1b717eb1b80f5e",
			"name" : "materialname",
			"measure_unit" : "m",
			"received" : 3
		}
	]
}

{
	"name" : "PRODUCER 2 S.L.",
	"CIF" : "PRODUCERCIF2",
	"purchase_number" : "GRO-00001",
	"supplier_id" : "SUPPLIERCIF",
	"supplier_name" : "Grobelastic S.L.",
	"materials" : [
		{
			"material_id" : "5ece517a6a1b717eb1b80f5e",
			"name" : "materialname",
			"measure_unit" : "m",
			"received" : 3
		}
	]
}
```


## 'producers'
--- 

```javascript
{
	"_id" : "PRODUCERCIF",
	"name" : "PRODUCERCIR S.L.",
	"CIF" : "SUPPLIERCIF",
	"description" : "Fabricante",
	"email" : "info@grobelastic.com",
	"phone" : "+34650333387",
	"notes" : "aaa"
}
```

**Notes:** ```_id``` in this case is not a Mongo ObjectID, since it is the supplier's CIF code. _Tags_ might be used later on, who knows.

## 'stock' 
---

Veery simple

```javascript
{
	"_id" : ObjectId("5ca50a12882915be86bed0e8"),
	"category" : "Briefs",
	"name" : "Culotte",
	"color" : "black",
	"size" : "L",
	"stock" : 39
}
```



## 'suppliers'
--- 

```javascript
{
	"_id" : "SUPPLIERCIF",
	"name" : "Grobelastic S.L.",
	"CIF" : "SUPPLIERCIF",
	"description" : "Proveedor de gomas y tirantes",
	"email" : "info@grobelastic.com",
	"phone" : "+34650333387",
	"notes" : ''
}
```

**Notes:** ```_id``` in this case is not a Mongo ObjectID, since it is the supplier's CIF code. _Tags_ might be used later on, who knows.


## 'materials' 
---

```javascript
{
	"_id" : ObjectId("5ece515e6a1b717eb1b80f5a"),
	"name" : "Gomas verdes",
	"description" : "Gomas verdes para algo",
	"stock" : [
				{
				"producer_id": "PRODUCERCIF",
				"stock": 3
				},
				{
				"producer_id": "PRODUCERCIF",
				"stock": 5
				}
			  ],
	"measure_unit" : "m",
	"unit_price": 0.01,
	"supplier_id" : "SUPPLIERCIF",
	"supplier_name" : "Grobelastic S.L.",
	"external_ref" : "REFFEE"
}
```


## 'boms'
---

```javascript
{
	"_id" : ObjectId("5ca50a4c882915be86bed1da"),
	"product_id" : "5ca50a4c882915be86bed1da",
	"product_name": "somenthing",
	"materials" : [
		{
			"material_id": "e3tuhh3jjnd"
			"supplier_id" : "34559483X",
			"quantity" : 4
		},
		{
			"material_id": "5ca50a4c882915be86bed1da",
			"supplier_id" : "34559483X",
			"quantity" : 0.2
		}
	],
	"notes" : "hola",
	"created_at" : "2020-05-27T16:55:19.155Z"
}
```

**Notes:** ```product_id``` refers to the stock product that is created with this BOM. Maybe further on we need different versions for some reason.