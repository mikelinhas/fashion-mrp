<template>

    <div>
      <div class="sticky-top-container">
          <button class="btn btn-danger sticky-top" @click="deleteProduct()"><i style="padding: 2px" class="fa fa-trash"></i> Delete from database </button>
      </div>
      
      <transition name="slide-fade">
        <h2 v-if="deleted" style="color: red">Deleted from database</h2>
      </transition>
      
      <h2> {{product.name}}  -  {{product.color}}  -  {{product.size}} </h2>   
      <h3> {{product.category}} </h3>  

      <p>{{errorMessage}}</p>

    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Productinfo',

      props: {
          product_id: Number
      },

      data() {
        return {
          product: {},
          errorMessage: '',
          deleted: 0
        }        
      },

  		methods: {

        queryProduct: function() {
          var vueVars = this;
          var url = '/db/queryProductByID/' + this.product_id;

          axios.get(url)
            .then (function (response) {
              vueVars.product = response.data
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        },

        deleteProduct: function() {
          var vueVars = this;
          var url = '/db/deleteProduct';

          axios.post(url, {
            product_id: this.product_id
            })            
            .then (function (response) {
              vueVars.deleted = 1
              setTimeout(function(){ window.location.href = "/stock" }, 1000);
                
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            })
        }
      },

      mounted() {
      },

      beforeMount() {
          this.queryProduct()
      }

    }

</script>

<style>

</style>