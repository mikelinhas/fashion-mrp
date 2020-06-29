<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('purchase_number')"  :class="{ active: sortKey == 'purchase_number' }" class="table-col-2">
              Purchase Order #
            </th>
            <th @click="sortBy('supplier_name')"  :class="{ active: sortKey == 'supplier_name' }" class="table-col-2">
              Supplier
            </th>
            <th @click="sortBy('total_price')"  :class="{ active: sortKey == 'total_price' }" class="table-col-2">
              Total Price
            </th>
            <th @click="sortBy('created_at')"  :class="{ active: sortKey == 'created_at' }" class="table-col-2">
              Order Date
            </th>
            <th @click="sortBy('delivery_date')"  :class="{ active: sortKey == 'delivery_date' }" class="table-col-2">
              Reception Date
            </th class="table-col-1">
            <th>
               
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in filteredOrders">
            <td @click="redirect(order.purchase_number)"> {{order.purchase_number}} </td>
            <td @click="redirect(order.purchase_number)"> {{order.supplier_name}} </td>
            <td @click="redirect(order.purchase_number)"> {{order.total_price | currency }} </td>
            <td @click="redirect(order.purchase_number)"> {{order.created_at | dateify }} </td>
            <td @click="redirect(order.purchase_number)"> {{order.delivery_date | dateify }} </td>

            
            <td v-if="order.closed"> 
              <button class="btn btn-success" @click="open_order(order.purchase_number)">
              <i style="padding: 2px" class="fa fa-recycle"></i></button>
              <button class="btn btn-danger" @click="delete_order(order.purchase_number)">
              <i style="padding: 2px" class="fa fa-trash"></i></button>
            </td>
            <td v-if="!order.closed"> <button class="btn btn-default" @click="close_order(order.purchase_number)">
              <i style="padding: 2px" class="fa fa-trash-o"></i></button>
            </td>

          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 
    import axios from 'axios'


    export default {
        name: 'Purchaseorderstable',

        props: {
            orders: Array,
            searchFilter: ''
        },

        data() {
            var sortOrders = {}
            var columns = ['purchase_number','supplier_name','total_price', 'created_at','delivery_date']
            columns.forEach(function (key) {
              sortOrders[key] = 1
            })
            return {
              sortKey: '',
              sortOrders: sortOrders,
            }
        },

        components: {},

    		methods: {
    		},


        computed: {
            filteredOrders: function () {
              var sortKey = this.sortKey
              var searchFilter = this.searchFilter && this.searchFilter.toLowerCase()
              var sort_order = this.sortOrders[sortKey] || 1
              
              var orders = this.orders
              if (searchFilter) {
                orders = orders.filter(function (row) {
                    return String(row['supplier_name']).toLowerCase().indexOf(searchFilter) > -1
                })
              }
              if (sortKey) {
                orders = orders.slice().sort(function (a, b) {
                  a = a[sortKey]
                  b = b[sortKey]
                  return (a === b ? 0 : a > b ? 1 : -1) * sort_order
                })
              }
              return orders
            }
        },

        filters: {
            stringify: function (val) {
              if (val) {
                return "Si"
              } else {
                return "No"
              }
            },

            dateify: function (str) {
              if (str) {
                var date  = new Date(str);
                return date.toLocaleDateString()
              } else {
                return "no info"
              }
            },

            currency: function(val) {
              if (val) {
                let num = Number(val)
                return num.toFixed(2) + " €"
              }
            }

        },
        
        methods: {
            sortBy: function (key) {
                let vueVars = this
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1

                vueVars.orders.sort(function (item1, item2) {

                  // If undefined key (doesnt sort)
                  if (!item1[key]) {
                    item1[key] = ""
                  }
                  if (!item2[key]) {
                    item2[key] = ""
                  }

                  // Sort by key
                  if (item1[key] > item2[key]) return -1*vueVars.sortOrders[key];
                  if (item1[key] < item2[key]) return 1*vueVars.sortOrders[key];

                });
            },
            searchBy: function (string) {


            },

            redirect: function(purchase_number) {
              window.location.href = "/purchasing/" + purchase_number
            },

            close_order: function(purchase_number) {
              var vueVars = this
              var url = '/db/closePurchaseOrder'

              if (confirm("¿Estás segura de que quieres cerrar el pedido " + purchase_number + "?")) {
                axios.post(url, {
                  purchase_number: purchase_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/purchasing"
                  })
                  .catch(function (error) {
                    vueVars.errorMessage = "There has been an Error! Oh no.."
                    console.log(error);
                  })
              } 
            },

            delete_order: function(purchase_number) {
              var vueVars = this
              var url = '/db/deletePurchaseOrder'

              if (confirm("CUIDADO!! Vas a borrar el pedido " + purchase_number + " para siempre. ¿Estás segura?")) {
                axios.post(url, {
                  purchase_number: purchase_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/purchasing"
                  })
                  .catch(function (error) {
                    vueVars.errorMessage = "There has been an Error! Oh no.."
                    console.log(error);
                  })
              } 
            },

            open_order: function(purchase_number) {
              var vueVars = this
              var url = '/db/openPurchaseOrder'

              if (confirm("¿Estás segura de que quieres abrir el pedido " + purchase_number + "?")) {
                axios.post(url, {
                  purchase_number: purchase_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/purchasing"
                  })
                  .catch(function (error) {
                    vueVars.errorMessage = "There has been an Error! Oh no.."
                    console.log(error);
                  })
              } 
            }

        }

    }

</script>

<style>

</style>