<template>

    <div>

      <div class="sticky-top-container">
          <button class="btn btn-custom sticky-top" @click="editInfo()"><i style="padding: 2px;" class="fa fa-pencil"></i></button>
      </div>

      <transition name="slide-fade">
        <h2 v-if="deleted" style="color: red">Eliminado PARA SIEMPRE</h2>
      </transition>
      
      <div v-if="!editing">
        <h2> {{supplier.name}} </h2>   
        <h3> {{supplier.description}} </h3>  

        <p> {{supplier.email}} </p>  
        <p> {{supplier.phone}} </p>  
        <p> CIF: {{supplier.CIF}} </p>  
      </div>

      <div v-if="editing" style="max-width: 500px">
        <h2> Nombre: 
          <input class="form-control" type="text" name="name" :placeholder="supplier.name" v-model="supplier_edit.name"> 
        </h2>   

        <p> Descripción: 
          <input class="form-control" type="text" name="description" :placeholder="supplier.description" v-model="supplier_edit.description">  
        </p>  

        <p> CIF: 
          <input class="form-control" type="text" name="CIF" :placeholder="supplier.CIF" v-model="supplier_edit.CIF">  
        </p> 

        <p> email: 
          <input class="form-control" type="email" name="email" :placeholder="supplier.email" v-model="supplier_edit.email"> 
        </p>  

        <p> teléfono: 
          <input class="form-control" type="tel" name="phone" :placeholder="supplier.phone" v-model="supplier_edit.phone"> 
        </p>

        <p> notas: 
          <textarea class="form-control" type="text" name="notes" :placeholder="supplier.notes" v-model="supplier.notes"> </textarea>
        </p>

        <button class="btn btn-default" @click="updateInfo()"> Actualizar información </button>  

        <br><br>
      </div>

      
      <p>{{errorMessage}}</p>
      <br><br>
      
      <div class="callout">
        <p class="pre-wrap">{{supplier.notes}}</p>
      </div>
      
      <Supplierstock :supplier_id="supplier_id"></Supplierstock>

      <button class="btn btn-default" @click="toggleMaterialCreation()"><i style="padding: 2px" class="fa fa-plus"></i> Añadir material </button>

      <Creatematerial v-if="creating" :supplier="supplier"></Creatematerial>

      <br>


      <button style="margin-top: 50px; float: right;" class="btn btn-danger" @click="deleteSupplier()"><i style="padding: 2px" class="fa fa-trash"></i> Eliminar proveedor de la base de datos </button>

    </div>

</template>

<script> 
    import axios from 'axios'
    import Supplierstock from './Supplierstock.vue'
    import Creatematerial from './Creatematerial.vue'

    export default {
      name: 'Supplierinfo',

      components: {Supplierstock, Creatematerial},

      props: {
          supplier_id: ""
      },

      data() {
        return {
          supplier: {},
          supplier_edit: {},
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
          var url = '/db/updateSupplierInfo'

          console.log(this.update)

          if (Object.keys(this.update).length == 0) {
            console.log("nothing changed...")
            this.editing = !this.editing
            return
          }

          axios.post(url, {
            supplier_id: this.supplier_id,
            update: this.update
            })            
            .then (function (response) {
              window.location.href = "/suppliers/" + vueVars.supplier_id;
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })

        },

        querySupplier: function() {
          var vueVars = this;
          var url = '/db/querySupplierByID/' + this.supplier_id;

          axios.get(url)
            .then (function (response) {
              vueVars.supplier = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        deleteSupplier: function() {
          var vueVars = this;
          var url = '/db/deleteSupplier';

          let input_name = prompt("Para borrar el proveedor, escribe " + this.supplier.name + ". Este cambio es irreversible", "")
          if (input_name == this.supplier.name) {
            axios.post(url, {
              supplier: this.supplier,
              id: this.supplier_id
              })            
              .then (function (response) {
                vueVars.deleted = 1
                setTimeout(function(){ window.location.href = "/suppliers" }, 1000);
                  
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })
          } 
        },

        toggleMaterialCreation: function() {
          this.creating = !this.creating
        }

      },

      beforeMount() {
          this.querySupplier()
      }

    }

</script>

<style>

.pre-wrap {
  white-space: pre-wrap;
}

</style>