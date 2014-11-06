


<h1>Solr Import Queue</h1>

<h2>Basic Idea</h2>

A nodejs server that provides a REST api to moderate solr import jobs
between two RabbitMQ queues. 

<h2>Less Basic...</h2>

The developers will "request" an import be run for a certain import
type and certain time window by putting a message on the first queue.

Ops will allow messages to move from the request queue to the 
approved queue via a REST call to the nodejs arbitrator.

The nodejs worker will pick up the message from the approved queue 
and make sure that the correct command line import is run.


<h2>Goals</h2>

Backwards compatiblility with the existing import process,the command line imports will work just like they always have.

Simplistic Design; the logic for the import moderation is built into this small	service instead of being put into the already complex import code.

Transparent; the REST api will expose lots of info about the state of the queues and individual imports and will log a lot so that ops can track down what happened if there is ever an issue.


<h2>Setup</h2>

npm install  (this will install nodejs dependencies from package.json)


<h2>Api Reference</h2>

GET /request_status
	this returns a json object representing all imports in the 
	requested queue

example reponse:
```javascript
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
```

POST /request_import

```javascript
{
   "type":"page",
   "start":"2013-01-01",
   "end":"2013-02-01"
}
```


example import request message json

```javascript
{
    "type": "page",
    "start": "2013-01-01",
    "end": "2013-02-01",
    "submitted": "2014-10-31 14:22:23"
}
```



