<template>

    <div>
      <table class="table table-hover">

        <thead>
          <tr>
            <th style="width: 30%"> Proveedor </th>
            <th> Referencia del proveedor </th>
            <th> Stock </th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="material in materials">
            <td> {{material.supplier_name}} </td>
            <td> {{material.name}} </td>
            <td> {{material.stock}}{{material.measure_unit}} </td>
            <td> + </td>
          </tr>
          <tr>
            <td> 
              <v-select :options="suppliers" label="name" v-model="new_material.supplier"></v-select>
            </td>
            <td> 
              <v-select :options="supplierMaterials(new_material.supplier)"
                        label="name"
                        v-model="new_material.selected_material"
                        placeholder="Elige un material">
              </v-select>
            </td>
            <td> 
              <input type="number" name="stock" placeholder="" v-model="new_material.stock">
              {{getMeasureUnit(new_material.selected_material)}}
            </td>
            <td> <button v-if="ready" class="btn btn-success" @click="updateMaterial(new_material)">
              <i style="padding-left: 2px; padding-right: 2px;" class="fa fa-plus"></i>
            </td>
          </tr>
        </tbody>

      </table> 

      <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    export default {
      name: 'Addstockmaterial',

      components: {vSelect},

      props: {
          producer: {},

      },

      data() {
        return {
          materials: [],
          suppliers: [],
          new_material: {},
          errorMessage: '',
        }        
      },

      methods: {

        getMeasureUnit: function(selected_material) {
          if (selected_material) {
            return selected_material.measure_unit
          }
        },

        supplierMaterials: function(supplier) {
          if (supplier) {
            if (supplier.materials) {
              return supplier.materials
            } 
          } 
        },

        querySuppliersWithMaterials: function() {
          var vueVars = this;
          var url = '/db/querySuppliersWithMaterialsExceptProducer/' + this.producer._id;


          axios.get(url)
            .then (function (response) {
              vueVars.suppliers = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },


        updateMaterial: function(material) {
          var vueVars = this
          var url = '/db/addNewWarehouseStock'

          if (!material.stock) {
            material.stock = 0
          }
          
          material.selected_material["stock"] = Number(material.stock)

          var data = {"material": material.selected_material, "producer": this.producer}

          axios.post(url, data)
            .then(function (response) {
              vueVars.materials.push(Object.assign({}, vueVars.new_material.selected_material))
              vueVars.new_material = {}
              vueVars.querySuppliersWithMaterials()
            })
            .catch(function (error) {
              alert("ERROR")
            });
        }

      },

      computed: {
        ready: function() {
          if (this.new_material.selected_material) {
            return 1
          } else {
            return 0
          }
        },

      },

      mounted() {
      },

      beforeMount() {
        this.querySuppliersWithMaterials()
      }

    }

</script>

<style>

</style>
