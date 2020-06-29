<template>

    <div>
        
      <div class="sticky-top-container"> 
        <button v-if="generated == 0" class="btn btn-default sticky-top" @click="generateOrder()">Generate Order</button>
        <div style="display: inline" v-if="generated" class="sticky-top">
          <button class="btn btn-default" @click="goBack()">Back </button>
          <button class="btn btn-default" @click="processOrder()">Process Order</button>
        </div>
      </div>

      <form id="search">
          Proveedor <input name="supplier" v-model="supplierFilter" onkeypress="return event.keyCode!=13">
      </form>

      <h2> Listado de proveedores </h2>
      <Suppliertable :suppliers="suppliers" :supplier-filter="supplierFilter" new-order="1"></Suppliertable>        
      <br>


        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Suppliertable from '../suppliers/Suppliertable.vue'

    export default {
        name: 'Picksupplier',

        data() {
          return {
            errorMessage: '',
            suppliers: [],
            supplierFilter: '',
          }        
        },

        components: {Suppliertable},

        methods: {

            querySuppliers: function() {
                var vueVars = this;
                var url = '/db/getSuppliers';

                axios.get(url)
                    .then (function (response) {
                        let suppliers = response.data
                        vueVars.suppliers = suppliers
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },


        },

        beforeMount() {
            this.querySuppliers()
        }

    }

</script>

<style>


</style>