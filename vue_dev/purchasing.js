import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Purchaseorderslist from './purchasing/Purchaseorderslist.vue'
import Datepicker from 'vuejs-datepicker';
import Newpurchaseorder from './purchasing/Newpurchaseorder.vue'
import Picksupplier from './purchasing/Picksupplier.vue'
import Orderlist from './purchasing/Orderlist.vue'


new Vue({
	el: '#app',
	components: {Navbar, Purchaseorderslist, Datepicker, Newpurchaseorder, Picksupplier, Orderlist},
	data() {
	    return {
	    }
	}
})