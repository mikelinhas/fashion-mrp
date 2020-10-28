<template>

    <div>
      <div class="sticky-spacer"></div>

      <div class="row product-create-container">
        
        <form v-on:submit.prevent class="col-md-8">

            <div>
              
              <div style="width: 40%; display:inline-block;">
                <label for="name">Supplier name</label>
                <input type="text" class="form-control" id="name" placeholder="ex. Brief" v-model="supplier.name">
              </div>

              <div style="width: 40%; display:inline-block;">
                <label for="CIF">CIF</label>
                <input type="text" class="form-control" id="CIF" placeholder="" v-model="supplier.CIF">
              </div>

            </div>

            <br>

            <div style="width: 60%; display:inline-block;">
              <label for="description">Description</label>
              <input type="text" class="form-control" id="description" placeholder="" v-model="supplier.description">
            </div>

            <br><br>

            <div style="width: 40%; display:inline-block;">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" :placeholder="emailify" v-model="supplier.email">
            </div>

            <div style="width: 40%; display:inline-block;">
              <label for="phone">Telephone</label>
              <input type="tel" class="form-control" id="phone" :placeholder="650444999" v-model="supplier.phone">
            </div>



        </form>

        <div class="col-md-3" style="margin-top: 20px"> 

              <p>Name : {{supplier.name}} </p>
              <p>CIF : {{supplier.CIF}} </p>
              <p>Description : {{supplier.description}} </p>
              <p>Email : {{supplier.email}} </p>
              <p>Phone : {{supplier.phone}} </p>

              <br>

              <button v-if="ready" class="btn btn-success" @click="createSupplier()">Add to database</button>
              <button v-else class="btn btn-custom">Falta información</button>
        </div>


      </div>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Createsupplier',

      props: {
          categories: []
      },

      data() {
        return {
          supplier: {},
          errorMessage: ''
        }        
      },

  		methods: {

        createSupplier: function() {
          var vueVars = this
          var url = '/db/createSupplier'

          this.supplier._id = this.supplier.CIF

          axios.post(url, {
            supplier: this.supplier
            })
            .then (function (response) {
              console.log(response)
              window.location.href = "/suppliers"
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            }) 
        }

      },

      computed: {
        ready: function() {
          if (this.supplier.name && this.supplier.CIF) {
            return 1
          } else {
            return 0
          }
        },

        emailify: function() {
          if (this.supplier.name){
            return "info@" + this.supplier.name.toLowerCase() + ".com"
          }
        }
      },

      mounted() {
      },

      beforeMount() {
      }

    }

</script>

<style>

.size-box {
  display:inline-block;
}

.sticky-spacer {
  height: 40px;
}
.product-create-container {
  margin: auto;
  width: 90%;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid lightgrey;
  border-radius: 6px;
}

.form-check {
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

.input-div {
  display: inline-block;
  margin-right: 20px;
}
</style>