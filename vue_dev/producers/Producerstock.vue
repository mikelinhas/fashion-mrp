<template>

    <div>

      <p>{{supplier._id}} - {{supplier.name}}</p>  

      <table class="table table-hover" style>

        <thead>
          <tr>
            <th></th>
            <th @click="sortBy('external_ref')"  :class="{ active: sortKey == 'external_ref' }" class="table-col-3"> Referencia </th>
            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-3"> Artículo </th>
            <th @click="sortBy('stock')"  :class="{ active: sortKey == 'stock' }" class="table-col-3"> Stock </th>
            <th @click="sortBy('in_production')"  :class="{ active: sortKey == 'in_production' }" class="table-col-3"> En Producción </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="material in materials" >
            <td @click="toggleShow(material)">
              <i v-if="material.show" class="fa fa-caret-down"></i> 
              <i v-if="!material.show" class="fa fa-caret-right"></i> 
            </td>
            <td> <a class="subtle_link" @click="link(material)"> {{material.external_ref}} </a> </td>
            <td> {{material.name}}</td>

            <td v-if="material.edit == 1" class="new-stock-cell">
              <input class="new-stock" type="number" :placeholder="material.stock" v-model="material.stock">
              <span :class="{ added: material.previous_stock < material.stock, subtracted: material.previous_stock > material.stock }" 
                    > {{material.stock - material.previous_stock | stringify}} </span>
              <button @click="updateMaterial(material)">+</button>
            </td>

            <td @click="editMaterial(material)" v-else> {{material.stock}} {{material.measure_unit}}
              <span :class="{ added: material.previous_stock < material.stock, subtracted: material.previous_stock > material.stock }" 
                    > {{material.stock - material.previous_stock | stringify}} </span>
            </td>

            <td> {{calculateInProduction(material.in_production)}} {{material.measure_unit}} 
              <div v-if="material.show" class="between-rows" v-for="order in material.in_production"> {{order.quantity}} {{material.measure_unit}} - {{order.order_number}}</div>
            </td>  
          </tr>
        </tbody>

      </table>  

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Producerstock',

      props: {
          producer: {},
          materials: [],
          supplier: {}
      },

      data() {
        var sortMaterials = {}
        var columns = ['external_ref', 'name','stock','in_production']
        columns.forEach(function(key){
          sortMaterials[key] = 1
        })
        return {
          sortKey: '',
          sortMaterials: sortMaterials,
          materials: [],
          new_material: [],
          errorMessage: ''
        }        
      },

  		methods: {
        link: function(material) {
          let id = material._id
          let supplier_id = material.supplier_id
          window.location.href = "/suppliers/" + supplier_id + "/" + id
        },

        toggleShow: function(material) {
          material.show = !material.show
        },


        calculateInProduction: function(arr) {
          let total = arr.reduce(function(acc, order) {
              return acc + order.quantity
          }, 0)
          return total
        },

        cleanInProductionArray: function() {
          this.materials.forEach(function(material){
            let in_production = material.in_production.filter(function (producer) {
              return producer.producer_id != null;
            });
            material.in_production = in_production
          })
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

        editMaterial: function(material) {
          material.edit = 1
        },

        updateMaterial: function(material) {
          var vueVars = this
          var url = '/db/updateMaterialStock'
          var data = {"material": material, "producer": this.producer}

          axios.post(url, data)
            .then(function (response) {
              material.edit = 0
            })
            .catch(function (error) {
              alert("ERROR")
            });
          }

        },


        filters: {
            dateify: function (str) {
              if (str) {
                var date  = new Date(str);
                return date.toLocaleDateString()
              } else {
                return "no info"
              }
            },

            stringify: function(val) {
              if (val > 0 ) {
                return "(+" + val + ")"
              }
              if (val < 0 ) {
                return "(" + val + ")"
              } 
            }
        },

        mounted() {
        },

        beforeMount() {
          let vueVars = this
          vueVars.materials.forEach( function(material) {
            let previous_stock = Number(material.stock)
            vueVars.$set(material, 'previous_stock', previous_stock)
            vueVars.$set(material, 'edit', 0)
            vueVars.$set(material, 'show', 0)
          })
          vueVars.cleanInProductionArray()
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
</style>