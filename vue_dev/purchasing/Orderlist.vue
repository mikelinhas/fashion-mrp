<template>

    <div>
        <p style="margin-bottom: -20px">Created on  {{order.created_at | dateify }}</p>
        <div class="sticky-top-container">
            <button class="btn btn-default sticky-top hide-print" @click="printOrder()"><i style="padding: 2px;" class="fa fa-print"></i></button>
        </div>
        <h2 style="margin-top: 30px">{{order.supplier_name}}</h2>

        <br><br><br>

        <div class="ordered-table">
          <h2 class="hide-print">
            Total price: {{order.total_price + totalPriceDiff | currency}} 
            <span :class="{ added: totalPriceDiff > 0, subtracted: totalPriceDiff < 0 }"> 
              {{totalPriceDiff | currenstringify}} 
            </span>
          </h2>
          <p class="hide-print">Estimated reception date:  
            <datepicker v-model="order.delivery_date" format="dd/MM/yy"></datepicker>
            <button class="btn btn-default" @click="updateDeliveryDate()"><i style="padding: 2px 3px;" class="fa fa-level-up"></i></button>          
          </p>

          <br>

          <Ordertable 
              v-if="received_data == 1" 
              :purchase_number="order.purchase_number" 
              :ordered_materials="order.materials">    
           </Ordertable>        
        </div>

        <br>

        <Receivedtable
            class="received-table hide-print"
            v-for="warehouse in warehouses"
            :purchase_number="order.purchase_number" 
            :warehouse="warehouse">    
         </Receivedtable> 

        <br>
        <div class="container hide-print">

          <form v-on:submit.prevent autocomplete="off">

            <button @click="receiveMaterial()" class="btn btn-default" style="margin-top: 3px">
              <i style="padding: 2px;" class="fa fa-arrow-circle-right"></i>
              Recepcionar material
            </button>

            <div class="col-md-4">
              <v-select :options="availableProducers"
                        label="name"
                        v-model="selected_producer"
                        placeholder="Elige un productor (almacén)">
              </v-select>
            </div>

          </form>

        </div>


        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Ordertable from './Ordertable.vue'
    import Receivedtable from './Receivedtable.vue'
    import Datepicker from "vuejs-datepicker"
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';

    export default {
      name: 'Orderlist',

      props: {
          purchase_number: String
      },

      data() {
        return {
          order: [],
          reveived_data: 0,
          reveived_producers: 0,
          warehouses: [],
          producers: [],
          selected_producer: '',
          errorMessage: ''
        }        
      },

      components: {Ordertable, Datepicker, Receivedtable, vSelect},

      computed: {
        totalPriceDiff: function() {
          if (this.order.materials) {
            let total = this.order.materials.reduce(function(acc, material){
              let previous_price = Number(material.previous_price) * Number(material.previous_ordered)
              let new_price = Number(material.unit_price) * Number(material.ordered)
              return acc + new_price - previous_price
            }, 0)
            return total
          } else {
            return 0
          }
        },

        availableProducers: function () {
          let producers = this.producers
          let warehouses = this.warehouses.map(function(warehouse){
            return warehouse.warehouse_id
          })

          let available_producers = producers.filter(function(producer){
            return !warehouses.includes(producer._id);
          })

          return available_producers
        }
      },

  		methods: {

        receiveMaterial: function() {
          var vueVars = this
          var url = '/db/startReceivedinWarehouse/'

          let materials = []

          this.order.materials.forEach(function(material){
            let obj = { "material_id" : material.material_id,
                        "name" : material.name,
                        "measure_unit" : material.measure_unit,
                        "external_ref" : material.external_ref,
                        "received" : 0 }
            materials.push(obj)
          })

          let warehouse_object = {
            "_id" : this.order.purchase_number + "--" +  this.selected_producer._id,
            "warehouse_name" : this.selected_producer.name,
            "warehouse_id" : this.selected_producer._id,
            "purchase_number" : this.order.purchase_number,
            "supplier_id" : this.order.supplier_id,
            "supplier_name" : this.order.supplier_name,
            "materials" : materials
          }

          if (!this.selected_producer) {
            console.log("no producer selected...")
            return
          }

          if (confirm("¿Quieres añadir el almacén de " + this.selected_producer.name + " a este pedido?")) {
            axios.post(url, {
              warehouse_object: warehouse_object
            })
              .then (function (response) {
                window.location.href = "/purchasing/" + vueVars.purchase_number
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })
          } 

        },

        printOrder: function() {
          window.print();
        },

        updateDeliveryDate: function() {
          var vueVars = this
          var url = '/db/updatePurchaseOrder_Date'

          if (confirm("¿Quieres actualizar la fecha del pedido?")) {
            axios.post(url, {
              purchase_number: vueVars.purchase_number,
              delivery_date: vueVars.order.delivery_date
            })
              .then (function (response) {
                window.location.href = "/purchasing/" + vueVars.purchase_number
              })
              .catch(function (error) {
                vueVars.errorMessage = "There has been an Error! Oh no.."
                console.log(error);
              })
          } 
        },

        queryPurchaseOrder: function() {
          var vueVars = this;
          var url = '/db/queryPurchaseOrder/' + this.purchase_number;

          axios.get(url)
            .then (function (response) {
              vueVars.order = response.data
              vueVars.received_data = 1;
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        queryReceivedFromOrder: function() {
          var vueVars = this;
          var url = '/db/queryReceivedFromOrder/' + this.purchase_number;

          axios.get(url)
            .then (function (response) {
              vueVars.warehouses = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        queryProducers: function() {
          var vueVars = this;
          var url = '/db/getProducers';

          axios.get(url)
            .then (function (response) {
              vueVars.producers = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },
      },

      filters: {
          dateify: function (str) {
            var date  = new Date(str);
            return date.toLocaleDateString()
          },

          currenstringify: function(val) {
            let num = Number(val)
            if (num > 0 ) {
              return "(+" + num.toFixed(2) + ")"
            }
            if (num < 0 ) {
              return "(" + num.toFixed(2) + ")"
            } 
          },

          currency: function(val) {
            if (val) {
              return val.toFixed(2) + " €"
            }
          }
      },

      beforeMount() {
          this.queryPurchaseOrder()
          this.queryReceivedFromOrder()
          this.queryProducers()
      }

    }

</script>

<style>

.received-table {
  margin: 30px 20px 0px 20px;
  padding: 20px;
  border: 1px solid #e9d0c3;
  border-radius: 4px;
}


.ordered-table {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.vdp-datepicker {
  display: inline-block !important;
}

.vdp-datepicker div input {
  text-align: center;
}

.day:hover {
  border-color: #e9d0c3 !important;

}

span.selected {
  background: #e9d0c3 !important;
}

.added {
  color: green;
  padding: 8px;
}

.subtracted {
  color: red;
  padding: 8px;
}


</style>