<template>

    <div>

      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-2">
              Reference
            </th>
            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-2">
              Material
            </th>
            <th @click="sortByStock('stock')"  :class="{ active: sortKey == 'stock' }" class="table-col-2">
              Stock
            </th>
            <th @click="sortByOrdered('ordered')"  :class="{ active: sortKey == 'ordered' }" class="table-col-2">
              Ordered
            </th>
            <th @click="sortBy('unit_price')"  :class="{ active: sortKey == 'unit_price' }" class="table-col-2">
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(material, index) in materials" 
              :class="{ stockalert: material.stock <= stockAlert,
                        stockalert2: (material.stock <= stockAlert2 && material.stock > stockAlert)
                      }">
            <td> {{material.external_ref}} </td>
            <td> {{material.name}} </td>
            <td> {{addStock(material.stock)}} {{material.measure_unit}} </td>
            <td v-if="material.edit == 1" class="new-order-cell">
              <input class="new-order" type="number" :placeholder="material.ordered" v-model="material.new_order">
              <button @click="addOrder(index, material.new_order)">+</button>
            </td>
            <td @click="editOrder(index)" v-else> {{calculateOrdered(material) | minimumIsZero}} {{material.measure_unit}} <span v-if="material.new_order > 0" style="color: green">+ {{material.new_order}}</span> </td>
            <td>{{material.unit_price | currency}}</td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 

  export default {
      name: 'Newpurchaseorderinput',

      props: {
          materials: Array,
          total_price: 0
      },

      data() {
          var sortMaterials = {}
          var columns = ['external_ref', 'name', 'stock', 'ordered', 'unit_price']
          columns.forEach(function (key) {
            sortMaterials[key] = 1
          })
          return {
            sortKey: '',
            sortMaterials: sortMaterials,
            sortOrder: 1,
            stockAlert2: 15,
            stockAlert: 5
          }
      },

      beforeMount() {
          //this.initialSort()
          for (var i = this.materials.length - 1; i >= 0; i--) {
            if (!("edit" in this.materials[i])) {
              this.$set(this.materials[i], 'edit', 0)
            }
            if (!("new_order" in this.materials[i])) {
              this.$set(this.materials[i], 'new_order', 0)
            }
          }
      },

      filters: {
          minimumIsZero: function (val) {
            if (val < 0) {
              return 0
            } else {
              return val
            }
          },

          dateify: function (str) {
            if (str) {
              var date  = new Date(str);
              return date.toLocaleDateString()
            } else {
              return "no info"
            }
          }
      },
      
      methods: {
        addStock: function(stock) {
          let total = stock.reduce(function(acc, warehouse) {
              return acc + warehouse.stock
          }, 0)
          return total
        },

        calculateOrdered: function(material) {
          return material.ordered - material.received
        },

        editOrder: function(index) {
          this.materials[index].edit = 1
        },

        addOrder: function(index, number) {
          this.materials[index].edit = 0
        },

        sortBy: function (key) {

            let vueVars = this
            vueVars.sortKey = key
            vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

            vueVars.materials.sort(function (item1, item2) {

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

        },

        sortByStock: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (vueVars.addStock(item1[key]) > vueVars.addStock(item2[key])) return -1*vueVars.sortMaterials[key];
            if (vueVars.addStock(item1[key]) < vueVars.addStock(item2[key])) return 1*vueVars.sortMaterials[key];

          });
        },

        sortByOrdered: function (key) {
          let vueVars = this
          vueVars.sortKey = key
          vueVars.sortMaterials[key] = vueVars.sortMaterials[key] * -1

          vueVars.materials.sort(function (item1, item2) {

            // If undefined key (doesnt sort)
            if (!item1[key]) {
              item1[key] = ""
            }
            if (!item2[key]) {
              item2[key] = ""
            }

            // Sort by key
            if (vueVars.calculateOrdered(item1) > vueVars.calculateOrdered(item2)) return -1*vueVars.sortMaterials[key];
            if (vueVars.calculateOrdered(item1) < vueVars.calculateOrdered(item2)) return 1*vueVars.sortMaterials[key];

          });
        }
      }
  }

</script>

<style>

.new-order-cell {
  padding: 0px !important;
}
.new-order {
  width: 80px;
  height: 37px;
  padding: 0px;
  padding-left: 10px;
}

.stockalert {
  background: #ffefef;
}

.stockalert:hover {
  background: #ffefef !important
}

.stockalert2 {
  background: #fbf6e1;
}

.stockalert2:hover {
  background: #fbf6e1 !important
}
</style>