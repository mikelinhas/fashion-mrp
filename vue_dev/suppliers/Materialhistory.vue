<template>

    <div>

      <h2> Historial de cambios de stock </h2>   

      <table class="table table-hover" style>

        <thead>
          <tr>
            <th> Fecha </th>
            <th> Almacén </th>
            <th> Stock en almacén </th>
            <th> Stock total </th>
            <th> Cambio en stock </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="log in logs" >
            <td> {{log.updated_at | date}} </td>
            <td> {{log.warehouse_id}} - {{log.warehouse_name}} </td>
            <td> {{log.warehouse_stock}} {{log.measure_unit}} </td>
            <td> {{log.total_stock}} {{log.measure_unit}} </td>
            <td> {{log.change_in_stock}} {{log.measure_unit}}</td>
          </tr>
        </tbody>

      </table>  

      <p>{{errorMessage}}</p>

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Materialhistory',

      props: {
          material_id: Number
      },

      data() {
        return {
          logs: {},
          errorMessage: ''
        }        
      },

  		methods: {

        queryMaterialHistory: function() {
          var vueVars = this;
          var url = '/db/queryMaterialHistory/' + this.material_id;

          axios.get(url)
            .then (function (response) {
              vueVars.logs = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
          }
        },

        filters: {
            date: function (val) {
              let date = new Date(val)
              let day = ('0' + date.getDate()).slice(-2)
              let month = ('0' + date.getMonth()).slice(-2)
              let year = date.getFullYear()
              let formatted_date = day + " - " + month + " - " + year
              return formatted_date
            },

            time: function(val) {
              let date = new Date(val)
              let hour = ('0' + date.getHours()).slice(-2)
              let minute = ('0' + date.getMinutes()).slice(-2)
              let time = hour + ":" + minute
              return time
            }
        },

        mounted() {
        },

        beforeMount() {
            this.queryMaterialHistory()
        }

    }

</script>

<style>

</style>