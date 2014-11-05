
var requestQueue = 'solr_request';

var open = require('amqplib').connect('amqp://localhost:5672');

open.then(function(conn) {

  var ok = conn.createChannel();

  ok = ok.then(function(ch) {

    ch.assertQueue(requestQueue,{durable:true});

    ch.sendToQueue(requestQueue, new Buffer('{"type":"page","start":"2013-01-01","end":"2013-02-01"}'));

  });

  return ok;

}).then(null, console.warn);
