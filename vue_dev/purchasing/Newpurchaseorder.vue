<template>

    <div>
        
      <div class="sticky-top-container"> 
        <button v-if="generated == 0" class="btn btn-default sticky-top" @click="generateOrder()">Generate order</button>
        <div style="display: inline" v-if="generated" class="sticky-top">
          <button class="btn btn-default" @click="goBack()">Back </button>
          <button class="btn btn-default" @click="processOrder()">Process order</button>
        </div>
      </div>
      <h2>{{supplier.name}} </h2>

      <h2>Total price: {{totalPrice | currency}}</h2>

      <div v-if="generated == 0">
        <Newpurchaseorderinput
          v-if="received_data == 1" 
          :materials="materials">
        </Newpurchaseorderinput>        
        <br>
      </div>

      <div v-if="generated">
        <Newpurchaseorderlist 
          v-if="received_data == 1" 
          :materials="ordered_materials">
        </Newpurchaseorderlist>        
        <br>
      </div>

      <p>{{errorMessage}}</p>

</template>

<script> 
    import axios from 'axios'
    import Newpurchaseorderinput from './Newpurchaseorderinput.vue'
    import Newpurchaseorderlist from './Newpurchaseorderlist.vue'

    export default {
        name: 'Newpurchaseorder',

        props: {
            purchase_number: String,
            supplier_id: String
        },

        data() {
          return {
            purchase_number: '',
            received_data: 0,
            errorMessage: '',
            supplier: [],
            materials: [],
            ordered_materials: [],
            order: [],
            generated: 0,
          }        
        },

        components: {Newpurchaseorderinput, Newpurchaseorderlist},

        computed: {
          totalPrice: function() {

            let total_price = this.materials.reduce( function (acc, material){
              let unit_price = 0
              if (!material.unit_price) {
                unit_price = 0
              } else {
                unit_price = material.unit_price
              }
              return acc + (unit_price * material.new_order)
            }, 0)
            return total_price
          }
        },

        methods: {

            goBack: function() {
              this.generated = 0
            },

            processOrder: function() {
              var vueVars = this
              var url = '/db/processPurchaseOrder'
              var data = {"order": this.order}

              axios.post(url, data)
                .then(function (response) {
                  window.location.href = "/purchasing/" + vueVars.purchase_number
                })
                .catch(function (error) {
                  vueVars.errorMessage = error.response.data.message;
                });

            },

            generateOrder: function() {

                var vueVars = this
                var ordered_materials = vueVars.materials
                let reduced_ordered_materials = vueVars.reduceOrderedMaterials()


                ordered_materials = ordered_materials.filter(function(material) {
                  return material.new_order > 0 
                })

                let materials = ordered_materials.map(function(material) {
                    let obj = {}
                    obj["material_id"] = material._id
                    obj["external_ref"] = material.external_ref
                    obj["name"] = material.name
                    obj["measure_unit"] = material.measure_unit
                    obj["ordered"] = Number(material.new_order)
                    obj["received"] = 0
                    obj["unit_price"] = Number(material.unit_price)
                    return obj
                })

                var order =  {"purchase_number":vueVars.purchase_number, 
                              "supplier_id": vueVars.supplier._id, 
                              "supplier_name": vueVars.supplier.name, 
                              "created_at":new Date(), "closed": 0,
                              "total_price": this.totalPrice, 
                              "materials": materials}

                vueVars.order = order
                
                if (order.materials.length) {
                  vueVars.ordered_materials = reduced_ordered_materials
                  vueVars.generated = 1
                }

            },

            reduceOrderedMaterials: function() {
              let ordered_materials = this.materials.filter(function(material) {
                if (material.new_order > 0) {
                  material.ordered = material.new_order
                  return material
                }
              })

              return ordered_materials
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

            querySupplierStock: function() {
              var vueVars = this;
              var url = '/db/querySupplierStock/' + this.supplier_id;

              axios.get(url)
                .then (function (response) {
                  vueVars.received_data = 1
                  vueVars.materials = response.data
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
            this.querySupplier()
            this.querySupplierStock()
        }

    }

</script>

<style>


</style>