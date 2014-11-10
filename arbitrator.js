/*
 * Import Queue arbitrator server and REST api
 *
 */

/*
 * Import needed packages
 */
var winston = require('winston');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();

var requestQueue = 'solr_import_request';

/*
 * AMQP connection handling for the request queue
 */
var open = require('amqplib').connect('amqp://10.24.0.171:5672');
open.then(
		function(conn) {

			var ok = conn.createChannel();

			ok = ok.then(function(ch) {

				ch.assertQueue(requestQueue, {
					durable : true
				});

				var jsonParser = bodyParser.json();
				app.post('/request_import', jsonParser, function(req, res) {

					
					var startMoment = moment(req.body.start);
					var endMoment = moment(req.body.end);

					if (req.body.type != 'page') {
						res.statusCode = 400;
						return res.send('Error 400: Post syntax incorrect.');
					}

					console.log(startMoment.format('YYYY-MM-DD'));
					console.log('{"type":"page","start":"'
							+ startMoment.format('YYYY-MM-DD') + '","end":"'
							+ endMoment.format('YYYY-MM-DD') + '"}');

					ch.sendToQueue(requestQueue, new Buffer('{"type":"page","start":"'
							+ startMoment.format('YYYY-MM-DD') + '","end":"'
							+ endMoment.format('YYYY-MM-DD') + '"}'));
					
					return res.send("{\"status\":\"successful\",\"action\":\"request_import\",\"import\":{\"type\":\"page\",\"start\":\""
							+ startMoment.format('YYYY-MM-DD') + "\",\"end\":\""
							+ endMoment.format('YYYY-MM-DD') + "\"}}");

				});

				app.get('/request_status',function(req,res) {
					 
					 console.log('a request');
					 
					 return res.send('{"ok":"ok"}');
					 });
				
				
				
				
				
				app.listen(2929);

			});

			return ok;
		}).then(null, console.warn);

/*
 * Declare Routes and verbs
 */
/*
 // simple get all quotes
 app.get('/', function(req,res) {
 res.json(quotes);
 console.log('a request');
 });

 // get random quote
 app.get('/quote/random', function(req,res) {
 var id = Math.floor(Math.random() * quotes.length);
 var q = quotes[id];
 res.json(q);
 });

 // get specific quote
 app.get('/quote/:id', function(req,res) {
 if(quotes.length <= req.params.id || req.params.id < 0) {
 res.statusCode = 404;
 return res.send('Error 404: No Quote Found');
 }
 var q = quotes[req.params.id];
 res.json(q);
 });


 // post a quote to the array
 var jsonParser = bodyParser.json();

 app.post('/quote', jsonParser, function(req,res) {
 console.log(req);
 if(!req.body.hasOwnProperty('author') ||
 !req.body.hasOwnProperty('text')) {
 res.statusCode = 400;
 return res.send('Error 400: Post syntax incorrect.');
 }
 var newQuote = {
 author : req.body.author,
 text : req.body.text
 };
 quotes.push(newQuote);
 res.json(true);
 });

 */
