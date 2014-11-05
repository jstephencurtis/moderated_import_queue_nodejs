


Solr Import Queue

A node server that provides a REST api to moderate solr import jobs
between two RabbitMQ queues. 

The developers will "request" an import be run for a certain import
type and certain time window by putting a message on the first queue.

Ops will allow messages to move from the request queue to the 
approved queue via a REST call to node arbitrator.

The node worker will pick the message up from the approved queue 
and make sure that the correct command line import is run.


Goals:

Backwards compatiblility in the import process
	the command line imports will work just like they always have

Simplicity/Decoupled
	the logic for the import moderation is built into this small
	service instead of being put into the already complicated
	import code

Transparency
	the REST api will expose lots of info about the state of the 
	queues and individual imports and will log a lot so that 
	ops can track down what happened if there is ever an issue


Setup

npm install  (this will install nodejs dependencies from package.json)


Use

GET /request_status
	this returns a json object representing all imports in the 
	requested queue

example reponse:

{
    "num_requests":"2",
    "requests":{
	{
	    "type":"page",
	    "start":"2013-01-01",
	    "end":"2013-02-01",
	    "submitted":"2014-10-31 14:22:23"
	},
	{...}
    }
}


POST /request_import

{
   "type":"page",
   "start":"2013-01-01",
   "end":"2013-02-01"
}



example import request message json

{
    "type": "page",
    "start": "2013-01-01",
    "end": "2013-02-01",
    "submitted": "2014-10-31 14:22:23"
}




