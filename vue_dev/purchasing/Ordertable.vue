<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-3">
              Referencia
            </th>
            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-3">
              Artículo
            </th>
            <th @click="sortBy('ordered')"  :class="{ active: sortKey == 'ordered' }" class="table-col-2">
              Cantidad pedida
            </th>
            <th @click="sortBy('received')" :class="{ active: sortKey == 'received' }"  class="hide-print table-col-2">
              Cantidad recibida
            </th>
            <th @click="sortBy('unit_price')" :class="{ active: sortKey == 'unit_price' }"  class="hide-print table-col-2">
              €
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in ordered_materials" >
            <td> {{item.external_ref}} </td>
            <td> {{item.name}} </td>

            <td v-if="item.modify == 1" class="new-cell">
              <input class="new" type="number" :placeholder="item.ordered" v-model="item.ordered">
              <span :class="{ added: item.previous_ordered < item.ordered, subtracted: item.previous_ordered > item.ordered }">
                {{item.ordered - item.previous_ordered | stringify}} 
              </span>
              <button @click="modifyOrder(item)">+</button>
            </td>
            <td @click="editOrdered(item)" v-else> 
              {{item.ordered}} {{item.measure_unit}}
              <span :class="{ added: item.previous_ordered < item.ordered, subtracted: item.previous_ordered > item.ordered }"> 
                {{item.ordered - item.previous_ordered | stringify}}
              </span>
            </td>

            <td class="hide-print"> {{item.received}} {{item.measure_unit}}</td>

            <td v-if="item.edit == 1" class="new-cell hide-print">
              <input class="new" type="number" step="0.01" :placeholder="item.unit_price" v-model="item.unit_price">
              <span :class="{ added: item.previous_price < item.unit_price, subtracted: item.previous_price > item.unit_price }">
                {{item.unit_price - item.previous_price | currenstringify}} 
              </span>
              <button @click="updateOrderPrice(item)">+</button>
            </td>
            <td @click="editPrice(item)" v-else class="hide-print"> 
              {{item.unit_price | currency}}
              <span :class="{ added: item.previous_price < item.unit_price, subtracted: item.previous_price > item.unit_price }"> 
                {{item.unit_price - item.previous_price | currenstringify}} 
              </span>
            </td>
          </tr>

        </tbody>

      </table>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
        name: 'Ordertable',

        props: {
            ordered_materials: Array ,
            purchase_number: Number
          },

        data() {
            var sortMaterials = {}
            var columns = ['external_ref', 'name', 'ordered', 'received', 'unit_price']
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
                let num = Number(val)
                return num.toFixed(2) + " €"
              }
            }
        },
        
        methods: {

            initiateArray: function() {
              var vueVars = this
              vueVars.ordered_materials.forEach( function(item) {
                let unit_price = Number(item.unit_price)
                vueVars.$set(item, 'previous_price', unit_price)
                vueVars.$set(item, 'edit', 0)
                let ordered = Number(item.ordered)
                vueVars.$set(item, 'previous_ordered', ordered)
                vueVars.$set(item, 'modify', 0)
              })
            },

            editPrice: function(item) {
              item.edit = 1
            },

            editOrdered: function(item) {
              item.modify = 1
            },

            modifyOrder: function(item) {
              var vueVars = this
              var url = '/db/updatePurchaseOrder_Ordered'
              var data = {"item": item, "purchase_number":this.purchase_number}

              if (item.ordered == item.previous_ordered) {
                console.log("same...")
                item.modify = 0
                return
              }

              axios.post(url, data)
                .then(function (response) {
                  item.modify = 0
                })
                .catch(function (error) {
                  alert("ERROR")
                });
            },

            updateOrderPrice: function(item) {
              var vueVars = this
              var url = '/db/updatePurchaseOrder_ItemPrice'
              var data = {"item": item, "purchase_number":this.purchase_number}

              if (item.unit_price == item.previous_price) {
                console.log("same...")
                item.edit = 0
                return
              }

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

                vueVars.ordered_materials.sort(function (item1, item2) {

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

.new-cell {
  padding: 0px !important;
}
.new {
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