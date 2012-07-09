
var requiredFiles = ['DB', 'Cursor', 'FileStorage', 'InMemoryStorage', 'Interactive'];

for (var i = 0; i < requiredFiles.length; i++) {
	var imports = require('./' + requiredFiles[i] + '.js');
	for (var key in imports) {
		exports[key] = imports[key];
	}
}
