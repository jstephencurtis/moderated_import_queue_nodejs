
var requestQueue = 'solr_request';

var open = require('amqplib').connect('amqp://localhost:5672');

open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    ch.assertQueue(requestQueue);
    ch.consume(requestQueue, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
  return ok;
}).then(null, console.warn);





