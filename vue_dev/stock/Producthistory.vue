<template>

    <div>

      <h2 style="margin-bottom: 20px"> 
        Historic changes in stock 
      </h2>   

      <table class="table table-hover" >

        <thead>
          <tr>
            <th> Date </th>
            <th> Time </th>
            <th> Change in stock </th>
            <th> Stock </th>
            <th> Previous Stock </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="log in logs" >
            <td> {{log.updated_at | date}} </td>
            <td> {{log.updated_at | time}} </td>
            <td> {{log.change_in_stock}} </td>
            <td> {{log.stock}} </td>
            <td> {{log.previous_stock}} </td>
          </tr>
        </tbody>

      </table>  

      <p>{{errorMessage}}</p>

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Producthistory',

      props: {
          product_id: Number
      },

      data() {
        return {
          logs: {},
          errorMessage: ''
        }        
      },

  		methods: {


        queryProductHistory: function() {
          var vueVars = this;
          var url = '/db/queryItemHistory/' + this.product_id;

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
            this.queryProductHistory()
        }

    }

</script>

<style>

</style>