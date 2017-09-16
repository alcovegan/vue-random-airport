<template>
	<div>
	<div class="airport">
		<div class="airport__language">
			<span @click="changeLanguage('ru')" class="airport__language-selector">RU</span>
			<span @click="changeLanguage('en')" class="airport__language-selector">EN</span>

			<span @click="randomAirport" class="airport__language-selector">RANDOM</span>
		</div>
		<div class="airport__info">
			<span class="airport__info-header">Информация об аэропорте:</span>
			<ul class="airport__info-list">
				<li><b>{{ i18n[language].name }}</b>: {{ name }}</li>
				<li><b>{{ i18n[language].country }}</b>: {{ country }}</li>
				<li><b>{{ i18n[language].city }}</b>: {{ city }}</li>
				<li><b>{{ i18n[language].iata }}:</b> {{ iata }}</li>
				<li v-if="website"><b>{{ i18n[language].website }}:</b> <a :href="website">{{ website }}</a></li>
			</ul>
		</div>
		<div class="airport__search">
			<div class="airport__search-header">{{ i18n[language].search }}:</div>
			<input class="airport__search-input" type="text" @input="findAirport" v-model="airportQuery">

			<div class="airport__search-results">
				<ul class="airport__search-list">
					<li class="airport__search-list-item" v-for="airport in airportResults" @click="searchResultClicked(airport.code)">
						{{ airport.name }} - <span style="text-decoration: underline;">{{ airport.code }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<gmap-map
		:center="center"
		:zoom="15"
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

export default {
	data () {
	  return {
	  	airportQuery: null,
	  	airportResults: [],
	    center: {},
	    name: '',
	    country: '',
	    city: '',
	    iata: '',
	    website: '',
	    language: 'en',
	    i18n: {
	    	"ru": {
	    		"name": "Название аэропорта",
	    		"country": "Страна",
	    		"city": "Город",
	    		"iata": "IATA-код аэропорта",
	    		"website": "Сайт",
	    		"search": "Поиск аэропорта"
	    	},
	    	"en": {
	    		"name": "Airport name",
	    		"country": "Country",
	    		"city": "City",
	    		"iata": "Airport IATA-code",
	    		"website": "Website",
	    		"search": "Airport search"
	    	}
	    }
	  }
	},
	methods: {
		getAirport: function() {
			const airportCode = this.$router.history.current.params.code;
			const airport = airports.filter(ap => ap.code === airportCode)

			this.center = airport[0].coordinates;
			this.name = airport[0].name;
			this.country = airport[0].country.name.en;
			this.iata = airport[0].code;
			this.city = airport[0].city.name.en;
			this.website = airport[0].contacts.website;
		},
		searchResultClicked: function(code) {
			this.airportQuery = '';
			this.airportResults = [];
			this.$router.push({ name: 'airport', params: { code: code }})
			this.getAirport();
		},
		findAirport: function() {
			this.airportResults = airports.filter(airport => {
				if(this.airportQuery === '') {
					return false
				}
				return airport.code.startsWith(this.airportQuery.toUpperCase())
			})
		},
		changeLanguage: function(langCode) {
			console.log(langCode);
			this.language = langCode
		},
		randomAirport: function() {
			const newAirport = this.getRandomAirport();
			this.$router.push({ name: 'airport', params: { code: newAirport.code }})
			this.getAirport()
		}
	},
	created: function() {
		this.getAirport();

		EventBus.$on('random-airport', () => {
			const newAirport = this.getRandomAirport();
			this.$router.push({ name: 'airport', params: { code: newAirport.code }})
			this.getAirport()
		});
	},
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

	.airport__info-header,
	.airport__search-header {
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

	.airport__search {
		/*position: absolute;*/
		background: #FFF;
		top: 50px;
		/*left: 400px;*/
		z-index: 9999;
		padding: 20px 20px 20px 0;
		min-width: 400px;
	}

	.ais-results {
		background: #FFF;
	}

	.airport__search-header {
		margin-bottom: 5px;
	}

	.airport__search-input {
		border: 2px solid #F2F2F2;
		font-size: 36px;
		height: 36px;
	}

	.airport__search-input:focus {
		background: #F2F2F2;
	}

	.airport__search-list {

	}

	.airport__search-list-item {
		display: block;
		margin-left: 0;
		padding: 10px 10px;
		border-bottom: 1px solid #F2F2F2;
		cursor: pointer;
	}

	.airport__search-list-item:hover {
		background: #F2F2F2;
	}

</style>