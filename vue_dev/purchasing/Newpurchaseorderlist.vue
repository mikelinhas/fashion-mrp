<template>

    <div>
      <table class="table table-hover" >

      <table class="table table-hover" style>

        <thead>
          <tr>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-3">
              Reference
            </th>
            <th @click="sortBy('description')"  :class="{ active: sortKey == 'description' }" class="table-col-3">
              Material
            </th>
            <th @click="sortBy('stock')"  :class="{ active: sortKey == 'stock' }" class="table-col-2">
              Stock
            </th>
            <th @click="sortBy('ordered')"  :class="{ active: sortKey == 'ordered' }" class="table-col-2">
              Ordered
            </th>
            <th @click="sortBy('unit_price')"  :class="{ active: sortKey == 'unit_price' }" class="table-col-2">
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(material, index) in materials" >
            <td> {{material.external_ref}} </td>
            <td> {{material.name}} </td>
            <td> {{addStock(material.stock)}} {{material.measure_unit}} </td>
            <td> {{material.ordered}} {{material.measure_unit}} </td>
            <td> {{material.unit_price}}</td>
          </tr>
        </tbody>

      </table>  

      <p>{{errorMessage}}</p>


      </table>
    </div>

</template>

<script> 

    export default {
        name: 'Newpurchaseorderlist',

        props: {
            materials: Array
        },

        data() {
            return {
              sortKey: '',
              sortOrder: 1,
            }
        },

        components: {},

        beforeMount() {
            //this.initialSort()
        },

        methods: {

          addStock: function(stock) {
            let total = stock.reduce(function(acc, warehouse) {
                return acc + warehouse.stock
            }, 0)
            return total
          },
          
          addOrder: function(index, number) {
            this.materials[index].edit = 0
          },

          initialSort: function() {
            this.sortBy("description")         
          },

          sortBy: function (key) {
              this.sortKey = key
              this.sortOrders[key] = this.sortOrders[key] * -1
          }

        }

    }

</script>

<style>

</style>