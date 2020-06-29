<template>

    <div>
        
        <div class="sticky-top-container"> 
          <button v-if="generated == 0" class="btn btn-default sticky-top" @click="generateOrder()">Generate Order</button>
          <div style="display: inline" v-if="generated" class="sticky-top">
            <button class="btn btn-default" @click="goBack()">Back </button>
            <button class="btn btn-default" @click="processOrder()">Process Order</button>
          </div>
        </div>
        <h2>{{producer.name}} </h2>


        <div style="padding-top: 35px">  
            <ol class="breadcrumb">
              <li v-for="group in itemGroups" 
                  v-bind:class="{active: filter.includes(group.category)}"
                  v-on:click="filterData(group.category)">{{group.category}}
              </li>
            </ol>
        </div>

        <form id="search">
            Color <input name="query" v-model="colorFilter" onkeypress="return event.keyCode!=13">
        </form>

        <br>

        <div style="max-width: 400px">  
            <ol class="breadcrumb">
              <li v-for="size in sizes" 
                  v-bind:class="{active: sizeFilter == size}"
                  v-on:click="filterSize(size)">{{size}}
              </li>
            </ol>
        </div>

      <div v-if="generated == 0">
        <div v-for="group in itemGroups">
            <div v-if="filter.includes('All') || filter.includes(group.category)" v-for= "item in group.items">
                <h2>{{item.category}} | {{item.name}}</h2>
                <Neworderinput
                  :items="item.stock"
                  :color-filter="colorFilter"
                  :size-filter="sizeFilter">
                </Neworderinput>        
                <br>
            </div>
        </div>
        <br>
      </div>

      <div v-if="generated">
        <div v-for="group in orderitemGroups">
          <div v-if="filter.includes('All') || filter.includes(group.category)" v-for="item in group.items">
              <h2>{{item.category}} | {{item.name}}</h2>
              <Neworderlist 
                :items="item.stock"
                :color-filter="colorFilter"
                :size-filter="sizeFilter">
              </Neworderlist>        
              <br>
          </div>
        </div>

      </div>

        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Neworderinput from './Neworderinput.vue'
    import Neworderlist from './Neworderlist.vue'

    export default {
        name: 'Neworder',

        props: {
            producer_id: '',
            order_number: String
        },

        data() {
          return {
            producer:{},
            itemGroups: [],
            orderitemGroups: [],
            order: [],
            filter: ['All'],
            sizes:['XS','S','M','L','XL'],
            errorMessage: '',
            colorFilter: '',
            sizeFilter: '',
            generated: 0,
          }        
        },

        components: {Neworderinput, Neworderlist},

        methods: {

            goBack: function() {
              this.generated = 0
            },

            processOrder: function() {
              var vueVars = this
              var url = '/db/processOrder'
              var data = {"order": this.order}

              axios.post(url, data)
                .then(function (response) {
                  window.location.href = "/production/" + vueVars.order_number
                })
                .catch(function (error) {
                  vueVars.errorMessage = error.response.data.message;
                });

            },

            generateOrder: function() {

                var vueVars = this
                let orderitemGroups = JSON.parse(JSON.stringify(vueVars.itemGroups.slice(0)))
                let reduced_orderitemGroups = vueVars.reduceOrderedItems(orderitemGroups)

                var array = orderitemGroups.map(function(group) {
                  let stock = group.items.map(function(item) {
                    return item.stock
                  })
                  let flat_stock = [].concat.apply([], stock)
                  return flat_stock
                })

                let flat_array = [].concat.apply([], array)

                var items_ordered = flat_array.filter(function(item) {
                  return item.new_order > 0 
                })

                let items = items_ordered.map(function(item) {
                    let obj = {}
                    obj["product_id"] = item._id
                    obj["category"] = item.category
                    obj["color"] = item.color
                    obj["finished"] = 0
                    obj["ordered"] = Number(item.new_order)
                    obj["name"] = item.name
                    obj["size"] = item.size

                    return obj
                })

                var order =  {"order_number":vueVars.order_number, 
                              "producer_id": vueVars.producer._id, 
                              "producer_name": vueVars.producer.name, 
                              "date":new Date(), 
                              "wip": 0, "closed": 0, 
                              "items": items}

                vueVars.order = order
                
                if (order.items.length) {
                  vueVars.filter = "All"
                  vueVars.colorFilter = ""
                  vueVars.sizeFilter = ""
                  vueVars.orderitemGroups = reduced_orderitemGroups
                  vueVars.generated = 1

                }

            },

            reduceOrderedItems: function(items) {
              let itemGroups = items.map(function(group) {
                group.items = group.items.map(function(category) {
                  category.stock = category.stock.filter(function(item){
                    if (item.new_order > 0) {
                      item.ordered = item.new_order
                      return item
                    }
                  })
                  return category
                })
                return group
              })

              return itemGroups
            },

            queryProducer: function() {
                var vueVars = this;
                var url = '/db/queryStockItems';

                axios.get(url)
                    .then (function (response) {
                        var itemGroups = []
                        for (var i = response.data.length - 1; i >= 0; i--) {
                            let category = {"category" : response.data[i].category}
                            let data = {"items": response.data[i].items}
                            let object = {...category, ...data}
                            itemGroups[i] = object
                        }
                        vueVars.itemGroups = vueVars.sortByCategory(itemGroups)
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            queryItems: function() {
                var vueVars = this;
                var url = '/db/queryProducerByID/' + this.producer_id;

                axios.get(url)
                    .then (function (response) {
                        vueVars.producer = response.data
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            sortByCategory: function(array) {  
               return array.sort( function(a,b) {  
                  if(a["category"] > b["category"])  
                     return 1;  
                  else if(a["category"] < b["category"])  
                     return -1;  
                  return 0;  
               })
            },
            
            filterData: function(str) {
                var vueVars = this

                if (vueVars.filter == str) {
                  vueVars.filter = 'All'
                } else {
                  vueVars.filter = str
                }

            },

            filterSize: function(str) {
              var vueVars = this

                if (vueVars.sizeFilter == str) {
                  vueVars.sizeFilter = ''
                } else {
                  vueVars.sizeFilter = str
                }
            }

        },

        beforeMount() {
            this.queryItems()
            this.queryProducer()
        }

    }

</script>

<style>


</style>