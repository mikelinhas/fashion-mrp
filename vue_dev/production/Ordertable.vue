<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('color')"  :class="{ active: sortKey == 'color' }" class="color">
              Color
            </th>
            <th @click="sortBy('size')"  :class="{ active: sortKey == 'size' }" class="talla">
              Size
            </th>
            <th @click="sortBy('ordered')"  :class="{ active: sortKey == 'ordered' }" class="cantidad">
              Quantity
            </th>
            <th @click="sortBy('finished')" :class="{ active: sortKey == 'finished' }"  class="pedidos">
              Sent
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredItems" >
            <td> {{item.color}} </td>
            <td> {{item.size}} </td>

            <td v-if="item.modify == 1" class="new-stock-cell">
              <input class="new-stock" type="number" :placeholder="item.ordered" v-model="item.ordered">
              <span :class="{ added: item.previous_ordered < item.ordered, subtracted: item.previous_ordered > item.ordered }" 
                    > {{item.ordered - item.previous_ordered | stringify}} </span>
              <button @click="modifyOrder(item)">+</button>
            </td>
            <td @click="editOrdered(index)" v-else> {{item.ordered}} 
              <span :class="{ added: item.previous_ordered < item.ordered, subtracted: item.previous_ordered > item.ordered }" 
                    > {{item.ordered - item.previous_ordered | stringify}} </span>
            </td>


            <td v-if="item.edit == 1" class="new-stock-cell">
              <input class="new-stock" type="number" :placeholder="item.finished" v-model="item.finished">
              <span :class="{ added: item.previous_finished < item.finished, subtracted: item.previous_finished > item.finished }" 
                    > {{item.finished - item.previous_finished | stringify}} </span>
              <button @click="updateOrder(item)">+</button>
            </td>
            <td @click="editFinished(index)" v-else> {{item.finished}} 
              <span :class="{ added: item.previous_finished < item.finished, subtracted: item.previous_finished > item.finished }" 
                    > {{item.finished - item.previous_finished | stringify}} </span>
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
            ordered_items: Array ,
            order_number: Number
          },

        data() {
            var sortOrders = {}
            var columns = ['color', 'size', 'ordered', 'finished']
            columns.forEach(function (key) {
              sortOrders[key] = 1
            })
            return {
              sortKey: '',
              sortOrders: sortOrders
            }
        },

        beforeMount() {
          var vueVars = this
          vueVars.ordered_items.forEach( function(item) {
            let previous_finished = Number(item.finished)
            vueVars.$set(item, 'previous_finished', previous_finished)
            vueVars.$set(item, 'virtual_finished', previous_finished)
            vueVars.$set(item, 'edit', 0)
            let previous_ordered = Number(item.ordered)
            vueVars.$set(item, 'previous_ordered', previous_ordered)
            vueVars.$set(item, 'virtual_ordered', previous_ordered)
            vueVars.$set(item, 'modify', 0)
          })
        },

        components: {},

        computed: {
            filteredItems: function () {
              var sortKey = this.sortKey
              var order = this.sortOrders[sortKey] || 1
              var items = this.ordered_items
              if (sortKey) {
                items = items.slice().sort(function (a, b) {
                  a = a[sortKey]
                  b = b[sortKey]
                  return (a === b ? 0 : a > b ? 1 : -1) * order
                })
              }
              return items
            }
        },

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
            editFinished: function(index) {
              this.filteredItems[index].edit = 1
            },

            editOrdered: function(index) {
              this.filteredItems[index].modify = 1
            },

            sortBy: function (key) {
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1
            },

            modifyOrder: function(item) {
              var vueVars = this
              var url = '/db/updateOrder_Ordered'
              var difference = item.ordered - item.virtual_ordered

              if (difference == 0) {
                console.log("same...")
                item.modify = 0
                return
              }

              axios.post(url, {
                order_number: this.order_number,
                product_id: item.product_id,
                difference: difference
              })
                .then(function (response) {
                  item.virtual_ordered = item.ordered
                  item.modify = 0
                })
                .catch(function (error) {
                  alert("ERROR")
                });
            },

            updateOrder: function(item) {
              var vueVars = this
              var url = '/db/updateOrder_Finished'
              var difference = item.finished - item.virtual_finished

              if (difference == 0) {
                console.log("same...")
                item.edit = 0
                return
              }
              axios.post(url, {
                order_number: this.order_number,
                product_id: item.product_id,
                difference: difference
              })
                .then(function (response) {
                  item.virtual_finished = item.finished
                  item.edit = 0
                })
                .catch(function (error) {
                  alert("ERROR")
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