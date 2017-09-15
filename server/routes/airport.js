var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/Airports.js');
const Airports = mongoose.model('Airports');

router.get('/', function(req, res, next) {

	Airports.findOneRandom(function(err, airport) {
		if(err) console.log(err);
		console.log(airport.coordinates);
		res.json(airport);
	});
});

module.exports = router;
