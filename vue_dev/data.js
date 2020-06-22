import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Productiondata from './data/Productiondata.vue'
import Stockdata from './data/Stockdata.vue'


new Vue({
	el: '#app',
	components: {Navbar, Productiondata, Stockdata},
	data() {
	    return {
	    }
	}
})