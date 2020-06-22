<template>

    <div>
        <p>Creado el  {{order_date | dateify }}</p>
        <p v-if="latest_modification">Modificado el  {{latest_modification | dateify }}</p>
        <div class="toggle-button-container hide-print">
            <button class="btn btn-default" @click="printOrder()"><i style="padding: 2px" class="fa fa-print"></i></button>
        </div>

        <div v-for="category in categoryGroups" style="padding-top: 35px">
            <div v-for= "group in category.nameGroups">
                <h2>{{group.category}} | {{group.name}}</h2>
                <Ordertable 
                    :order_number="order_number" 
                    :ordered_items="group.ordered_items">    
                 </Ordertable>        
                <br>
            </div>
        </div>
        
        <p>{{errorMessage}}</p>
    </div>

</template>

<script> 
    import axios from 'axios'
    import Ordertable from './Ordertable.vue'

    export default {
      name: 'Orderlist',

      props: {
          order_number: String
      },

      data() {
        return {
          categoryGroups: [],
          order_date: "",
          errorMessage: ''
        }        
      },

      components: {Ordertable},

      methods: {

        printOrder: function() {
          window.print();
        },

        getLatestDate: function(dates) {
          if (dates) {
            let latest = dates.length - 1
            return dates[latest]
          } else {
            return 0
          }
        },

        queryProductionOrderDate: function() {
          var vueVars = this;
          var url = '/db/queryOrderDate/' + this.order_number;

          axios.get(url)
            .then (function (response) {
              let date = new Date(response.data.date)
              vueVars.order_date = date
              vueVars.latest_modification = vueVars.getLatestDate(response.data.modified_at)
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        queryProductionOrder: function() {
          var vueVars = this;
          var url = '/db/queryOrder/' + this.order_number;

          axios.get(url)
            .then (function (response) {
              var categoryGroups = []
              for (var i = response.data.length - 1; i >= 0; i--) {
                let category = {"category" : response.data[i].category}
                let data = {"nameGroups": response.data[i].name_groups}
                let object = {...category, ...data}
                categoryGroups[i] = object
              }
              vueVars.categoryGroups = categoryGroups
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        }
      },

      filters: {
          dateify: function (str) {
            var date  = new Date(str);
            return date.toLocaleDateString()
          }
      },

      mounted() {
      },

      beforeMount() {
          this.queryProductionOrder()
          this.queryProductionOrderDate()
      }

    }

</script>

<style>

</style>