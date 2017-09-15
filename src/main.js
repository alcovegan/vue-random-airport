import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import AirportMap from '@/AirportMap.vue'
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
	load: {
	  key: 'AIzaSyC821LK-d1Hg7b-FZ4Ka_aEPDxgMd3d6Gs'
	}
});

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: App },
	{ path: '/airport/:code', name: 'airport', component: AirportMap }
]

const router = new VueRouter({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	console.log('from', from)
	console.log('to', to)
	next();
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
