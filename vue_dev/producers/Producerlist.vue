<template>

    <div>
        <div class="sticky-top-container">
            <button class="btn btn-default sticky-top" @click="toggleProducerCreation()"> Crear un nuevo fabricante </button>
        </div>

        <transition name="slide-fade">
          <Createproducer v-if="creating"></Createproducer>
        </transition>
        <br><br>

        <form id="search">
            Buscar fabricante <input name="producers" v-model="producerFilter" onkeypress="return event.keyCode!=13">
        </form>

        <h2> Listado de fabricantes </h2>
        <Producertable :producers="producers" :producer-filter="producerFilter"></Producertable>
        <br>


        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Producertable from './Producertable.vue'
    import Createproducer from './Createproducer.vue'

    export default {
        name: 'Producerlist',

        data() {
          return {
            producers: [],
            producerFilter: '',
            creating: 0
          }        
        },

        components: {Producertable, Createproducer},

		methods: {

            queryProducers: function() {
                var vueVars = this;
                var url = 'db/getProducers';

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

            redirect: function(order_number) {
              window.location.href = "#"
            },

            toggleProducerCreation: function() {
              this.creating = !this.creating
            }

        },

        mounted() {
        },

        beforeMount() {
            this.queryProducers()
        }

    }

</script>

<style>

</style>