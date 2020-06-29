<template>

    <div>
      <table class="table table-hover" >

        <thead>
          <tr>
            <th @click="sortBy('CIF')"  :class="{ active: sortKey == 'CIF' }" class="table-col-2">
              CIF
            </th>

            <th @click="sortBy('name')"  :class="{ active: sortKey == 'name' }" class="table-col-4">
              Name
            </th>

            <th @click="sortBy('description')"  :class="{ active: sortKey == 'description' }" class="table-col-4">
              Description
            </th>



          </tr>
        </thead>

        <tbody>
          <tr v-for="producer in filteredProducers">
            <td @click="redirect(producer._id)"> {{producer.CIF}} </td>
            <td @click="redirect(producer._id)"> {{producer.name}} </td>
            <td @click="redirect(producer._id)"> {{producer.description }} </td>
          </tr>
        </tbody>

      </table>
    </div>

</template>

<script> 
    import axios from 'axios'


    export default {
        name: 'Producertable',

        props: {
            producers: Array,
            producerFilter: "",
            newOrder: 0,
        },

        data() {
            var sortProducers = {}
            var columns = ['CIF','name','description']
            columns.forEach(function (key) {
              sortProducers[key] = 1
            })
            return {
              filteredProducers: [],
              sortKey: '',
              sortProducers: sortProducers
            }
        },

        components: {},

        methods: {
        },

        beforeMount() {
          this.producerFilter = this.producers
        },

        watch: {
          producerFilter: function (str) {
            this.filteredProducers = this.producers
            var producerFilter = str
            this.filteredProducers = this.producers.filter(function (row) {
              return String(row['name']).toLowerCase().indexOf(producerFilter) > -1
            })
            this.sortKey = ''           
          }
        },
        
        methods: {
            sortBy: function (key) {
                let vueVars = this
                vueVars.sortKey = key
                vueVars.sortProducers[key] = vueVars.sortProducers[key] * -1

                vueVars.filteredProducers.sort(function (item1, item2) {

                  // If undefined key (doesnt sort)
                  if (!item1[key]) {
                    item1[key] = ""
                  }
                  if (!item2[key]) {
                    item2[key] = ""
                  }

                  // Sort by key
                  if (item1[key] > item2[key]) return -1*vueVars.sortProducers[key];
                  if (item1[key] < item2[key]) return 1*vueVars.sortProducers[key];

                });
            },

            redirect: function(id) {
              if (this.newOrder) {
                window.location.href = "/production/new_order/" + id
              } else {
                window.location.href = "/producers/" + id
              }
            },

        },



    }

</script>

<style>

</style>