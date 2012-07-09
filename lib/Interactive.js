
var util = require("util");
var repl = require("repl");
var vm = require('vm');

function Interactive() {
	this.prompt = '> ';
	this.useGlobal = false;
	this.ignoreUndefined = false;
	this.context = {};
}

Interactive.prototype.open = function() {
	// TODO ???
	console.log(util.inspect('humbleddb v0.1', false, 0, !process.env.NODE_DISABLE_COLORS));

	var cli = this.cli = repl.start(this.prompt, undefined, this.eval, this.useGlobal, this.ignoreUndefined);

	// remove all default repl commands
//  repl.commands = {};
	['clear', 'load', 'save'].forEach(function(key, value) {
//	    console.log('remove command .' + key + ' from repl.commands');
		delete cli.commands['.' + key];
	});

	// remove all default context objects
	for (var key in cli.context) {
//	    console.log('remove variable ' + key + ' from repl.context');
		delete cli.context[key];
	}

	// initialize context
	for (var key in this.context) {
		cli.context[key] = this.context[key];
	}

	// add internal helper variables
	cli.context.help = this.help;
	cli.context.clear = this.clear;
	cli.context.close = cli.context.quit = cli.context.exit = this.close;

	cli.context.showAll = this.showContext;
	cli.context.showFunctions = this.showFunctions;
	cli.context.showVariables = this.showVariables;

	// required for hasArguments call in eval
	cli.context.interactive = this;

	// debugging
	cli.context.cli = cli;
};

Interactive.prototype.eval = function(code, context, file, cb) {
	try {
		// TODO why this is here repl and not interactive instance?
		var hasArguments = this.context.interactive.hasArguments;
		var result;
		if (this.useGlobal) {
			result = vm.runInThisContext(code, file);
			if (typeof result == 'function' && !hasArguments(result.toString())) {
				result = vm.runInThisContext('(' + result + ')()', file);
			}
		} else {
			result = vm.runInContext(code, context, file);
			if (typeof result == 'function' && !hasArguments(result.toString())) {
				result = vm.runInContext('(' + result + ')()', context, file);
			}
		}
		cb(undefined, result);
	} catch (e) {
		cb(e, undefined);
	}
};

/*
 * Check if the given function (as string) requires one or more arguments.
 */
Interactive.prototype.hasArguments = function(functionString) {
//	console.log('first line: ' + functionString.substr(0, functionString.indexOf('\n')));
//	console.log(functionString.match(/^function ([A-Za-z0-9_]+)?\(\)/));
	// If NOT function xyz() and not function () we should need arguments for this function.
	return functionString.search(/^function ([A-Za-z0-9_]+)?\(\)/) == -1;
};

Interactive.prototype.close = function() {
	this.cli.prompt = '';
	this.cli.rli.close();
	return 'Bye!';
};

Interactive.prototype.clear = function() {
	console.log('\x1b[1J\x1b[0;0H');
	return 'humbleddb v0.1'; // TODO ??
};

Interactive.prototype.help = function() {
	// TODO context scoping is ugly here..
	var context = this.context;
	if (typeof interactive != 'undefined') {
		context = interactive.context;
	}
//	if (typeof cli != 'undefined') {
//		context = cli.context;
//	}

	console.log('');
	console.log('Type help for this information.');
	console.log('');
	console.log('Type exit or quit to close interactive shell.');
	console.log('');
	console.log('Available in your context:');
	for (var key in context) {
		if (typeof context[key] == 'function' && Object.keys(context[key].prototype).length > 0) {
			console.log('\tclass ' + key);
		} else {
			console.log('\t' + typeof context[key] + ' ' + key);
		}
	}
	console.log('');
	return 'OK';
};

Interactive.prototype.showContext = function() {
	// TODO does not work currently..
	this.showFunctions();
	this.showVariables();
	return 'OK';
};

Interactive.prototype.showFunctions = function() {
	var context = cli.context;

	console.log('Available functions:');
	for (var key in context) {
		if (typeof context[key] == 'function') {
			if (Object.keys(context[key].prototype).length > 0) {
				console.log('\tclass ');
			} else {
				console.log('\tfunction ');
			}

			var result = context[key].toString().match(/^function ([A-Za-z0-9_]+)?\(([A-Za-z0-9_, ]+)?\)/);
			if (result[2] == undefined) {
				console.log(key + '()');
			} else {
				console.log(key + '(' + result[2] + ')');
			}
		}
	}
	console.log('');
	return 'OK';
};

Interactive.prototype.showVariables = function() {
	var context = cli.context;

	console.log('Available variables:');
	for (var key in context) {
		if (typeof context[key] == 'object') {
			console.log('\t' + typeof context[key] + ' ' + key);
		}
	}
	console.log('');
	return 'OK';
};

if (typeof exports != 'undefined') {
	exports.Interactive = Interactive;
}
