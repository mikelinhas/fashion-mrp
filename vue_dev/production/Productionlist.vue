<template>

    <div>

        <button class="btn btn-default" @click="redirect()" style="padding: 6px 12px; margin-top: 10px">Nuevo Pedido </button>

        <h2> Pedidos de producción </h2>
        <Productiontable :orders="orders"></Productiontable>        
        <br>

        <div v-if="show_closed">
            <button class="btn btn-custom" @click="hideClosed()" style="padding: 6px 12px; margin-top: 10px">Ocultar pedidos cerrados </button>
            <h2> Pedidos de producción cerrados </h2>
            <Productiontable :orders="closed_orders" ty></Productiontable>        
        </div>
        
        <button v-else class="btn btn-custom" @click="showClosed()" style="padding: 6px 12px; margin-top: 10px">Mostrar pedidos cerrados </button>
        <br>

        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Productiontable from './Productiontable.vue'

    export default {
        name: 'Productionlist',

        data() {
          return {
            orders: [],
            closed_orders: [],
            show_closed: 0,
            categories:[],
            filter: ['All'],
            sizes:['XS','S','M','L','XL'],
            errorMessage: '',
            colorFilter: '',
            sizeFilter: ''
          }        
        },

        components: {Productiontable},

		methods: {

            queryProductionOrders: function() {
                var vueVars = this;
                var url = 'db/queryProductionOrders';

                axios.get(url)
                    .then (function (response) {
                        let orders = response.data
                        vueVars.orders = orders.filter(order => order.closed < 1)
                        vueVars.closed_orders = orders.filter(order => order.closed == 1)
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            queryStockCategories: function() {
                var vueVars = this;
                var url = 'db/queryStockCategories';

                axios.get(url)
                    .then (function (response) {
                        vueVars.categories = response.data
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },

            filterSize: function(str) {
                this.sizeFilter = str
            },

            showClosed: function() {
              this.show_closed = 1
            },

            hideClosed: function() {
              this.show_closed = 0
            },

            redirect: function(order_number) {
              window.location.href = "/production/new_order"
            }

        },

        mounted() {
        },

        beforeMount() {
            this.queryProductionOrders()
            this.queryStockCategories()
        }

    }

</script>

<style>

</style>