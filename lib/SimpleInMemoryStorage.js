
function SimpleInMemoryStorage() {
	this.instance = Math.round(Math.random() * 0xffffffff);
	this.data = {};
}

SimpleInMemoryStorage.prototype.inspect = function() {
	return 'SimpleInMemoryStorage@' + this.instance.toString(16);
};

SimpleInMemoryStorage.prototype.create = function() {
	this.data = {};
};

SimpleInMemoryStorage.prototype.drop = function() {
	this.data = {};
};

SimpleInMemoryStorage.prototype.count = function() {
	return Object.keys(this.data).length;
};

SimpleInMemoryStorage.prototype.saveEntry = function(errorCallback, successCallback, name, data) {
	this.data[name] = data;

	if (successCallback)
		successCallback();
};

SimpleInMemoryStorage.prototype.loadEntry = function(errorCallback, successCallback, entryCallback) {
	entryCallback(name, this.data[name]);

	if (successCallback)
		successCallback();
};

SimpleInMemoryStorage.prototype.linearSearch = function(errorCallback, successCallback, entryCallback) {
	for (var name in this.data) {
		entryCallback(name, this.data[name]);
	}

	if (successCallback)
		successCallback();
};

if (typeof exports != 'undefined') {
	exports.SimpleInMemoryStorage = SimpleInMemoryStorage;
}
