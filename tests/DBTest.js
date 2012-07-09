
var should = require('should');
var sinon = require('sinon');

var fs = require('fs');

describe('DB', function() {

	var DB = require('../lib/DB.js').DB;

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

	it('should create a file storage for string argument', function() {
		var db = new DB(testdir);
		db.storage.inspect().should.include('FileStorage');
	});

	it('should save created storage for storage argument', function() {
		var SimpleInMemoryStorage = new require('../lib/SimpleInMemoryStorage.js').SimpleInMemoryStorage;
		var db = new DB(new SimpleInMemoryStorage());
		db.storage.inspect().should.include('MemoryStorage');
	});

	describe('create', function() {

		it('should create folder when call create', function() {
			var db = new DB(testdir);
			fs.existsSync(testdir).should.be.false;
			db.create();
			fs.existsSync(testdir).should.be.true;
		});

	});

	describe('drop', function() {

		it('should drop folder when call drop', function() {
			mkdir(testdir);
			fs.existsSync(testdir).should.be.true;
			var db = new DB(testdir);
			fs.existsSync(testdir).should.be.true;
			db.drop();
			fs.existsSync(testdir).should.be.false;
		});

	});

	describe('find', function() {

		it('should find all entries without arguments', function() {
			mkdir(testdir);
			fs.writeFileSync(testdir + '/file1.json', '{ "data": "from file one" }');
			fs.writeFileSync(testdir + '/file2.json', '{ "data": "from file two" }');

			fs.existsSync(testdir).should.be.true;
			var db = new DB(testdir);
			db.create();
			var result = db.find();
			result.should.an.instanceOf(Array);
			result.should.be.eql([{ "data": "from file one" }, { "data": "from file two" }]);
		});

		it('should find one entry if argument match', function() {
			mkdir(testdir);
			fs.writeFileSync(testdir + '/file1.json', '{ "data": "from file one" }');
			fs.writeFileSync(testdir + '/file2.json', '{ "data": "from file two" }');

			fs.existsSync(testdir).should.be.true;
			var db = new DB(testdir);
			db.create();
			var result = db.find({"data": "from file two"});
			result.should.an.instanceOf(Array);
			result.should.be.eql([{ "data": "from file two" }]);
		});

		it('should find no entry if argument not match', function() {
			mkdir(testdir);
			fs.writeFileSync(testdir + '/file1.json', '{ "data": "from file one" }');
			fs.writeFileSync(testdir + '/file2.json', '{ "data": "from file two" }');

			fs.existsSync(testdir).should.be.true;
			var db = new DB(testdir);
			db.create();
			var result = db.find({"match": "false"});
			result.should.an.instanceOf(Array);
			result.should.be.eql([]);
		});

	});

	describe('count', function() {

		it('should return zero for a fresh directory', function() {
			var db = new DB(testdir);
			db.create();

			db.count().should.be.equal(0);
		});

	});

});
