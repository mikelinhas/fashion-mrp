<template>

  <div>
    <button @click="getData()">Download Production CSV</button>

    <p>{{errorMessage}}</p>

  </div>

</template>

<script> 
  import axios from 'axios'

  export default {
    name: 'Productiondata',

    props: {
    },

    data() {
      return {
      errorMessage: ''
      }
    },

    components: {},

    methods: {
      getData: function() {
        var vueVars = this;
        var url = 'db/getProductionCSV';

        axios.get(url)
          .then (function (response) {
            var csv = response.data
            const url = window.URL.createObjectURL(new Blob([csv]))
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", "production.csv")
            document.body.appendChild(link)
            link.click()
          })
          .catch(function (error) {
            vueVars.errorMessage = "There has been an Error! Oh no.."
            console.log(error);
          })           
      }
    }

  }

</script>

<style>

</style>