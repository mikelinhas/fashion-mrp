<template>

    <div>
        
      <div class="sticky-top-container"> 
        <button v-if="generated == 0" class="btn btn-default sticky-top" @click="generateOrder()">Generar Pedido</button>
        <div style="display: inline" v-if="generated" class="sticky-top">
          <button class="btn btn-default" @click="goBack()">Atras </button>
          <button class="btn btn-default" @click="processOrder()">Procesar Pedido</button>
        </div>
      </div>

      <form id="search">
          Proveedor <input name="producer" v-model="producerFilter" onkeypress="return event.keyCode!=13">
      </form>

      <h2> Listado de productores </h2>
      <Producertable :producers="producers" :producer-filter="producerFilter" new-order="1"></Producertable>        
      <br>


        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Producertable from '../producers/Producertable.vue'

    export default {
        name: 'Pickproducer',

        data() {
          return {
            errorMessage: '',
            producers: [],
            producerFilter: '',
          }        
        },

        components: {Producertable},

        methods: {

            queryProducers: function() {
                var vueVars = this;
                var url = '/db/getProducers';

                axios.get(url)
                    .then (function (response) {
                        let producers = response.data
                        vueVars.producers = producers
                    })
                    .catch(function (error) {
                        vueVars.errorMessage = "There has been an Error! Oh no.."
                        console.log(error);
                    })
            },


        },

        beforeMount() {
            this.queryProducers()
        }

    }

</script>

<style>


</style>