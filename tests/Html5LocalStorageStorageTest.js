
var should = require('should');
var sinon = require('sinon');

describe('Html5LocalStorageStorage', function() {

	function LocalStorage() {
		this.data = [];
		this.length = 0;
	};

	LocalStorage.prototype.getItem = function(key) {
		return this.data[key];
		this.length = this.data.length;
	};

	LocalStorage.prototype.setItem = function(key, value) {
		this.data[key] = value;
		this.length = this.data.length;
	};

	LocalStorage.prototype.removeItem = function(key) {
		delete this.data[key];
		this.length = this.data.length;
	};

	LocalStorage.prototype.clear = function() {
		this.data = [];
	};

	var Html5LocalStorageStorage = require('../lib/Html5LocalStorageStorage.js').Html5LocalStorageStorage;

	describe('create', function() {

		it('should create folder when call create', function() {
			var html5LocalStorageStorage = new Html5LocalStorageStorage(new LocalStorage());
			html5LocalStorageStorage.create();
		});

	});

	describe('drop', function() {

		it('should drop folder when call drop', function() {
			var html5LocalStorageStorage = new Html5LocalStorageStorage(new LocalStorage());
			html5LocalStorageStorage.drop();
		});

	});

	describe('count', function() {

		it('should return zero for a fresh directory', function() {
			var html5LocalStorageStorage = new Html5LocalStorageStorage(new LocalStorage());
			html5LocalStorageStorage.create();

			html5LocalStorageStorage.count().should.be.equal(0);
		});
	});

	describe('linearSearch', function() {

		it('should not call error or entry callback on fresh directory', function() {
			var simpleFileStorage = new Html5LocalStorageStorage(new LocalStorage());
			simpleFileStorage.create();

			var errorCallback = sinon.spy();
			var successCallback = sinon.spy();
			var entryCallback = sinon.spy();

			simpleFileStorage.linearSearch(errorCallback, successCallback, entryCallback);

			errorCallback.callCount.should.be.equal(0);
			successCallback.callCount.should.be.equal(1);
			entryCallback.callCount.should.be.equal(0);
		});

		it('should call entry callback for each json file', function() {
			var localStorage = new LocalStorage();
			localStorage.setItem('file1', '{ "data": "from file one" }');
			localStorage.setItem('file2', '{ "data": "from file two" }');

			var html5LocalStorageStorage = new Html5LocalStorageStorage(localStorage);
			html5LocalStorageStorage.create();

			var errorCallback = sinon.spy();
			var successCallback = sinon.spy();
			var entryCallback = sinon.spy();

			html5LocalStorageStorage.linearSearch(errorCallback, successCallback, entryCallback);

			errorCallback.callCount.should.be.equal(0);
			successCallback.callCount.should.be.equal(1);
			entryCallback.callCount.should.be.equal(2);

			entryCallback.getCall(0).args[0].should.eql('file1');
			entryCallback.getCall(0).args[1].should.eql({ "data": "from file one" });
			entryCallback.getCall(1).args[0].should.eql('file2');
			entryCallback.getCall(1).args[1].should.eql({ "data": "from file two" });
		});

	});

});
