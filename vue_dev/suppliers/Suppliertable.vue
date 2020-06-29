<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('CIF')"  :class="{ active: sortKey == 'CIF' }" class="table-col-2">
              CIF
            </th>

            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-4">
              Name
            </th>

            <th @click="sortBy('description')"  :class="{ active: sortKey == 'description' }" class="table-col-4">
              Description
            </th>



          </tr>
        </thead>

        <tbody>
          <tr v-for="supplier in filteredSuppliers">
            <td @click="redirect(supplier._id)"> {{supplier.CIF}} </td>
            <td @click="redirect(supplier._id)"> {{supplier.name}} </td>
            <td @click="redirect(supplier._id)"> {{supplier.description }} </td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 
    import axios from 'axios'


    export default {
        name: 'Suppliertable',

        props: {
            suppliers: Array,
            supplierFilter: "",
            newOrder: 0,
        },

        data() {
            var sortSuppliers = {}
            var columns = ['CIF','name','description']
            columns.forEach(function (key) {
              sortSuppliers[key] = 1
            })
            return {
              filteredSuppliers: [],
              sortKey: '',
              sortSuppliers: sortSuppliers
            }
        },

        components: {},

    		methods: {
    		},

        beforeMount() {
          this.supplierFilter = this.suppliers
        },

        watch: {
          supplierFilter: function (str) {
            this.filteredSuppliers = this.suppliers
            var supplierFilter = str
            this.filteredSuppliers = this.suppliers.filter(function (row) {
              return String(row['name']).toLowerCase().indexOf(supplierFilter) > -1
            })
            this.sortKey = ''           
          }
        },
        
        methods: {
            sortBy: function (key) {
                let vueVars = this
                vueVars.sortKey = key
                vueVars.sortSuppliers[key] = vueVars.sortSuppliers[key] * -1

                vueVars.filteredSuppliers.sort(function (item1, item2) {

                  // If undefined key (doesnt sort)
                  if (!item1[key]) {
                    item1[key] = ""
                  }
                  if (!item2[key]) {
                    item2[key] = ""
                  }

                  // Sort by key
                  if (item1[key] > item2[key]) return -1*vueVars.sortSuppliers[key];
                  if (item1[key] < item2[key]) return 1*vueVars.sortSuppliers[key];

                });
            },

            redirect: function(id) {
              if (this.newOrder) {
                window.location.href = "/purchasing/new_order/" + id
              } else {
                window.location.href = "/suppliers/" + id
              }
            },

        },



    }

</script>

<style>

</style>