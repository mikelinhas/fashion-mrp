<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('order_number')"  :class="{ active: sortKey == 'order_number' }" class="table-col-4">
              # Pedido
            </th>
            <th @click="sortBy('date')"  :class="{ active: sortKey == 'date' }" class="table-col-6">
              Fecha Pedido
            </th>

            <th class="table-col-2">
            </th>

          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders">
            <td @click="redirect(order.order_number)"> {{order.order_number}} </td>
            <td @click="redirect(order.order_number)"> {{order.date | dateify }} </td>

            
            <td v-if="order.closed"> 
              <button class="btn btn-success" @click="open_order(order.order_number)">
              <i style="padding: 2px" class="fa fa-recycle"></i></button>
              <button class="btn btn-danger" @click="delete_order(order.order_number)">
              <i style="padding: 2px" class="fa fa-trash"></i></button>
            </td>
            <td v-if="!order.closed"> <button class="btn btn-default" @click="close_order(order.order_number)">
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
        name: 'Productiontable',

        props: {
            orders: Array,
            colorFilter: String,
            sizeFilter: String
        },

        data() {
            var sortOrders = {}
            var columns = ['order_number','date']
            columns.forEach(function (key) {
              sortOrders[key] = 1
            })
            return {
              sortKey: '',
              sortOrders: sortOrders
            }
        },

        components: {},

    		methods: {
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
              var date  = new Date(str);
              return date.toLocaleDateString()
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


            redirect: function(order_number) {
              window.location.href = "/production/" + order_number
            },

            close_order: function(order_number) {
              var vueVars = this
              var url = '/db/closeOrder'

              if (confirm("¿Estás segura de que quieres cerrar el pedido " + order_number + "?")) {
                axios.post(url, {
                  order_number: order_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/production"
                  })
                  .catch(function (error) {
                    vueVars.errorMessage = "There has been an Error! Oh no.."
                    console.log(error);
                  })
              } 
            },

            delete_order: function(order_number) {
              var vueVars = this
              var url = '/db/deleteOrder'

              if (confirm("CUIDADO!! Vas a borrar el pedido " + order_number + " para siempre. ¿Estás segura?")) {
                axios.post(url, {
                  order_number: order_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/production"
                  })
                  .catch(function (error) {
                    vueVars.errorMessage = "There has been an Error! Oh no.."
                    console.log(error);
                  })
              } 
            },

            open_order: function(order_number) {
              var vueVars = this
              var url = '/db/openOrder'

              if (confirm("¿Estás segura de que quieres abrir el pedido " + order_number + "?")) {
                axios.post(url, {
                  order_number: order_number
                })
                  .then (function (response) {
                    console.log(response)
                    window.location.href = "/production"
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