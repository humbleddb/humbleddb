
var should = require('should');
var sinon = require('sinon');

var fs = require('fs');

describe('SimpleFileStorage', function() {

	var SimpleFileStorage = require('../lib/SimpleFileStorage.js').SimpleFileStorage;

	var testdir = 'tmp/testdata';

	var mkdir = function(dir) {
		var part;
		testdir.split('/').forEach(function(dir) {
			part = part ? part + '/' + dir : dir;
			fs.mkdirSync(part);
		});
	};

	var rmdir = function(dir) {
		if (!fs.existsSync(dir)) {
			return;
		}

		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			if (fs.statSync(dir + '/' + file).isFile()) {
				fs.unlinkSync(dir + '/' + file);
			} else {
				rmdir(dir + '/' + file);
			}
		});
		fs.rmdirSync(dir);
	};


	beforeEach(function() {
		rmdir('tmp');
	});

	afterEach(function() {
		rmdir('tmp');
	});

	it('should NOT create folder when create instance', function() {
		var simpleFileStorage = new SimpleFileStorage(testdir);
		fs.existsSync(testdir).should.be.false;
	});

	describe('create', function() {

		it('should create folder when call create', function() {
			var simpleFileStorage = new SimpleFileStorage(testdir);
			fs.existsSync(testdir).should.be.false;
			simpleFileStorage.create();
			fs.existsSync(testdir).should.be.true;
		});

	});

	describe('drop', function() {

		it('should drop folder when call drop', function() {
			mkdir(testdir);
			fs.existsSync(testdir).should.be.true;
			var simpleFileStorage = new SimpleFileStorage(testdir);
			fs.existsSync(testdir).should.be.true;
			simpleFileStorage.drop();
			fs.existsSync(testdir).should.be.false;
		});

	});

	describe('count', function() {

		it('should return zero for a fresh directory', function() {
			var simpleFileStorage = new SimpleFileStorage(testdir);
			simpleFileStorage.create();

			simpleFileStorage.count().should.be.equal(0);
		});

		it('should return the number of external created files', function() {
			var simpleFileStorage = new SimpleFileStorage(testdir);
			simpleFileStorage.create();
			fs.writeFileSync(testdir + '/file1.json', '{ "data": "from file one" }');
			fs.writeFileSync(testdir + '/file2.json', '{ "data": "from file two" }');

			simpleFileStorage.count().should.be.equal(2);
		});

	});

	describe('linearSearch', function() {

		it('should not call error or entry callback on fresh directory', function() {
			var simpleFileStorage = new SimpleFileStorage(testdir);
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
			var simpleFileStorage = new SimpleFileStorage(testdir);
			simpleFileStorage.create();
			fs.writeFileSync(testdir + '/file1.json', '{ "data": "from file one" }');
			fs.writeFileSync(testdir + '/file2.json', '{ "data": "from file two" }');

			var errorCallback = sinon.spy();
			var successCallback = sinon.spy();
			var entryCallback = sinon.spy();

			simpleFileStorage.linearSearch(errorCallback, successCallback, entryCallback);

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
