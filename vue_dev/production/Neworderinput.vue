<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortByColor()"  :class="{ active: sortKey == 'color' }" class="color">
              Color
            </th>
            <th @click="sortBySize()"  :class="{ active: sortKey == 'size' }" class="talla">
              Talla
            </th>
            <th @click="sortByStock()"  :class="{ active: sortKey == 'stock' }" class="stock">
              Stock
            </th>
            <th @click="sortByOrdered()"  :class="{ active: sortKey == 'ordered' }" class="pedidos">
              Pedidos
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredItems" 
              :class="{ stockalert: item.stock <= stockAlert,
                        stockalert2: (item.stock <= stockAlert2 && item.stock > stockAlert)
                      }">
            <td> {{item.color}} </td>
            <td> {{item.size}} </td>
            <td> {{item.stock}} </td>
            <td v-if="item.edit == 1" class="new-order-cell">
              <input class="new-order" type="number" :placeholder="item.ordered" v-model="item.new_order">
              <button @click="addOrder(index, item.new_order)">+</button>
            </td>
            <td @click="editOrder(index)" v-else> {{item.ordered - item.received | minimumIsZero }} <span v-if="item.new_order > 0" style="color: green">+ {{item.new_order}}</span> </td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 

    export default {
        name: 'Neworderinput',

        props: {
            items: Array,
            colorFilter: String,
            sizeFilter: String        },

        data() {
            return {
              columns: ['color','size','stock','ordered'],
              sortKey: '',
              sortOrder: 1,
              sizeOrder: ["XS", "S", "M", "L", "XL"],
              filteredItems: [],
              stockAlert2: 15,
              stockAlert: 5
            }
        },

        components: {},

        beforeMount() {
            this.filterItems()
            this.initialSort()
            for (var i = this.items.length - 1; i >= 0; i--) {
              if (!("edit" in this.items[i])) {
                this.$set(this.items[i], 'edit', 0)
              }
              if (!("new_order" in this.items[i])) {
                this.$set(this.items[i], 'new_order', 0)
              }
            }
        },

        watch: {
          colorFilter: function (str) {
            var colorFilter = str && str.toLowerCase()
            this.filteredItems = this.items.filter(function (row) {
              return String(row['color']).toLowerCase().indexOf(colorFilter) > -1
            })
            this.sortKey = ''           
          },
          sizeFilter: function (str) {
            var sizeFilter = str && str.toLowerCase()
            if (str) {
              this.filteredItems = this.items.filter(function (row) {
                return row['size'].toLowerCase() == sizeFilter
              })
            } else {
              this.filteredItems = this.items
            }
            this.sortKey = ''           
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
          capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
          }
        },
        
        methods: {

          editOrder: function(index) {
            this.filteredItems[index].edit = 1
          },

          addOrder: function(index, number) {
            this.filteredItems[index].edit = 0
          },

          filterItems: function () {
            var sortKey = this.sortKey
            var colorFilter = this.colorFilter && this.colorFilter.toLowerCase()
            var sizeFilter = this.sizeFilter && this.sizeFilter.toLowerCase()
            var order = this.sortOrder
            this.filteredItems = this.items
          },

          initialSort: function() {
            this.sortKey = "color"

            this.sizeOrder = ["XS", "S", "M", "L", "XL"] 
            var sizeOrder = this.sizeOrder


            this.filteredItems.sort(function (item1, item2) {

              // Sort by color
              if (item1.color > item2.color) return -1;
              if (item1.color < item2.color) return 1;

              // If the color is the same between both items, sort by size
              if (sizeOrder.indexOf(item1.size) > sizeOrder.indexOf(item2.size)) return 1;
              if (sizeOrder.indexOf(item1.size) < sizeOrder.indexOf(item2.size)) return -1;

            });

            this.sortKey = ""          
          },
          sortByColor: function() {
            if (this.sortKey == "color") {
              this.sortOrder = this.sortOrder*-1
            } else {
              this.sortKey = "color"
              this.sortOrder = 1
            }

            var order = this.sortOrder
            this.sizeOrder = ["XS", "S", "M", "L", "XL"] 
            var sizeOrder = this.sizeOrder


            this.filteredItems.sort(function (item1, item2) {

              // Sort by color
              if (item1.color > item2.color) return -1*order;
              if (item1.color < item2.color) return 1*order;

              // If the color is the same between both items, sort by size
              if (sizeOrder.indexOf(item1.size) > sizeOrder.indexOf(item2.size)) return 1;
              if (sizeOrder.indexOf(item1.size) < sizeOrder.indexOf(item2.size)) return -1;

            });          
          },

          sortBySize: function() {

            var sizeOrder = this.sizeOrder

            if (this.sortKey == "size") {
              sizeOrder.reverse()
            } else {
              this.sortKey = "size"
            }
            
            var order = this.sortOrder

            this.filteredItems.sort(function(item1,item2) {

              //Sort by size
              if (sizeOrder.indexOf(item1.size) > sizeOrder.indexOf(item2.size)) return 1;
              if (sizeOrder.indexOf(item1.size) < sizeOrder.indexOf(item2.size)) return -1;

              // If the size is the same between both items, sort by color
              if (item1.color > item2.color) return 1;
              if (item1.color < item2.color) return -1;

            });
          },

          sortByStock: function() {

            if (this.sortKey == "stock") {
              this.sortOrder = this.sortOrder*-1
            } else {
              this.sortOrder = 1
              this.sortKey = "stock"
            }

            var order = this.sortOrder

            this.filteredItems.sort(function(item1,item2) {
              //Sort by stock
              if (Number(item1.stock) > Number(item2.stock)) return 1*order;
              if (Number(item1.stock) < Number(item2.stock)) return -1*order;
            });

          },

          sortByOrdered: function() {


            if (this.sortKey == "ordered") {
              this.sortOrder = this.sortOrder*-1
            } else {
              this.sortOrder = 1
              this.sortKey = "ordered"
            }
            
            var order = this.sortOrder


            this.filteredItems.sort(function(item1,item2) {

              //Sort by ordered
              if (Number(item1.ordered) > Number(item2.ordered)) return -1*order;
              if (Number(item1.ordered) < Number(item2.ordered)) return 1*order;

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