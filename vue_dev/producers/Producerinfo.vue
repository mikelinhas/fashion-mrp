<template>

    <div>

      <div class="sticky-top-container">
          <button class="btn btn-custom sticky-top" @click="editInfo()"><i style="padding: 2px;" class="fa fa-pencil"></i></button>
      </div>

      <transition name="slide-fade">
        <h2 v-if="deleted" style="color: red">Eliminado PARA SIEMPRE</h2>
      </transition>

      <div v-if="!editing">
        <h2> {{producer.name}} </h2>   
        <h3> {{producer.description}} </h3>  

        <p> {{producer.email}} </p>  
        <p> {{producer.phone}} </p>  
        <p> CIF: {{producer.CIF}} </p>  
      </div>

      <div v-if="editing" style="max-width: 500px">
        <h2> Nombre: 
          <input class="form-control" type="text" name="name" :placeholder="producer.name" v-model="producer_edit.name"> 
        </h2>   

        <p> Descripción: 
          <input class="form-control" type="text" name="description" :placeholder="producer.description" v-model="producer_edit.description">  
        </p>  

        <p> CIF: 
          <input class="form-control" type="text" name="CIF" :placeholder="producer.CIF" v-model="producer_edit.CIF">  
        </p> 

        <p> email: 
          <input class="form-control" type="email" name="email" :placeholder="producer.email" v-model="producer_edit.email"> 
        </p>  

        <p> teléfono: 
          <input class="form-control" type="tel" name="phone" :placeholder="producer.phone" v-model="producer_edit.phone"> 
        </p>

        <p> notas: 
          <textarea class="form-control" type="text" name="notes" :placeholder="producer.notes" v-model="producer.notes"> </textarea>
        </p>

        <button class="btn btn-default" @click="updateInfo()"> Actualizar información </button>  

        <br><br>
      </div>

      
      <p>{{errorMessage}}</p>
      <br><br>
      
      <div class="callout">
        <p class="pre-wrap">{{producer.notes}}</p>
      </div>

      <br><br>

      <h2> Stock de artículos </h2> 

      <br>

      <div v-for="supplier in suppliers">
        <Producerstock :producer="producer" :supplier="supplier" :materials="supplier.materials"></Producerstock>
      </div>

      <button class="btn btn-default" @click="toggleMaterialCreation()"><i style="padding: 2px" class="fa fa-plus"></i> Añadir material </button>

      <Addstockmaterial v-if="creating" :producer="producer"></Addstockmaterial>

      <br>

      <button style="margin-top: 50px; float: right;" class="btn btn-danger" @click="deleteProducer()"><i style="padding: 2px" class="fa fa-trash"></i> Eliminar proveedor de la base de datos </button>

    </div>

</template>

<script> 
    import axios from 'axios'
    import Producerstock from './Producerstock.vue'
    import Addstockmaterial from './Addstockmaterial.vue'

    export default {
      name: 'Producerinfo',

      components: {Producerstock, Addstockmaterial},

      props: {
          producer_id: ""
      },

      data() {
        return {
          producer: {},
          producer_edit: {},
          suppliers: [],
          errorMessage: '',
          creating: 0,
          editing: 0,
          deleted: 0
        }        
      },

      computed: {

        update: function() {
          let obj = {}

          let new_name = this.supplier_edit.name
          let new_description = this.supplier_edit.description
          let new_email = this.supplier_edit.email
          let new_phone = this.supplier_edit.phone
          let new_notes = this.supplier.notes
          let new_CIF = this.supplier_edit.CIF

          if (new_name) {
            obj.name = new_name
          }
          if (new_description) {
            obj.description = new_description
          }
          if (new_email) {
            obj.email = new_email
          }
          if (new_phone) {
            obj.phone = new_phone
          }
          if (new_notes) {
            obj.notes = new_notes
          }
          if (new_CIF) {
            obj.CIF = new_CIF
          }

          return obj
        }
      },

  		methods: {

        editInfo: function() {
          this.editing = !this.editing
        },

        updateInfo: function() {
          var vueVars = this;
          var url = '/db/updateProducerInfo'

          console.log(this.update)

          if (Object.keys(this.update).length == 0) {
            console.log("nothing changed...")
            this.editing = !this.editing
            return
          }

          axios.post(url, {
            producer_id: this.producer_id,
            update: this.update
            })            
            .then (function (response) {
              window.location.href = "/producers/" + vueVars.producer_id;
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })

        },

        queryProducer: function() {
          var vueVars = this;
          var url = '/db/queryProducerByID/' + this.producer_id;

          axios.get(url)
            .then (function (response) {
              vueVars.producer = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        deleteProducer: function() {
          var vueVars = this;
          var url = '/db/deleteProducer';

          let input_name = prompt("Para borrar el productor, escribe " + this.producer.name + ". Este cambio es irreversible", "")
          
          if (input_name == this.producer.name) {
            axios.post(url, {
              producer: this.producer,
              id: this.producer_id
              })            
              .then (function (response) {
                vueVars.deleted = 1
                setTimeout(function(){ window.location.href = "/producers" }, 1000);
                  
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })
          } 
        },

        toggleMaterialCreation: function() {
          this.creating = !this.creating
        },

        queryProducerStock: function() {
          var vueVars = this;
          var url = '/db/queryProducerStock/' + this.producer_id;

          axios.get(url)
            .then (function (response) {
              vueVars.suppliers = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        }

      },

      mounted() {
      },

      beforeMount() {
          this.queryProducerStock()
          this.queryProducer()
      }

    }

</script>

<style>

.pre-wrap {
  white-space: pre-wrap;
}

</style>