
function Cursor() {
	this.instance = Math.round(Math.random() * 0xffffffff);
}

Cursor.prototype.inspect = function() {
	return 'Cursor@' + this.instance.toString(16) + ' [todo]';
};

Cursor.prototype.count = function() {
	return -1;
};

if (typeof exports != 'undefined') {
	exports.Cursor = Cursor;
}
