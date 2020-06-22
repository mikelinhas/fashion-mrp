import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Supplierlist from './suppliers/Supplierlist.vue'
import Supplierinfo from './suppliers/Supplierinfo.vue'
import Supplierstock from './suppliers/Supplierstock.vue'
import Materialinfo from './suppliers/Materialinfo.vue'
import Materialhistory from './suppliers/Materialhistory.vue'


new Vue({
	el: '#app',
	components: {Navbar, Supplierlist, Supplierinfo, Supplierstock, Materialinfo, Materialhistory},
	data() {
	    return {
	    }
	}
})