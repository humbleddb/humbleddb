
var path = require('path');
var fs = require('fs');

function SimpleFileStorage(datadir) {
	this.instance = Math.round(Math.random() * 0xffffffff);
	this.datadir = path.normalize(datadir);
}

SimpleFileStorage.prototype.inspect = function() {
	return 'SimpleFileStorage@' + this.instance.toString(16) + ' [datadir=' + this.datadir + ']';
};

SimpleFileStorage.prototype.create = function() {
	var part;
	this.datadir.split('/').forEach(function(dir) {
		part = part ? part + '/' + dir : dir;
		if (!fs.existsSync(part)) {
			fs.mkdirSync(part);
		}
	});
};

SimpleFileStorage.prototype.drop = function() {
	if (fs.existsSync(this.datadir)) {
		fs.rmdirSync(this.datadir);
	}
};

SimpleFileStorage.prototype.count = function() {
	var stat = fs.statSync(this.datadir);
	return stat.nlink - 2;
};

SimpleFileStorage.prototype.saveEntry = function(errorCallback, successCallback, name, data) {
	var filename = this.datadir + '/' + name + '.json';
	fs.writeFileSync(filename, JSON.stringify(data, null, '\t'));

	if (successCallback)
		successCallback();
};

SimpleFileStorage.prototype.loadEntry = function(errorCallback, successCallback, entryCallback, name) {
	var filename = this.datadir + '/' + name + '.json';
	if (fs.statSync(filename).isFile()) {
		var content = fs.readFileSync(filename).toString();
		var data = JSON.parse(content);
		entryCallback(name, data);
	}

	if (successCallback)
		successCallback();
};

SimpleFileStorage.prototype.linearSearch = function(errorCallback, successCallback, entryCallback) {
	var files = fs.readdirSync(this.datadir);
	for (var i = 0; i < files.length; i++) {
		if (files[i].match('.json$') && fs.statSync(this.datadir + '/' + files[i]).isFile()) {
			var name = files[i].substring(0, files[i].length - 5);
			var content = fs.readFileSync(this.datadir + '/' + files[i]).toString();
			var data = JSON.parse(content);
			entryCallback(name, data);
		}
	}

	if (successCallback)
		successCallback();
};

if (typeof exports != 'undefined') {
	exports.SimpleFileStorage = SimpleFileStorage;
}
