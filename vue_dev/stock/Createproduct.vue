<template>

    <div>
      <div class="sticky-spacer"></div>

      <div class="row product-create-container">
        
        <form v-on:submit.prevent class="col-md-8">

            <div>
              
              <div style="width: 50%; display:inline-block;">
                <label for="name">Nombre del producto</label>
                <input type="text" class="form-control" id="name" placeholder="ex. Brief" v-model="product.name">
              </div>

              <div style="width: 20%; display:inline-block; margin-left: 30px;">
                <label for="name">Stock Inicial</label>
                <input type="number" class="form-control" id="stock" placeholder="20" v-model="product.stock">
              </div>

            </div>

            <br>

            <div style="width: 70%; display:inline-block;">
              <label for="selectCategory">Seleccionar categoría</label>
              <select class="form-control" id="selectCategory" v-model="product.category">
                <option v-for="category in categories">{{category}}</option>
              </select>
            </div>
            <button class="btn btn-default" @click="addCategory()">Añadir categoria</button>

            <div class="form-check form-check-inline">
              <div style="margin-bottom: 5px">
                <label for="color"> Colores </label>
                <input type="text" id="color" v-model="model_color">
                <button @click="addColor()">+</button>
                <button @click="checkAllColors()" v-if="show_color_button">++</button>

              </div>
              <div v-for="(color,index) in colors" class="input-div">
                <input class="form-check-input" type="checkbox" :value="color" v-model="checkedColors">
                <label class="form-check-label" :for="color">{{color}}</label>
              </div>        
            </div>

            <div class="form-check form-check-inline">
              <div style="margin-bottom: 5px">
                <label for="clothingsize"> Tallas de ropa </label>
                <input type="text" id="clothingsize" v-model="clothing_size">
                <button @click="addClothingSize()">+</button>
                <button @click="checkAllClothingSizes()" v-if="show_clothing_button">++</button>

              </div>
              <div v-for="(size,index) in clothingSizes" class="input-div">
                <input class="form-check-input" type="checkbox" :value="size" v-model="checkedSizes">
                <label class="form-check-label" :for="size">{{size}}</label>
              </div>        
            </div>

            <div class="form-check form-check-inline">
              <div style="margin-bottom: 5px">
                <label for="shoesize"> Tallas de calzado </label>
                <input type="number" step="0.5" id="shoesize" v-model="shoe_size">
                <button @click="addShoeSize()">+</button>
                <button @click="checkAllShoeSizes()" v-if="show_shoe_button">++</button>
              </div>
              <div v-for="(size,index) in shoeSizes" class="input-div">
                <input class="form-check-input" type="checkbox" :value="size" v-model="checkedSizes">
                <label class="form-check-label" :for="size">{{size}}</label>
              </div>
            </div>

        </form>

        <div class="col-md-3" style="margin-top: 20px"> 

              <p>Name : {{product.name}} </p>
              <p>Category : {{product.category}} </p>
              <p>Sizes : {{checkedSizes}} </p>
              <p>Colors : {{checkedColors}} </p>
              <p>Initial stock : {{product.stock}} </p>

              <br>

              <button v-if="ready" class="btn btn-success" @click="createProduct()">Añadir a la base de datos</button>
              <button v-else class="btn btn-custom">Falta información</button>
        </div>


      </div>
    </div>

</template>

<script> 
    import axios from 'axios'

    export default {
      name: 'Createproduct',

      props: {
          categories: []
      },

      data() {
        return {
          product: {},
          model_color: "",
          colors: ["black", "forest green", "pearl", "mint", "pumpkin"],
          clothing_size: "",
          clothingSizes: ["XS", "S", "M", "L", "XL", "Onesize"],
          shoe_size: "",
          shoeSizes: [36,37,38,39,40,41,42,43,44,45],
          show_shoe_button: 1,
          show_color_button: 1,
          show_clothing_button: 1,
          checkedSizes: [],
          checkedColors: [],
          errorMessage: ''
        }        
      },

  		methods: {

        createProduct: function() {
          var vueVars = this
          var url = '/db/createProduct'

          this.product.sizes = this.checkedSizes
          this.product.colors = this.checkedColors
          this.product.stock = Number(this.product.stock)

          axios.post(url, {
            product: this.product
            })
            .then (function (response) {
              console.log(response)
              window.location.href = "/stock"
            })
            .catch(function (error) {
              vueVars.errorMessage = "There has been an Error! Oh no.."
              console.log(error);
            }) 
        },

        addCategory: function() {
          var category = prompt("Escribe la nueva categoría aquí:", "");
          if (category) {
            this.categories.push(category)
            this.product.category = category
          }
        },

        addShoeSize: function() {
          let integer_size = this.shoe_size * 2
          if (Number.isInteger(integer_size) && this.shoe_size) {
            this.shoeSizes.push(this.shoe_size)
            this.checkedSizes.push(this.shoe_size)
            this.shoe_size = ""
          }
        },

        addClothingSize: function() {
          if (this.clothing_size) {
            this.clothingSizes.push(this.clothing_size)
            this.checkedSizes.push(this.clothing_size)
            this.clothing_size = ""
          }
        },

        addColor: function() {
          if (this.model_color) {
            let lower_color = this.model_color.toLowerCase()
            this.colors.push(lower_color)
            this.checkedColors.push(lower_color)
            this.model_color = ""
          }
        },

        checkAllColors: function() {
          this.show_color_button = 0
          var vueVars = this
          this.colors.forEach( function(color){
            vueVars.checkedColors.push(color)
          })
        }, 

        checkAllShoeSizes: function() {
          this.show_shoe_button = 0
          var vueVars = this
          this.shoeSizes.forEach( function(size){
            vueVars.checkedSizes.push(size)
          })
        }, 

        checkAllClothingSizes: function() {
          this.show_clothing_button = 0
          var vueVars = this
          this.clothingSizes.forEach( function(size){
            vueVars.checkedSizes.push(size)
          })
        }   

      },

      computed: {
        ready: function() {
          if (this.product.name && this.product.category) {
            if(this.checkedSizes.length > 0 && this.checkedColors.length > 0) {
              return 1
            }
          } else {
            return 0
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