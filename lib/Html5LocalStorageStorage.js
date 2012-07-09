
function Html5LocalStorageStorage(mockLocalStorage) {
	this.instance = Math.round(Math.random() * 0xffffffff);
	this.localStorage = mockLocalStorage || localStorage;
	if (!this.localStorage) {
		throw new Error('localStorage not found');
	}
}

Html5LocalStorageStorage.prototype.inspect = function() {
	return 'Html5LocalStorageStorage@' + this.instance.toString(16);
};

Html5LocalStorageStorage.prototype.create = function() {
};

Html5LocalStorageStorage.prototype.drop = function() {
	this.localStorage.clear();
};

Html5LocalStorageStorage.prototype.count = function() {
	return this.localStorage.length;
};

Html5LocalStorageStorage.prototype.saveEntry = function(errorCallback, successCallback, name, data) {
	this.localStorage.setItem(name, JSON.stringify(data, null, '\t'));

	if (successCallback)
		successCallback();
};

// TODO name parameter fehlt
Html5LocalStorageStorage.prototype.loadEntry = function(errorCallback, successCallback, entryCallback) {
	entryCallback(name, JSON.parse(this.localStorage.getItem(name)));

	if (successCallback)
		successCallback();
};

Html5LocalStorageStorage.prototype.linearSearch = function(errorCallback, successCallback, entryCallback) {
	// small workaround for the mock localStorage
	for (var name in (this.localStorage.data ? this.localStorage.data : this.localStorage)) {
		entryCallback(name, JSON.parse(this.localStorage.getItem(name)));
	}

	if (successCallback)
		successCallback();
};

if (typeof exports != 'undefined') {
	exports.Html5LocalStorageStorage = Html5LocalStorageStorage;
}
