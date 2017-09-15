<template>
	<div>
	<div class="airport">
		<span class="airport__info-header">Информация об аэропорте:</span>
		<ul class="airport__info-list">
			<li><b>Название</b>: {{ name }}</li>
			<li><b>Страна</b>: {{ country }}</li>
			<li><b>Город</b>: {{ city }}</li>
			<li><b>IATA-код аэропорта:</b> {{ iata }}</li>
			<li v-if="website"><b>Сайт:</b> <a :href="website">{{ website }}</a></li>
		</ul>
	</div>
		<gmap-map
		:center="center"
		:zoom="14"
		map-type-id="satellite"
		style="width: 100%; height: 100vh"
		>
		</gmap-map>
	</div>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/eventbus'
import airports from '../airports'
// const airports = () => import('../airports').then(airports)
// const airports = resolve => {
//   require.ensure(['../airports.json'], () => {
//     resolve(require('../airports.json'))
//   })
// }


export default {
	data () {
	  return {
	    center: {},
	    name: '',
	    country: '',
	    city: '',
	    iata: '',
	    website: ''
	  }
	},
	methods: {
		getRandomAirport: function() {
			const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
			const randomNum = getRandomInt(0, 569);
			const randomAirport = airports[randomNum];

			return randomAirport
			// this.center = randomAirport.coordinates;
			// this.name = randomAirport.name;
			// // this.name = ap.name_translations.ru || ap.name || ap.name_translations.en || ap.name_translations.ru || ap.apinfo_airport_name_rus || ap.apinfo_airport_name_eng
			// this.country = randomAirport.country.name.en;
			// // this.country = ap.apinfo_country_rus || ap.apinfo_country_eng
			// this.iata = randomAirport.code;
			// // this.iata = ap.code || ap.tutu_airport_iata_code || ap.apinfo_airport_iata_code
			// this.city = randomAirport.city.name.en;
			// // this.city = ap.apinfo_city_rus || ap.tutu_city_rus || ap.apinfo_city_eng
			// this.website = randomAirport.contacts.website;
			// // this.website = ap.apinfo_website || ap.ai_airport_offsite


			// axios.get('http://localhost:3001/airport')
			// 	.then(airport => {
			// 		const ap = airport.data;

			// 		var coords = airport.data.coordinates;
			// 		coords["lng"] = coords.lon;
			// 		delete coords["lon"];

			// 		this.center = coords
			// 		this.name = ap.name_translations.ru || ap.name || ap.name_translations.en || ap.name_translations.ru || ap.apinfo_airport_name_rus || ap.apinfo_airport_name_eng
			// 		this.country = ap.apinfo_country_rus || ap.apinfo_country_eng
			// 		this.iata = ap.code || ap.tutu_airport_iata_code || ap.apinfo_airport_iata_code
			// 		this.city = ap.apinfo_city_rus || ap.tutu_city_rus || ap.apinfo_city_eng
			// 		this.website = ap.apinfo_website || ap.ai_airport_offsite
			// 	})
		},
		getAirport: function() {
			const airportCode = this.$router.history.current.params.code;
			// console.log('airportCode', airportCode);

			const airport = airports.filter(ap => ap.code === airportCode)

			this.center = airport[0].coordinates;
			this.name = airport[0].name;
			this.country = airport[0].country.name.en;
			this.iata = airport[0].code;
			this.city = airport[0].city.name.en;
			this.website = airport[0].contacts.website;

		}
	},
	created: function() {
		// this.getRandomAirport();



		EventBus.$on('random-airport', () => {
			// console.log('random emitted');
			// this.getRandomAirport();
			const newAirport = this.getRandomAirport();
			// console.log(newAirport);
			// console.log('this.$router', this.$router.history.current.params.code);
			this.$router.push({ name: 'airport', params: { code: newAirport.code }})

			this.getAirport()
			// console.log(this.getAirport());
		});

		this.getAirport()
		// EventBus.$on('current-airport', (code) => {
		// 	console.log('getCurrentAirport emitted', code);
		// 	// this.getRandomAirport();
		// 	// console.log('this.$router', this.$router.history.current.params.code);
		// 	const currentAirport = airports.filter(ap => ap.code === code)
		// 	this.$router.push({ name: 'airport', params: { code: currentAirport[0].code }})
		// 	this.getAirport()
		// 	// console.log(this.getAirport());
		// });
	},
	mounted () {
		// console.log('AirportMap route', this.$route);
	}
	// watch: {
	// 	'iata': function(newVal, oldVal) {
	// 		this.$router.push({ name: 'airport', params: { code: newVal }})
	// 	}
	// }
}

</script>

<style>
	.airport {
		text-align: left;
		position: absolute;
		top: 50px;
		left: 50px;
		z-index: 9999;
		background: #FFF;
		padding: 20px 20px;
	}

	.airport__info-header {
		font-weight: bold;
		font-size: 120%;
	}

	.airport__info-list {
		margin-bottom: 0;
	}

	.airport__info-list li {
		display: block;
		margin-left: 0;
	}

	.airport__name {
		padding: 0;
		margin: 0;
	}

</style>