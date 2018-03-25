<template>
	<div>
    <div class="get-random-airport" @click="randomAirport">
      <div class="get-random-aiport__text">
        {{ i18n[language].randomButton }}
      </div>
    </div>
	<div class="airport">
		<div class="airport__wrapper" :class="{ 'airport__wrapper--reduced': isBlockReduced }">
			<div class="airport__language">
				<div @click="changeLanguage('ru')" class="airport__language-selector" :class="{ 'airport__language-selector--selected': selectedLanguage('ru') }">RU</div>
				<div @click="changeLanguage('en')" class="airport__language-selector" :class="{ 'airport__language-selector--selected': selectedLanguage('en') }">EN</div>
			</div>
			<div class="airport__search-toggle" :class="{ 'airport__search-toggle--active': isSearchActive }" @click="toggleSearch">
				{{ i18n[language].search }}
			</div>
			<div class="airport__info">
				<div class="airport__info-header">{{ i18n[language].informationHeader }}:</div>
				<ul class="airport__info-list">
					<li><b>{{ i18n[language].name }}</b>: {{ airportName }}</li>
					<li><b>{{ i18n[language].country }}</b>: {{ airportCountry }}</li>
					<li><b>{{ i18n[language].city }}</b>: {{ airportCityName }}</li>
					<li><b>{{ i18n[language].iata }}:</b> {{ iata }}</li>
					<li v-if="website"><b>{{ i18n[language].website }}:</b> <a :href="website">{{ website }}</a></li>
					<li v-if="airportInfo.terminals > 0"><b>{{ i18n[language].terminalsCount }}:</b> {{ airportInfo.terminals }}</a></li>
					<li v-if="airportInfo.year_open > 0"><b>{{ i18n[language].yearOpened }}:</b> {{ airportInfo.year_open }}</a></li>
					<li v-if="airportInfo.runway.length !== null"><b>{{ i18n[language].runwayLength }}:</b> {{ airportInfo.runway.length }}</a></li>
					<li v-if="airportInfo.runway.elevation !== null"><b>{{ i18n[language].runwayElevation }}:</b> {{ airportInfo.runway.elevation }}</a></li>
					<li v-if="airportInfo.contacts.post_address"><b>{{ i18n[language].postAddress }}:</b> {{ airportInfo.contacts.post_address }}</a></li>
					<li v-if="airportInfo.contacts.email"><b>{{ i18n[language].email }}:</b> {{ airportInfo.contacts.email }}</a></li>
					<li v-if="airportInfo.contacts.phone"><b>{{ i18n[language].directionPhone }}:</b> {{ airportInfo.contacts.phone }}</a></li>
					<li v-if="airportInfo.contacts.support_phone"><b>{{ i18n[language].supportPhone }}:</b> {{ airportInfo.contacts.support_phone }}</a></li>
					<li v-if="airportInfo.contacts.fax"><b>{{ i18n[language].fax }}:</b> {{ airportInfo.contacts.fax }}</a></li>
					<li v-if="airportInfo.base_airlines.length > 0"><b>{{ i18n[language].baseAirlines }}:</b> {{ baseAirlines }}</a></li>
				</ul>
			</div>
		</div>
		<div class="airport__toggle" @click="toggleBlockSize">
			<a class="airport__toggle-switch">
				{{ toggleButtonText }}
			</a>
		</div>
	</div>
	<div class="airport__search" :class="{ 'airport__search--active': isSearchActive }" @keyup.esc="toggleSearch">
		<div class="airport__search-wrapper">
			<div class="airport__search-header">{{ i18n[language].searchHeader }}:</div>
			<input class="airport__search-input" type="text" @input="findAirport" @keyup.down="keyDown" @keyup.up="keyUp" @keyup.enter="keyEnter" v-model="airportQuery">

			<div class="airport__search-results">
				<ul class="airport__search-list">
					<li class="airport__search-list-item" v-for="(airport, index) in airportResults" @click="searchResultClicked(airport.code)" :class="{'airport__search-list-item--active': isActive(index)}">
						{{ searchResults(airport) }} - <span style="text-decoration: underline;">{{ airport.code }}</span>
					</li>
				</ul>
			</div>
		</div>
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
// import axios from 'axios'
import { EventBus } from '@/eventbus'
import airports from '../airports'

export default {
	data () {
	  return {
	  	airportQuery: null,
	  	airportResults: [],
		airportInfo: {},
		isBlockReduced: false,
	    center: {},
	    name: '',
	    country: '',
	    city: '',
	    iata: '',
	    website: '',
	    language: '',
	    i18n: {
	    	"ru": {
	    		"randomButton": "Случайный аэропорт",
	    		"informationHeader": "Информация об аэропорте",
	    		"name": "Название аэропорта",
	    		"country": "Страна",
	    		"city": "Город",
	    		"iata": "IATA-код аэропорта",
	    		"website": "Сайт",
	    		"searchHeader": "Поиск аэропорта",
	    		"terminalsCount": "Количество терминалов",
	    		"yearOpened": "Год открытия",
	    		"runwayLength": "Длина взлетной полосы",
				"runwayElevation": "Возвышение взлетной полосы",
				"postAddress": "Почтовый адрес",
				"email": "E-mail",
				"directionPhone": "Телефон дирекции",
				"supportPhone": "Телефон поддержки",
				"fax": "Факс",
				"baseAirlines": "Базовые авиалинии",
				"toggleButtonReduce": "Свернуть",
				"toggleButtonExtend": "Развернуть",
				"search": "Поиск"
	    	},
	    	"en": {
	    		"randomButton": "Get random airport!",
	    		"informationHeader": "Information about airport",
	    		"name": "Airport name",
	    		"country": "Country",
	    		"city": "City",
	    		"iata": "Airport IATA-code",
	    		"website": "Website",
	    		"searchHeader": "Airport search",
	    		"terminalsCount": "Terminals count",
	    		"yearOpened": "Year opened",
	    		"runwayLength": "Runway length",
				"runwayElevation": "Runway elevation",
				"postAddress": "Post address",
				"email": "E-mail",
				"directionPhone": "Direction phone",
				"supportPhone": "Support phone",
				"fax": "Fax",
				"baseAirlines": "Base airlines",
				"toggleButtonReduce": "Reduce size",
				"toggleButtonExtend": "Extend",
				"search": "Search"
	    	}
	    },
	    currentSelectedSuggestion: 0,
	    isSearchActive: false
	  }
	},
	methods: {
		getAirport: function() {
			const airportCode = this.$router.history.current.params.code;
			const airport = airports.filter(ap => ap.code === airportCode)

			this.airportInfo = airport[0];
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
			this.airportQuery = '';
			this.airportResults = '';
			this.currentSelectedSuggestion = 0;
		},
		findAirport: function() {
			this.airportResults = airports.filter(airport => {
				if(this.airportQuery === '') {
					this.currentSelectedSuggestion = 0;
					return false
				}
				if(airport.code.startsWith(this.airportQuery.toUpperCase())) {
					return airport
				}

				if(airport.name.toLowerCase().includes(this.airportQuery.toLowerCase())) {
					return airport
				}

				if(airport.name_translations.ru !== undefined && airport.name_translations.ru.toLowerCase().includes(this.airportQuery.toLowerCase())) {
					return airport
				}

				if(airport.reserve.airport_name_rus.length > 0 && airport.reserve.airport_name_rus[0].toLowerCase().includes(this.airportQuery.toLowerCase())) {
					return airport
				}
			})

			if(this.airportResults.length === 1) {
				this.currentSelectedSuggestion = 0
			}
		},
		changeLanguage: function(langCode) {
			console.log(langCode);
			this.language = langCode
			window.localStorage.setItem('random-airports-language', langCode);
		},
		getLanguage: function() {
			this.language = window.localStorage.getItem('random-airports-language') || 'en'
		},
		randomAirport: function() {
			const newAirport = this.getRandomAirport();
			this.$router.push({ name: 'airport', params: { code: newAirport.code }})
			this.getAirport()
		},
		selectedLanguage: function(lang) {
			return this.language === lang
		},
		searchResults: function(airport) {
			const airportNameRU = airport.name_translations.ru || airport.reserve.airport_name_rus[0] || airport.name;

			return this.language === 'en'
				? airport.name
				: `${airportNameRU} (${airport.name})`
		},
		keyDown: function() {
	        if(this.currentSelectedSuggestion < this.airportResults.length - 1) {
	        	this.currentSelectedSuggestion++;
	        } else {
	        	this.currentSelectedSuggestion = 0
	        }
		},
		keyUp: function() {
	        if(this.currentSelectedSuggestion > 0) {
	        	this.currentSelectedSuggestion--;
	        } else {
	        	this.currentSelectedSuggestion = this.airportResults.length - 1
	        }
		},
		keyEnter: function() {
			const selectedCode = this.airportResults[this.currentSelectedSuggestion].code;

			this.$router.push({ name: 'airport', params: { code: selectedCode }});
			this.getAirport();
			this.airportQuery = '';
			this.airportResults = '';
			this.currentSelectedSuggestion = 0;
		},
		toggleBlockSize: function() {
			return this.isBlockReduced = !this.isBlockReduced
		},
		toggleSearch: function() {
			return this.isSearchActive = !this.isSearchActive
		},
	    isActive: function(index) {
	    	return index === this.currentSelectedSuggestion
	    }
	},
	created: function() {
		this.getLanguage();
		this.getAirport();
	},
	computed: {
		airportName: function() {
			return this.language === 'en'
				? this.airportInfo.name
				: this.airportInfo.name_translations.ru || this.airportInfo.reserve.airport_name_rus[0] || this.airportInfo.name
		},
		airportCountry: function() {
			return this.language === 'en'
				? this.airportInfo.country.name.en
				: this.airportInfo.country.name.ru
		},
		airportCityName: function() {
			return this.language === 'en'
				? this.airportInfo.city.name.en
				: this.airportInfo.city.name.ru || this.airportInfo.city.name.en
		},
		baseAirlines: function() {
			// return this.airportInfo.base_airlines.map(ap => ap).join(', ')
			const splitRuFromEn = this.airportInfo.base_airlines.map(ap => ap.split(' (').map(spltd => spltd.replace(')', '')))

			if(this.language !== 'ru' && this.airportInfo.country.code !== 'RU') {
				return splitRuFromEn.map(airline => airline[0]).join(', ')
			} else if(this.language === 'ru' && this.airportInfo.country.code === 'RU') {
				return splitRuFromEn.map(airline => airline[0]).join(', ')
			} else if(this.language !== 'ru' && this.airportInfo.country.code === 'RU') {
				return splitRuFromEn.map(airline => airline[1]).join(', ')
			} else if(this.language === 'ru' && this.airportInfo.country.code !== 'RU') {
				return splitRuFromEn.map(airline => airline[1]).join(', ')
			}
			// const replaceAnyBrackets = splitRuFromEn.map(spltd => spltd)
			// return splitRuFromEn
		},
		toggleButtonText: function() {
			return this.isBlockReduced
				? this.i18n[this.language].toggleButtonExtend
				: this.i18n[this.language].toggleButtonReduce
		}
	}
	// watch: {
	// 	'iata': function(newVal, oldVal) {
	// 		this.$router.push({ name: 'airport', params: { code: newVal }})
	// 	}
	// }
}

</script>

<style>

	.get-random-airport {
	  cursor: pointer;
	  position: absolute;
	  top: 50px;
	  right: 10px;
	  background: #FFF;
	  z-index: 9999;
	  display: block;
	  height: 50px;
	  width: 200px;
	  padding: 20px;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  border: 3px solid blue;
	  transition: background 0.3s ease;
	}

	.get-random-airport:hover {
	  color: #FFF;
	  background: blue;
	  transition: background 0.3s ease;
	}

	.get-random-airport:active {
	  color: #000;
	  background: #FFF;
	}

	.get-random-airport__text {
	  font-weight: bold;
	}

	.airport {
		text-align: left;
		position: absolute;
		top: 50px;
		left: 10px;
		max-width: 400px;
		z-index: 9999;
		background: #FFF;
		padding: 20px 20px;
		border: 3px solid blue;
	}

	.airport__wrapper {
		height: auto;
		max-height: 700px;
		overflow: hidden;
		transition: max-height .3s ease;
	}

	.airport__wrapper--reduced {
		max-height: 85px;
		transition: max-height .3s ease;
	}

	.airport__language {
		margin-bottom: 10px;
		display: inline-block;
	}

	.airport__language-selector {
		display: inline-block;
		line-height: 40px;
		width: 40px;
		height: 40px;
		text-align: center;
	}

	.airport__language-selector--selected {
		background: #F2F2F2;
	}

	.airport__language-selector:hover {
		background: #F2F2F2;
		cursor: pointer;
	}

	.airport__search-toggle {
		display: inline-block;
		padding: 0 10px;
		line-height: 40px;
		margin-left: 40px;
		cursor: pointer;
		/*outline: 1px solid red;*/
	}

	.airport__search-toggle--active {
		background: #F2F2F2;
	}

	.airport__search-toggle:hover {
		background: #F2F2F2;
	}

	.airport__info {
		margin-bottom: 20px;
		padding-left: 10px;
	}

	.airport__info-header,
	.airport__search-header {
		font-weight: bold;
		font-size: 1.2rem;
		margin-bottom: 10px;
	}

	.airport__info-list {
		margin-top: 0;
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
		display: none;
		position: absolute;
		background: #FFF;
		top: 50px;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 9999;
		padding: 10px 20px;
		border: 3px solid blue;
		max-width: 400px;
		animation: fadeInFromNone .3s ease-out;
		/*padding: 20px 20px 20px 0;*/
		/*padding-left: 10px;*/
		/*min-width: 400px;*/
		/*margin-bottom: 20px;*/
	}

	.airport__search--active {
		display: block;
		animation: fadeInFromNone .3s ease-out;
		/*opacity: 1;*/
		/*transition: max-width .3s ease;*/
	}

	@-webkit-keyframes fadeInFromNone {
	    0% {
	        display: none;
	        opacity: 0;
	    }

	    1% {
	        display: block;
	        opacity: 0;
	    }

	    100% {
	        display: block;
	        opacity: 1;
	    }
	}

	.airport__search-wrapper {
		box-sizing: border-box;
	}

	.airport__search-header {
		margin-bottom: 10px;
	}

	.airport__search-input {
		border: 2px solid #F2F2F2;
		font-size: 36px;
		height: 36px;
		box-sizing: border-box;
	}

	.airport__search-input:focus {
		background: #F2F2F2;
	}

	.airport__search-results {
		overflow: auto;
	}

	.airport__search-list {
		width: 400px;
	}

	.airport__search-list-item {
		display: block;
		margin-left: 0;
		padding: 10px 10px;
		margin: 0;
		border-bottom: 1px solid #F2F2F2;
		cursor: pointer;
	}

	.airport__search-list-item--active {
		background: #42b983;
		color: #FFF;
	}

	.airport__search-list-item--active:hover {
		color: #2c3e50;
	}

	.airport__search-list-item:hover {
		background: #F2F2F2;
	}

	.airport__toggle {
		text-align: center;
		font-size: 0.857rem;
		/*padding-top: 20px;*/
		cursor: pointer;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.airport__toggle-switch {
		text-transform: uppercase;
		color: blue;
	}


</style>