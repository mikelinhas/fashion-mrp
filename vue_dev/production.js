import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Productionlist from './production/Productionlist.vue'
import Orderlist from './production/Orderlist.vue'
import Neworder from './production/Neworder.vue'
import Pickproducer from './production/Pickproducer.vue'



new Vue({
	el: '#app',
	components: {Navbar, Productionlist, Orderlist, Neworder, Pickproducer},
	data() {
	    return {
	    }
	}
})