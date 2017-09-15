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
	    website: '',
	    isClickedRandom: false
	  }
	},
	methods: {
		getRandomAirport: function() {
			const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
			const randomAirport = airports[getRandomInt(0, 569)];

			this.center = randomAirport.coordinates;
			this.name = randomAirport.name;
			// this.name = ap.name_translations.ru || ap.name || ap.name_translations.en || ap.name_translations.ru || ap.apinfo_airport_name_rus || ap.apinfo_airport_name_eng
			this.country = randomAirport.country.name.en;
			// this.country = ap.apinfo_country_rus || ap.apinfo_country_eng
			this.iata = randomAirport.code;
			// this.iata = ap.code || ap.tutu_airport_iata_code || ap.apinfo_airport_iata_code
			this.city = randomAirport.city.name.en;
			// this.city = ap.apinfo_city_rus || ap.tutu_city_rus || ap.apinfo_city_eng
			this.website = randomAirport.contacts.website;
			// this.website = ap.apinfo_website || ap.ai_airport_offsite


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
			// const airport = airports[]
		}
	},
	created: function() {
		// this.getRandomAirport();
		EventBus.$on('random-aiport', () => {
			this.isClickedRandom = true;
			this.getRandomAirport();
			this.isClickedRandom = false;
		});
	},
	watch: {
		'iata': function(newVal, oldVal) {
			this.$router.push({ name: 'airport', params: { code: newVal }})
		}
	}
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