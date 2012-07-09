
// in node.js load dependencies
if (typeof require == 'function') {
	var searchjs = require('searchjs');
	var SimpleFileStorage = require('./SimpleFileStorage.js').SimpleFileStorage;
}

function DB(storage) {
	// in node.js we use filestorage as default
	if (typeof require == 'function') {
		if (typeof storage == 'string') {
			this.storage = new SimpleFileStorage(storage);
		} else {
			this.storage = storage;
		}
	} else {
		// in the browser we use localStorage as default
		// TODO
//		if (typeof storage == 'string') {
//			this.storage = new Html5LocalStorageStorage(storage);
//		} else {
			this.storage = new Html5LocalStorageStorage();
//		}
	}
}

DB.prototype.create = function() {
	this.storage.create();
	/*
	var db = new DB(this.datadir + '/' + name);
	this[name] = db;
	return db;
	*/
};

DB.prototype.drop = function() {
	this.storage.drop();
};

DB.prototype.count = function() {
	return this.storage.count();
};

DB.prototype.find = function(query) {
	var result = [];
	this.storage.linearSearch(null, null, function(name, data) {
		if (!query || searchjs.matchObject(data, query)) {
			result.push(data);
		}
	});
	return result;
};

DB.prototype.save = function(data) {
	if (typeof data != 'object') {
		throw new Error('Toplevel entry must be an "object", but was a "' + typeof data + '"');
	}

	var name = this.createFilename(data);
	this.storage.saveEntry(null, null, name, data);
};

DB.prototype.update = function(query, newData) {
	var result = [];
	this.storage.linearSearch(null, null, function(name, data) {
		if (searchjs.matchObject(data, query)) {
			this.saveEntry(null, null, name, newData);
			result.push(newData);
		}
	});
	return result;
};

DB.prototype.createUuid = function() {
	return Math.round(Math.random() * 1000);
};

DB.prototype.createFilename = function(data) {
	return Math.round(Math.random() * 1000);
};

if (typeof exports != 'undefined') {
	exports.DB = DB;
}
