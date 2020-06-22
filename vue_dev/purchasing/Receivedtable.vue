<template>

    <div>
      <h2>
        <i class="fa fa-arrow-circle-right"></i>
        {{warehouse.warehouse_name}} - {{warehouse.warehouse_id}}
      </h2>

      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-4">
              Referencia
            </th>
            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-4">
              Artículo
            </th>
            <th @click="sortBy('received')" :class="{ active: sortKey == 'received' }"  class="table-col-4">
              Cantidad recibida
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in warehouse.materials" >
            <td> {{item.external_ref}} </td>
            <td> {{item.name}} </td>

            <td v-if="item.edit == 1" class="new-stock-cell">
              <input class="new-stock" type="number" :placeholder="item.received" v-model="item.received">
              <span :class="{ added: item.previous_received < item.received, subtracted: item.previous_received > item.received }" 
                    > {{item.received - item.previous_received | stringify}} </span>
              <button @click="updateOrder(item)">+</button>
            </td>
            <td @click="editReceived(item)" v-else> {{item.received}} {{measure_unit}}
              <span :class="{ added: item.previous_received < item.received, subtracted: item.previous_received > item.received }" 
                    > {{item.received - item.previous_received | stringify}} </span>
            </td>

          </tr>

        </tbody>

      </table>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
        name: 'Receivedtable',

        props: {
            purchase_number: '',
            warehouse: Object
          },

        data() {
            var sortMaterials = {}
            var columns = ['external_ref', 'name', 'received']
            columns.forEach(function (key) {
              sortMaterials[key] = 1
            })
            return {
              sortKey: '',
              sortMaterials: sortMaterials
            }
        },

        beforeMount() {
          this.initiateArray()
        },

        components: {},

        filters: {
            yesnoify: function (val) {
              if (val) {
                return "Si"
              } else {
                return "No"
              }
            },

            stringify: function(val) {
              if (val > 0 ) {
                return "(+" + val + ")"
              }
              if (val < 0 ) {
                return "(" + val + ")"
              } 
            },
        },
        
        methods: {

            initiateArray: function() {
              var vueVars = this
              vueVars.warehouse.materials.forEach( function(item) {
                let previous_received = Number(item.received)
                vueVars.$set(item, 'previous_received', previous_received)
                vueVars.$set(item, 'edit', 0)
              })
            },

            editReceived: function(item) {
              item.edit = 1
            },

            updateOrder: function(item) {
              var vueVars = this
              var url = '/db/updateWarehouse_PurchaseReceived'

              let warehouse_info = {id: this.warehouse.warehouse_id, name: this.warehouse.warehouse_name}

              var data = {"item": item, "purchase_number":this.purchase_number, 
                          "warehouse": warehouse_info}

              axios.post(url, data)
                .then(function (response) {
                  item.edit = 0
                })
                .catch(function (error) {
                  alert("ERROR")
                });
            },

            sortBy: function (key) {

                let vueVars = this
                vueVars.sortKey = key
                vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

                vueVars.warehouse.materials.sort(function (item1, item2) {

                  // If undefined key (doesnt sort)
                  if (!item1[key]) {
                    item1[key] = ""
                  }
                  if (!item2[key]) {
                    item2[key] = ""
                  }

                  // Sort by key
                  if (item1[key] > item2[key]) return -1*vueVars.sortMaterials[key];
                  if (item1[key] < item2[key]) return 1*vueVars.sortMaterials[key];

                });

            }

        }

    }

</script>

<style>

.new-stock-cell {
  padding: 0px !important;
}
.new-stock {
  width: 80px;
  height: 37px;
  padding: 0px;
  padding-left: 10px;
}

.added {
  color: green;
  padding: 8px;
}

.subtracted {
  color: red;
  padding: 8px;
}

.finished {
}

.finished:hover {
}
</style>