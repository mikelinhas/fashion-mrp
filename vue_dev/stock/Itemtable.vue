<template>

    <div>
      <h2 v-if="filteredItems.length > 0">{{category}} | {{name}}</h2>
      <table class="table table-hover" v-if="filteredItems.length > 0">

        <thead>
          <tr>
            <th @click="sortByColor()"  :class="{ active: sortKey == 'color' }" class="color">
              Color
            </th>
            <th @click="sortBySize()"  :class="{ active: sortKey == 'size' }" class="talla">
              Size
            </th>
            <th @click="sortByStock()"  :class="{ active: sortKey == 'stock' }" class="stock">
              Stock
            </th>
            <th @click="sortByOrdered()"  :class="{ active: sortKey == 'ordered' }" class="pedidos">
              Ordered
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredItems" 
              :class="{ stockalert: item.stock <= stockAlert,
                        stockalert2: (item.stock <= stockAlert2 && item.stock > stockAlert),
                        stockalert3: (item.stock <= stockAlert3 && item.stock > stockAlert2)
                      }">
            <td> <a class="subtle_link" @click="link(item._id)">{{item.color}}</a></td>
            <td class="center"> {{item.size}} </td>

            <td v-if="item.edit == 1" class="new-stock-cell">
              <input class="new-stock" type="number" :placeholder="item.stock" v-model="item.stock">
              <span :class="{ added: item.previous_stock < item.stock, subtracted: item.previous_stock > item.stock }" 
                    > {{item.stock - item.previous_stock | stringify}} </span>
              <button @click="updateStock(item)">+</button>
            </td>
            <td @click="editStock(index)" v-else> {{item.stock}} 
              <span :class="{ added: item.previous_stock < item.stock, subtracted: item.previous_stock > item.stock }" 
                    > {{item.stock - item.previous_stock | stringify}} </span>
            </td>
            <td> {{(item.ordered - item.received) | minimumIsZero}} </td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 

    import axios from 'axios'

    export default {

        name: 'Itemtable',

        props: {
            category: '',
            name:'',
            items: Array,
            colorFilter: String,
            sizeFilter: String
        },

        data() {
            return {
              columns: ['color','size','stock','ordered'],
              sortKey: '',
              sortOrder: 1,
              sizeOrder: ["XS", "S", "M", "L", "XL"],
              filteredItems: [],
              stockAlert3: 15,
              stockAlert2: 5,
              stockAlert: 0
            }
        },

        components: {},

        beforeMount() {
          var vueVars = this
          vueVars.filterItems()
          vueVars.initialSort()
          vueVars.items.forEach( function(item) {
            let previous_stock = Number(item.stock)
            vueVars.$set(item, 'previous_stock', previous_stock)
            vueVars.$set(item, 'virtual_stock', previous_stock)
            vueVars.$set(item, 'edit', 0)
          })
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
                return String(row['size']).toLowerCase() == sizeFilter
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

            stringify: function(val) {
              if (val > 0 ) {
                return "(+" + val + ")"
              }
              if (val < 0 ) {
                return "(" + val + ")"
              } 
            },

            capitalize: function (str) {
              return str.charAt(0).toUpperCase() + str.slice(1)
            }
        },

        
        methods: {

          editStock: function(index) {
            this.filteredItems[index].edit = 1
          },

          link: function(id) {
            window.location.href = "/stock/" + id
          },

          updateStock: function(item) {
            var vueVars = this
            var url = '/db/updateProductStock'
            let difference = item.stock - item.virtual_stock

            if (difference == 0) {
              console.log("same...")
              item.edit = 0
              return
            }

            axios.post(url, {
              product_id: item._id,
              difference: difference
            })
              .then(function (response) {
                item.virtual_stock = item.stock
                item.edit = 0
              })
              .catch(function (error) {
                alert("ERROR")
              });

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
              this.sortOrder = this.sortOrder*-1
              sizeOrder.reverse()
            } else {
              this.sortKey = "size"
              this.sortOrder = 1
            }
            
            var order = this.sortOrder

            this.filteredItems.sort(function(item1,item2) {

              //Sort by clothing size
              if (sizeOrder.indexOf(item1.size) > sizeOrder.indexOf(item2.size)) return 1;
              if (sizeOrder.indexOf(item1.size) < sizeOrder.indexOf(item2.size)) return -1;

              //Sort by shoe size
              if (item1.size > item2.size) return 1*order;
              if (item1.size < item2.size) return -1*order;

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

.subtle_link {
  cursor : pointer;
}

.added {
  color: green;
  padding: 8px;
}

.subtracted {
  color: red;
  padding: 8px;
}

.new-stock-cell {
  padding: 0px !important;
}
.new-stock {
  width: 80px;
  height: 37px;
  padding: 0px;
  padding-left: 10px;
}

.stockalert {
  background: #fcded0;
}

.stockalert:hover {
  background: #f1d5c8 !important
}

.stockalert2 {
  background: #fbe0bfba;
}

.stockalert2:hover {
  background: #e8d2b6ba !important
}

.stockalert3 {
  background: #fbf6e1;
}

.stockalert3:hover {
  background: #e6e2ce !important
}
</style>