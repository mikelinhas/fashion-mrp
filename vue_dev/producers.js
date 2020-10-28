import Vue from 'vue'

import Navbar from './components/Navbar.vue'
import Producerlist from './producers/Producerlist.vue'
import Producerinfo from './producers/Producerinfo.vue'
import Producerstock from './producers/Producerstock.vue'


new Vue({
	el: '#app',
	components: {Navbar, Producerlist, Producerinfo, Producerstock},
	data() {
	    return {
	    }
	}
})