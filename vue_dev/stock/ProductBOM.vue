<template>

    <div>

      <h2 style="margin-bottom: 20px"> 
        BILL OF MATERIALS 
      </h2>

      <button class="btn btn-custom" @click="toggleEdit()"><i style="padding: 2px;" class="fa fa-pencil"></i></button>


      <table class="table table-hover" style>

        <thead>
          <tr>
            <th class="table-col-4"> Supplier </th>
            <th class="table-col-4"> Material </th>
            <th class="table-col-3"> Quantity </th>
            <th class="table-col-1"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(material,index) in BOM.materials" >
            <td> {{material.supplier_name}} </td>
            <td> {{material.name}} - {{material.description}} </td>
            <td> {{material.quantity}} {{material.measure_unit}} </td>
            <td> 
              <button v-if="edit" class="btn btn-danger" @click="deleteFromBOM(material,index)">
              <i style="padding: 2px" class="fa fa-trash"></i></button>
            </td>
          </tr>

          <tr v-if="edit" v-for="(material,index) in materials">
            <td><v-select :options="suppliers" label="name" v-model="material.supplier"></v-select></td>
            <td>
              <v-select :options="supplierMaterials(material.supplier)"
                        label="name"
                        v-model="material.selected_material"
                        placeholder="Select material">
              </v-select>
            </td>
            <td>
              <div style="width:100px; display: inline-block;">
                <input style="text-align: right; " class="form-control"  type="number" v-model="material.quantity"/>
              </div>
              <div style="display: inline-block;">{{getMeasureUnit(material.selected_material)}}</div>
            </td>
            <td>
              <button v-if="isReady(material)" class="btn btn-success" @click="addToBOM(material, index)">
                <i style="padding-left: 2px; padding-right: 2px;" class="fa fa-plus"></i>
              </button>
            </td>
          </tr>

        </tbody>

        <br>

        <button v-if="edit" class="btn btn-default" @click="addMaterial()">Add material</button>


      </table>

      <p style="text-decoration: underline;">Notes</p>
      <p>{{BOM.notes}}</p> 

      <p>{{errorMessage}}</p>

    </div>

</template>

<script> 
    import axios from 'axios'
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css'

    export default {
      name: 'Productbom',

      components: {vSelect},

      props: {
          product_id: ''
      },

      data() {
        return {
          BOM: {},
          materials:[],
          notes:'',
          suppliers: [],
          edit: 0,
          errorMessage: ''
        }        
      },

      methods: {
        isReady: function(material) {
          if (material.selected_material && material.quantity) {
          //  if(this.checkedSizes.length > 0 && this.checkedColors.length > 0) {
          //    return 1
          //  }
          //} else {
            return 1
          }
        },

        addMaterial: function() {
          let material_row = {"supplier_name":"", "material_name":"", "quantity":0}
          this.materials.push(material_row)
        },

        toggleEdit: function() {
          this.edit = !this.edit
        },

        filterSuppliers: function(supplier_name) {
          if (supplier_name.length < 1) {
            return this.suppliers.slice(0,10)
          } else {
            return this.suppliers
          }
        },

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
          var url = '/db/querySuppliersWithMaterials';

          axios.get(url)
            .then (function (response) {
              vueVars.suppliers = response.data
              console.log(response.data)
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        queryBillOfMaterials: function() {
          var vueVars = this;
          var BOM = this.BOM
          var url = '/db/queryBillOfMaterials/' + this.product_id;

          axios.get(url)
            .then (function (response) {
              if (response.data) {
                vueVars.BOM = response.data
              } else {
                console.log("nothing.. must create")
                vueVars.$set(BOM, 'materials', [])
              }
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
          },

          addToBOM: function(material, index) {
            var vueVars = this;
            let obj = {
              "supplier_id": material.supplier._id,
              "material_id": material.selected_material._id,
              "quantity": Number(material.quantity)
            }
            var url = '/db/addToBillOfMaterials';

            axios.post(url, {
                product_id: this.product_id,
                material: obj
              })
              .then (function (response) {
                vueVars.materials.splice(index,1)
                vueVars.queryBillOfMaterials()
                vueVars.addMaterial()
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })

          },

          deleteFromBOM: function(material, index) {
            var vueVars = this
            var url = '/db/deleteFromBillOfMaterials';

            axios.post(url, {
                product_id: this.product_id,
                material_id: material.material_id
              })
              .then (function (response) {
                vueVars.BOM.materials.splice(index,1)
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })

          }

      },

      filters: {
        dateify: function (str) {
          var date  = new Date(str);
          return date.toLocaleDateString()
        }
      },

      beforeMount() {
        this.querySuppliersWithMaterials()
        this.queryBillOfMaterials()
        this.addMaterial()

      }

    }

</script>

<style>

li.nav-item {
  padding: 8px;
  cursor: pointer;
}

</style>