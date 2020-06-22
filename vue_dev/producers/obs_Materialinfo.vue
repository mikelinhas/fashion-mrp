<template>

    <div>
      <div class="sticky-top-container">
          <button class="btn btn-danger sticky-top" @click="deleteMaterial()"><i style="padding: 2px" class="fa fa-trash"></i> Eliminar de la base de datos </button>
      </div>
      
      <transition name="slide-fade">
        <h2 v-if="deleted" style="color: red">Eliminado del stock de material PARA SIEMPRE</h2>
      </transition>
      
      <h2> {{material.name}}  -  {{material.description}}  </h2>   
      <h3> {{material.measure_unit}} </h3>  

      <p>{{errorMessage}}</p>

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Materialinfo',

      props: {
          supplier_id: "",
          material_id: ""
      },

      data() {
        return {
          material: {},
          errorMessage: '',
          deleted: 0
        }        
      },

  		methods: {

        queryProduct: function() {
          var vueVars = this;
          var url = '/db/queryMaterialByID/' + this.material_id;

          axios.get(url)
            .then (function (response) {
              vueVars.material = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        deleteMaterial: function() {
          var vueVars = this;
          var url = '/db/deleteMaterial';

          axios.post(url, {
            material_id: this.material_id
            })            
            .then (function (response) {
              vueVars.deleted = 1
              setTimeout(function(){ window.location.href = "/suppliers/" + vueVars.supplier_id}, 1000);
                
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
          this.queryProduct()
      }

    }

</script>

<style>

</style>