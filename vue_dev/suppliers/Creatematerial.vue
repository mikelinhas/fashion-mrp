<template>

    <div>
      <table class="table table-hover">

        <thead>
          <tr>
            <th style="width: 30%"> Artículo </th>
            <th style="width: 30%"> Descripción </th>
            <th> Referencia del proveedor </th>
            <th> Unidad de medida </th>
            <th> Precio ud. </th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="material in materials">
            <td> {{material.name}} </td>
            <td> {{material.description}} </td>
            <td> {{material.external_ref}} </td>
            <td> {{material.measure_unit}} </td>
            <td> {{material.unit_price}} </td>
            <td> + </td>
          </tr>
          <tr>
            <td> <input style="width: 80%" type="text" name="name" placeholder="Gomas" v-model="new_material.name"> </td>
            <td> <input style="width: 80%" type="text" name="desription" placeholder="" v-model="new_material.description"> </td>
            <td> <input type="text" name="external_ref" placeholder="" v-model="new_material.external_ref"> </td>
            <td> <input type="text" name="mu" placeholder="m (metros)" v-model="new_material.measure_unit"> </td>
            <td> <input type="number" name="up" placeholder="€" step="0.01" v-model="new_material.unit_price"> </td>
            <td> 
              <button v-if="ready" class="btn btn-success" @click="createMaterial()">
                <i style="padding-left: 2px; padding-right: 2px;" class="fa fa-plus"></i>
              </button>
            </td>
          </tr>
        </tbody>

      </table> 

      <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Creatematerial',

      props: {
          supplier: {}
      },

      data() {
        return {
          materials: [],
          new_material: {},
          errorMessage: '',
        }        
      },

  		methods: {

        createMaterial: function() {
          var vueVars = this
          var url = '/db/createMaterialFromSupplier'

          axios.post(url, {
            material: this.new_material,
            supplier: this.supplier
            })
            .then (function (response) {
              console.log(response)
              vueVars.materials.push(Object.assign({}, vueVars.new_material))
              vueVars.new_material = {}
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            }) 
        }


      },

      computed: {
        ready: function() {
          if (this.new_material.name && this.new_material.external_ref) {
            return 1
          } else {
            return 0
          }
        },

      },

      mounted() {
      },

      beforeMount() {
      }

    }

</script>

<style>

</style>