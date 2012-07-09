# humbledDB

Version 0.1, 07/2012

MongoDB comes from "humongous", and, yes, this is more humbled.. :-)

### Why just another database?

Because all databases are simple to install<br/>
but it makes no fun to maintain them, right?<br/>
-> You checked their security?<br/>
-> You create automatically updates?<br/>
-> You create automatically backups?<br/>

So this db saves simple files which you could be read, update, backup
with your standard commandline tools.

## API

### Simple code (but not the final api yet):

Save some data:

	var db = new DB();
	db.save({name: 'yeah', text: 'this is simple!'});

And load it:

	db.find({name: 'yeah'});

Should support callbacks later. Like this:

	// This works async
	db.find({name: 'yeah'},
	   	function(name, data) {
	   	     console.info('found data: ' + data);
	   	 }, function(error) {
	   	     console.error(error);
	   	 }
	);

## And if i embed this, how fat is it?

	find lib | xargs wc -l

Currently ~500 lines (for browser and node.js)!<br/>
Incl. nearly 200 lines for an interactive console!

	find tests | xargs wc -l

Currently ~500 lines, too!

If this project has anytime more than 10.000 lines, its failed!<br/>
Target for version 1.0, less than 2.000 simple, readable and full documentated lines of code.

## Supported backends (called storages)
* HTML5 localStorage (browser)
* Filesystem (node.js)
* In Memory (browser and node.js)
* maybe we could split client and server of database later with socket.io
* Minified version for the browser which include DB.js, Html5LocalStorageStorage.js and all dependencies

## Roadmap

1.  Filename mapping!!
    
        db.save({
            issueNumber: 4711, type: 'BUG',
            title: 'Found a bug', /*....*/});
    
    -> Will create file bug-4711.json!<br/> 
	-> Save this into the db configuration.

2.  Auto increment support (auto. set an id)
3.  Pre-Save- and Post-Load Hooks
4.  Separate and reintegrate object childrens
5.  Simple simple Indexes!

