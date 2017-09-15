var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

var airportsSchema = new Schema({
    code: String,
    name: String,
    coordinates: {
    	type: Object,
    	index: '2d'
    },
    time_zone: String,
    name_translations: Object,
    country_code: String,
    city_code: String,
	tutu_airport_iata_code: String,
	tutu_airport_name_rus: String,
	tutu_airport_name_eng: String,
	tutu_city_rus: String,
	apinfo_airport_iata_code: String,
	apinfo_airport_name_rus: String,
	apinfo_airport_name_eng: String,
	apinfo_city_rus: String,
	apinfo_city_eng: String,
	apinfo_country_rus: String,
	apinfo_country_eng: String,
	apinfo_iso_code: String,
	apinfo_latitude: String,
	apinfo_longitude: String,
	apinfo_runway_length: Number,
	apinfo_runway_elevation: Number,
	apinfo_phone: String,
	apinfo_fax: String,
	apinfo_email: String,
	apinfo_website: String,
	apinfo_icao_code: String,
	apinfo_gmt_offset: Number,
	ai_airport_name_rus: String,
	ai_airport_name_eng: String,
	ai_country: String,
	ai_airport_open_year: String,
	ai_gmt: String,
	ai_coordinates: String,
	ai_location: String,
	ai_terminals_count: String,
	ai_iata_code: String,
	ai_icao_code: String,
	ai_inner_code: String,
	ai_post_address: String,
	ai_airport_direction_telephone: String,
	ai_airport_support: String,
	ai_airport_fax: String,
	ai_airport_email: String,
	ai_airport_offsite: String,
	ai_base_airlines: String
}, {
    collection: 'airports'
});

airportsSchema.plugin(random)

var Airports = mongoose.model('Airports', airportsSchema);

module.exports = {
        Airports: Airports
}