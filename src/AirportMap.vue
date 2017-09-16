<template>
	<div>
	<div class="airport">
		<div class="airport__info">
			<span class="airport__info-header">Информация об аэропорте:</span>
			<ul class="airport__info-list">
				<li><b>Название</b>: {{ name }}</li>
				<li><b>Страна</b>: {{ country }}</li>
				<li><b>Город</b>: {{ city }}</li>
				<li><b>IATA-код аэропорта:</b> {{ iata }}</li>
				<li v-if="website"><b>Сайт:</b> <a :href="website">{{ website }}</a></li>
			</ul>
		</div>
		<div class="airport__search">
			<span class="airport__search-header">Поиск аэропорта:</span>
			<ais-index
			app-id="V9099CTTHC"
			api-key="55c4551b67080a4dd0da7192c1930f23"
			index-name="large_airports"
			:auto-search="false"
			>
			<ais-search-box></ais-search-box>
			<ais-results>
			  <template scope="{ result }">
			    <h2 @click="searchResultClicked(result)">
			      <ais-highlight :result="result" attribute-name="name"></ais-highlight>
			    </h2>
			  </template>
			</ais-results>
			<!-- <ais-clear :clear-query="false"></ais-clear> -->
			</ais-index>
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
	    center: {},
	    name: '',
	    country: '',
	    city: '',
	    iata: '',
	    website: ''
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
		searchResultClicked: function(result) {
			this.$router.push({ name: 'airport', params: { code: result.code }})
			this.getAirport();
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

</style>