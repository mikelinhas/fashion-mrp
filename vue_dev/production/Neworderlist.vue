<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortByColor()"  :class="{ active: sortKey == 'color' }" class="color">
              Color
            </th>
            <th @click="sortBySize()"  :class="{ active: sortKey == 'size' }" class="talla">
              Size
            </th>
            <th @click="sortByOrdered()"  :class="{ active: sortKey == 'ordered' }" class="pedidos">
              Ordered
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredItems">
            <td> {{item.color}} </td>
            <td> {{item.size}} </td>
            <td> {{item.ordered}} </td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 

    export default {
        name: 'Neworderlist',

        props: {
            items: Array,
            colorFilter: String,
            sizeFilter: String 
        },

        data() {
            return {
              sortKey: '',
              sortOrder: 1,
              sizeOrder: ["XS", "S", "M", "L", "XL"],
              filteredItems: []
            }
        },

        components: {},

        beforeMount() {
            this.filterItems()
            this.initialSort()
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

        methods: {

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

</style>