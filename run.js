
var humbleddb = require('./lib/humbleddb.js');

console.log('');
console.log('humbleddb interactive');
console.log('');

var interactive = new humbleddb.Interactive();

interactive.context.console = console;
interactive.context.humbleddb = humbleddb;
interactive.context.DB = humbleddb.DB;
interactive.context.FileStorage = humbleddb.FileStorage;
interactive.context.InMemoryStorage = humbleddb.InMemoryStorage;
interactive.context.db = new humbleddb.DB('data');

interactive.help();
interactive.open();
