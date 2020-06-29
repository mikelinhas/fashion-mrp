<template>

    <div>
      <div class="sticky-spacer"></div>

      <div class="row product-create-container">
        
        <form v-on:submit.prevent class="col-md-8">

            <div>
              
              <div style="width: 40%; display:inline-block;">
                <label for="name">Producer's name</label>
                <input type="text" class="form-control" id="name" placeholder="ex. Brief" v-model="producer.name">
              </div>

              <div style="width: 40%; display:inline-block;">
                <label for="CIF">CIF</label>
                <input type="text" class="form-control" id="CIF" placeholder="" v-model="producer.CIF">
              </div>

            </div>

            <br>

            <div style="width: 60%; display:inline-block;">
              <label for="description">Description</label>
              <input type="text" class="form-control" id="description" placeholder="" v-model="producer.description">
            </div>

            <br><br>

            <div style="width: 40%; display:inline-block;">
              <label for="email">Email</label>
              <input type="email" class="form-control" id="email" :placeholder="emailify" v-model="producer.email">
            </div>

            <div style="width: 40%; display:inline-block;">
              <label for="phone">Telephone</label>
              <input type="tel" class="form-control" id="phone" :placeholder="650444999" v-model="producer.phone">
            </div>

        </form>

        <div class="col-md-3" style="margin-top: 20px"> 

              <p>Name : {{producer.name}} </p>
              <p>CIF : {{producer.CIF}} </p>
              <p>Description : {{producer.description}} </p>
              <p>Email : {{producer.email}} </p>
              <p>Phone : {{producer.phone}} </p>

              <br>

              <button v-if="ready" class="btn btn-success" @click="createProducer()">Add to database</button>
              <button v-else class="btn btn-custom">Some information is missing.</button>
        </div>


      </div>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Createproducer',

      props: {
          categories: []
      },

      data() {
        return {
          producer: {},
          errorMessage: ''
        }        
      },

  		methods: {

        createProducer: function() {
          var vueVars = this
          var url = '/db/createProducer'

          this.producer._id = this.producer.CIF

          axios.post(url, {
            producer: this.producer
            })
            .then (function (response) {
              console.log(response)
              window.location.href = "/producers"
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            }) 
        },

      },

      computed: {
        ready: function() {
          if (this.producer.name && this.producer.CIF) {
            return 1
          } else {
            return 0
          }
        },

        emailify: function() {
          if (this.producer.name){
            return "info@" + this.producer.name.toLowerCase() + ".com"
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