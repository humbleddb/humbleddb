
var should = require('should');
var sinon = require('sinon');

describe('SimpleInMemoryStorage', function() {

	var SimpleInMemoryStorage = require('../lib/SimpleInMemoryStorage.js').SimpleInMemoryStorage;

	it('should clear all data when create was called', function() {
		var simpleInMemoryStorage = new SimpleInMemoryStorage();
		simpleInMemoryStorage.create();
	});

	it('should clear all data when drop was called', function() {
		var simpleInMemoryStorage = new SimpleInMemoryStorage();
		simpleInMemoryStorage.drop();
	});

	describe('count', function() {

		it('should return zero for a fresh memory database', function() {
			var simpleInMemoryStorage = new SimpleInMemoryStorage();
			simpleInMemoryStorage.create();

			simpleInMemoryStorage.count().should.be.equal(0);
		});

		it('should return the number of saved entries', function() {
			var simpleInMemoryStorage = new SimpleInMemoryStorage();
			simpleInMemoryStorage.create();
			simpleInMemoryStorage.saveEntry(null, null, 'file1', { "data": "from file one" });
			simpleInMemoryStorage.saveEntry(null, null, 'file2', { "data": "from file two" });

			simpleInMemoryStorage.count().should.be.equal(2);
		});

	});

	describe('linearSearch', function() {

		it('should not call error or entry callback on fresh directory', function() {
			var simpleInMemoryStorage = new SimpleInMemoryStorage();
			simpleInMemoryStorage.create();

			var errorCallback = sinon.spy();
			var successCallback = sinon.spy();
			var entryCallback = sinon.spy();

			simpleInMemoryStorage.linearSearch(errorCallback, successCallback, entryCallback);

			errorCallback.callCount.should.be.equal(0);
			successCallback.callCount.should.be.equal(1);
			entryCallback.callCount.should.be.equal(0);
		});

		it('should call entry callback for each json file', function() {
			var simpleInMemoryStorage = new SimpleInMemoryStorage();
			simpleInMemoryStorage.create();
			simpleInMemoryStorage.saveEntry(null, null, 'file1', { "data": "from file one" });
			simpleInMemoryStorage.saveEntry(null, null, 'file2', { "data": "from file two" });

			var errorCallback = sinon.spy();
			var successCallback = sinon.spy();
			var entryCallback = sinon.spy();

			simpleInMemoryStorage.linearSearch(errorCallback, successCallback, entryCallback);

			errorCallback.callCount.should.be.equal(0);
			successCallback.callCount.should.be.equal(1);
			entryCallback.callCount.should.be.equal(2);

			entryCallback.getCall(0).args[0].should.eql('file1');
			entryCallback.getCall(0).args[1].should.eql({ "data": "from file one" });
			entryCallback.getCall(0).args[0].should.eql('file1');
			entryCallback.getCall(1).args[1].should.eql({ "data": "from file two" });
		});

	});

});
