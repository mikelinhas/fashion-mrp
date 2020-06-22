<template>

    <div>
        <div class="sticky-top-container">
            <button class="btn btn-default sticky-top" @click="toggleSupplierCreation()"> Crear un nuevo proveedor </button>
        </div>

        <transition name="slide-fade">
          <Createsupplier v-if="creating"></Createsupplier>
        </transition>
        <br><br>

        <form id="search">
            Buscar proveedor <input name="suppliers" v-model="supplierFilter" onkeypress="return event.keyCode!=13">
        </form>

        <h2> Listado de proveedores </h2>
        <Suppliertable :suppliers="suppliers" :supplier-filter="supplierFilter"></Suppliertable>        
        <br>


        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Suppliertable from './Suppliertable.vue'
    import Createsupplier from './Createsupplier.vue'

    export default {
        name: 'Supplierlist',

        data() {
          return {
            suppliers: [],
            supplierFilter: '',
            creating: 0
          }        
        },

        components: {Suppliertable, Createsupplier},

		methods: {

            querySuppliers: function() {
                var vueVars = this;
                var url = 'db/getSuppliers';

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

            redirect: function(order_number) {
              window.location.href = "#"
            },

            toggleSupplierCreation: function() {
              this.creating = !this.creating
            }

        },

        mounted() {
        },

        beforeMount() {
            this.querySuppliers()
        }

    }

</script>

<style>

</style>