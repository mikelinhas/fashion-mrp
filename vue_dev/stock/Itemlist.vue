<template>

    <div>
        <div class="sticky-top-container">
            <button class="btn btn-default sticky-top" @click="toggleProductCreation()"> Crear un nuevo producto </button>
        </div>

        <transition name="slide-fade">
          <Createproduct v-if="creating" :categories="categories"></Createproduct>
        </transition>

        <div style="padding-top:35px;">  
            <ol class="breadcrumb">
              <li v-for="category in categories" 
                  v-bind:class="{active: filter.includes(category)}"
                  v-on:click="filterData(category)">{{category}}
              </li>
            </ol>
        </div>

        <form id="search">
            Color <input name="query" v-model="colorFilter" onkeypress="return event.keyCode!=13">
        </form>

        <br>

        <div style="max-width: 400px">  
            <ol class="breadcrumb">
              <li v-for="size in clothingSizes" 
                  v-bind:class="{active: sizeFilter == size}"
                  v-on:click="filterSize(size)">{{size}}
              </li>
            </ol>
        </div>

        <div style="max-width: 800px">  
            <ol class="breadcrumb">
              <li v-for="size in shoeSizes" 
                  v-bind:class="{active: sizeFilter == size}"
                  v-on:click="filterSize(size)">{{size}}
              </li>
            </ol>
        </div>

        <div v-for="group in itemGroups">
            <div v-if="filter.includes('All') || filter.includes(group.category)" v-for="item in group.items">
                <Itemtable
                  :category="item.category"
                  :name="item.name"
                  :items="item.stock"
                  :color-filter="colorFilter"
                  :size-filter="sizeFilter">
                </Itemtable>        
            </div>
        </div>
        
        <br>

        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Itemtable from './Itemtable.vue'
    import Createproduct from './Createproduct.vue'

    export default {
        name: 'Itemlist',

        data() {
          return {
            itemGroups: [],
            categories: [],
            filter: ['All'],
            clothingSizeOrder:['XS','S','M','L','XL', 'Onesize'],
            clothingSizes: [],
            shoeSizes: [],
            errorMessage: '',
            colorFilter: '',
            sizeFilter: '',
            creating: 0
          }        
        },

        components: {Itemtable, Createproduct},

		    methods: {

            queryCategories: function() {
                var vueVars = this;
                var url = 'db/queryStockCategories';

                axios.get(url)
                    .then (function (response) {
                        vueVars.categories = vueVars.sortCategories(response.data)
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            querySizes: function() {
                var vueVars = this;
                var url = 'db/queryStockSizes';

                axios.get(url)
                    .then (function (response) {
                        var clothingSizes = []
                        var shoeSizes = []
                        response.data.forEach(function(size){
                          if (Number(size.name)) {
                            shoeSizes.push(String(size.name))
                          } else {
                            clothingSizes.push(size.name)
                          }
                        })
                        vueVars.clothingSizes = vueVars.sortClothingSizes(clothingSizes)
                        vueVars.shoeSizes = shoeSizes.sort()
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            queryItems: function() {
                var vueVars = this;
                var url = 'db/queryStockItems';

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

            sortClothingSizes: function(array) {
              let vueVars = this
              return array.sort(function (item1, item2) {
                if (vueVars.clothingSizeOrder.indexOf(item1) > vueVars.clothingSizeOrder.indexOf(item2)) return 1;
                if (vueVars.clothingSizeOrder.indexOf(item1) < vueVars.clothingSizeOrder.indexOf(item2)) return -1;
              });
            },

            sortCategories: function(array) {
              return array.sort( function(a,b) {
                if(a > b)
                  return 1;
                else if(a < b)
                  return -1;
                return 0;
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

            filterSize: function(val) {
              var vueVars = this

                if (vueVars.sizeFilter == val) {
                  vueVars.sizeFilter = ''
                } else {
                  vueVars.sizeFilter = val
                }
            },

            toggleProductCreation: function() {
              this.creating = !this.creating
            }
        },

        mounted() {
        },

        beforeMount() {
            this.queryItems()
            this.querySizes()
            this.queryCategories()
        }

    }

</script>

<style>


</style>