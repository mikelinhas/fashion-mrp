<template>

    <div>
      <div class="sticky-top-container">
          <button  class="btn btn-danger sticky-top" @click="deleteMaterial()"><i style="padding: 2px" class="fa fa-trash"></i> Delete from database </button>
      </div>
      
      <transition name="slide-fade">
        <h2 v-if="deleted" style="color: red">Deleted from database</h2>
      </transition>
      
      <div v-if="!editing">
        <h2> {{material.name}}  -  {{material.description}}  </h2>   
        <h3> {{material.external_ref}} </h3>
        <p> Unit price: {{material.unit_price | currency}} </p>

      </div>

      <div v-if="editing" style="max-width: 500px">
        <h2> Material name: 
          <input class="form-control" type="text" name="name" :placeholder="material.name" v-model="material_edit.name"> 
        </h2>   

        <p> Description: 
          <input class="form-control" type="text" name="description" :placeholder="material.description" v-model="material_edit.description">  
        </p>    

        <p> External reference: 
          <input class="form-control" type="text" name="external_ref" :placeholder="material.external_ref" v-model="material_edit.external_ref">  
        </p>  

        <p> Unit price: 
          <input class="form-control" type="number" step="0.01" name="unitprice" :placeholder="material.unit_price" v-model="material_edit.unit_price"> 
        </p>

        <p> Measure unit: 
          <input class="form-control" type="text" name="mu" :placeholder="material.measure_unit" v-model="material_edit.measure_unit"> 
        </p>

        <p> Notes: 
          <textarea class="form-control" type="text" name="notes" :placeholder="material.notes" v-model="material.notes"> </textarea>
        </p>

        <button class="btn btn-default" @click="updateInfo()"> Update information </button>  

        <br><br>
      </div>

      <button class="btn btn-custom" @click="editInfo()"><i style="padding: 2px;" class="fa fa-pencil"></i></button> 

      <br><br>

      <div class="callout">
        <p class="pre-wrap">{{material.notes}}</p>
      </div>

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
          material_edit: {},
          errorMessage: '',
          editing: 0,
          deleted: 0
        }        
      },

      computed: {
        update: function() {
          let obj = {}

          let new_name = this.material_edit.name
          let new_description = this.material_edit.description
          let new_external_ref = this.material_edit.external_ref
          let new_measure_unit = this.material_edit.measure_unit
          let new_unit_price = this.material_edit.unit_price
          let new_notes = this.material.notes

          if (new_name) {
            obj.name = new_name
          }
          if (new_description) {
            obj.description = new_description
          }
          if (new_external_ref) {
            obj.external_ref = new_external_ref
          }
          if (new_measure_unit) {
            obj.measure_unit = new_measure_unit
          }
          if (new_unit_price) {
            obj.unit_price = new_unit_price
          }
          if (new_notes) {
            obj.notes = new_notes
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
          var url = '/db/updateMaterialInfo'

          console.log(this.update)

          if (Object.keys(this.update).length == 0) {
            console.log("nothing changed...")
            this.editing = !this.editing
            return
          }

          axios.post(url, {
            material_id: this.material_id,
            update: this.update
            })            
            .then (function (response) {
              window.location.href = "/suppliers/" + vueVars.supplier_id + "/" + vueVars.material_id;
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })

        },
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

      filters: {
          currency: function(val) {
            if (val) {
              let num = Number(val)
              return num.toFixed(2) + " €"
            }
          }
      },

      beforeMount() {
          this.queryProduct()
      }

    }

</script>

<style>

.pre-wrap {
  white-space: pre-wrap;
}
</style>