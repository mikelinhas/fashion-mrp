import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Itemlist from './stock/Itemlist.vue'
import Productinfo from './stock/Productinfo.vue'
import Producthistory from './stock/Producthistory.vue'
import Productbom from './stock/Productbom.vue'



new Vue({
	el: '#app',
	components: {Navbar, Itemlist, Productinfo, Producthistory, Productbom},
	data() {
	    return {
	    }
	}
})