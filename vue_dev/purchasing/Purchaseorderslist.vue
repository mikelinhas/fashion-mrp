<template>

    <div>

        <button class="btn btn-default" @click="redirect()" style="padding: 6px 12px; margin-top: 10px">Nueva Compra </button>
        <br><br>

        <form id="search">
            Buscar Proveedor <input name="query" v-model="searchFilter" onkeypress="return event.keyCode!=13">
        </form>

        <h2> Pedidos de compra </h2>
        <Purchaseorderstable :orders="orders" :searchFilter="searchFilter"></Purchaseorderstable>        
        <br>

        <div v-if="show_closed">
            <button class="btn btn-custom" @click="hideClosed()" style="padding: 6px 12px; margin-top: 10px">Ocultar pedidos cerrados </button>
            <h2> Pedidos de compra cerrados </h2>
            <Purchaseorderstable :orders="closed_orders" :search-filter="searchFilter"></Purchaseorderstable>        
        </div>
        
        <button v-else class="btn btn-custom" @click="showClosed()" style="padding: 6px 12px; margin-top: 10px">Mostrar pedidos cerrados </button>
        <br>

        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Purchaseorderstable from './Purchaseorderstable.vue'

    export default {
        name: 'Purchaseorderlist',

        data() {
          return {
            orders: [],
            closed_orders: [],
            show_closed: 0,
            errorMessage: '',
            searchFilter: ''
          }        
        },

        components: {Purchaseorderstable},

		methods: {

            queryPurchaseOrders: function() {
                var vueVars = this;
                var url = 'db/queryPurchaseOrders';

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

            showClosed: function() {
              this.show_closed = 1
            },

            hideClosed: function() {
              this.show_closed = 0
            },

            redirect: function(order_number) {
              window.location.href = "/purchasing/new_order"
            }

        },

        mounted() {
        },

        beforeMount() {
            this.queryPurchaseOrders()
        }

    }

</script>

<style>

</style>