<template>

    <div>

      <h2> Material stock </h2>   

      <table class="table table-hover" style>

        <thead>
          <tr>
            <th></th>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-3"> Reference </th>
            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-3"> Material </th>
            <th @click="sortByStock('stock')"  :class="{ active: sortKey == 'stock' }" class="table-col-2"> Total Stock </th>
            <th @click="sortByOrdered('ordered')"  :class="{ active: sortKey == 'ordered' }" class="table-col-2"> Ordered </th>
            <th @click="sortBy('will_receive_on')"  :class="{ active: sortKey == 'will_receive_on' }" class="table-col-3"> Next reception </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(material,index) in materials" >
            <td @click="toggleShow(material)">
              <i v-if="material.show" class="fa fa-caret-down"></i> 
              <i v-if="!material.show" class="fa fa-caret-right"></i> 
            </td>
            <td> <a class="subtle_link" @click="link(material._id)"> {{material.external_ref}} </a> </td>
            <td> {{material.name}}</td>

            <td> 
              {{addStock(material.stock)}} {{material.measure_unit}}             
              <div v-if="material.show" v-for="warehouse in material.stock" 
                  class="between-rows" :class="{ negative: warehouse.stock - warehouse.quantity < 0 }" >
                  {{warehouse.stock}} {{material.measure_unit}} - {{warehouse.warehouse_name}}
              </div>
            </td> 

            <td> {{calculateOrdered(material)}} {{material.measure_unit}} </td>
            <td> {{material.will_receive_on | dateify}} </td>
          </tr>

        </tbody>

      </table>  

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Supplierstock',

      props: {
          supplier_id: Number
      },

      data() {
        var sortMaterials = {}
        var columns = ['external_ref', 'name','stock', 'in_production', 'ordered','will_receive_on']
        columns.forEach(function(key){
          sortMaterials[key] = 1
        })
        return {
          sortKey: '',
          sortMaterials: sortMaterials,
          materials: [],
          new_material: [],
          errorMessage: ''
        }        
      },

  		methods: {
        addStock: function(stock) {
          let total = stock.reduce(function(acc, warehouse) {
              return acc + warehouse.stock
          }, 0)
          return total
        },

        calculateInProduction: function(arr) {
          let total = arr.reduce(function(acc, order) {
              return acc + order.quantity
          }, 0)
          return total
        },

        calculateOrdered: function(material) {
          return material.ordered - material.received
        },

        populateStockArray: function() {

        },
        
        cleanInProductionArray: function() {
          this.materials.forEach(function(material){
            let in_production = material.in_production.filter(function (producer) {
              return producer.producer_id != null;
            });
            material.in_production = in_production
          })
        },

        matchInProduction: function(warehouse, index) {
          let vueVars = this;
          let stock = warehouse.stock
          let quantity = 0
          this.materials[index].in_production.forEach(function(producer) {
            if (producer.producer_id == warehouse.warehouse_id) {
              quantity = producer.quantity
            } 
          })
          return stock - quantity
        },

        sortByStock: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (vueVars.addStock(item1[key]) > vueVars.addStock(item2[key])) return -1*vueVars.sortMaterials[key];
            if (vueVars.addStock(item1[key]) < vueVars.addStock(item2[key])) return 1*vueVars.sortMaterials[key];

          });
        },

        sortByProduction: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (vueVars.calculateInProduction(item1[key]) > vueVars.calculateInProduction(item2[key])) return -1*vueVars.sortMaterials[key];
            if (vueVars.calculateInProduction(item1[key]) < vueVars.calculateInProduction(item2[key])) return 1*vueVars.sortMaterials[key];

          });
        },

        sortByOrdered: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (vueVars.calculateOrdered(item1) > vueVars.calculateOrdered(item2)) return -1*vueVars.sortMaterials[key];
            if (vueVars.calculateOrdered(item1) < vueVars.calculateOrdered(item2)) return 1*vueVars.sortMaterials[key];

          });
        },

        sortBy: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (item1[key] > item2[key]) return -1*vueVars.sortMaterials[key];
            if (item1[key] < item2[key]) return 1*vueVars.sortMaterials[key];

          });
        },

        editMaterial: function(material) {
          material.edit = 1
        },

        toggleShow: function(material) {
          material.show = !material.show
        },

        link: function(id) {
          window.location.href = "/suppliers/" + this.supplier_id + "/" + id
        },


        querySupplierStock: function() {
          var vueVars = this;
          var url = '/db/querySupplierStock/' + this.supplier_id;

          axios.get(url)
            .then (function (response) {
              vueVars.materials = response.data
              console.log(response.data)
              vueVars.materials.forEach( function(material) {
                vueVars.$set(material, 'show', 0)
              })
              vueVars.cleanInProductionArray()
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
          }

        },


        filters: {
            dateify: function (str) {
              if (str) {
                var date  = new Date(str);
                return date.toLocaleDateString()
              } else {
                return "no info"
              }
            },

            stringify: function(val) {
              if (val > 0 ) {
                return "(+" + val + ")"
              }
              if (val < 0 ) {
                return "(" + val + ")"
              } 
            }
        },

        mounted() {
        },

        beforeMount() {
            this.querySupplierStock()
        }

    }

</script>

<style>

.between-rows {
  margin: 10px 0px;
}

.subtle_link {
  cursor : pointer;
}

.added {
  color: green;
  padding: 8px;
}

.negative {
  color: red;
}

.new-stock-cell {
  padding: 0px !important;
}
.new-stock {
  width: 80px;
  height: 37px;
  padding: 0px;
  padding-left: 10px;
}
</style>