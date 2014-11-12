function is_Array(ar) {
	return Array.isArray(ar);
}

function is_Boolean(arg) {
	return typeof arg === 'boolean';
}

function is_Null(arg) {
	return arg === null;
}

function is_NullOrUndefined(arg) {
	return arg == null;
}

function is_Number(arg) {
	return typeof arg === 'number';
}

function is_String(arg) {
	return typeof arg === 'string';
}

function is_Symbol(arg) {
	return typeof arg === 'symbol';
}

function is_Undefined(arg) {
	return arg === void 0;
}

function is_RegExp(re) {
	return obj_typeof(re) === 'RegExp';
}

function is_Object(arg) {
	return typeof arg === 'object' && arg !== null;
}

function is_Date(d) {
	return obj_typeof(d) === 'Date';
}

function is_Error(e) {
	return obj_typeof(e) === 'Error' || e instanceof Error;
}

function is_Function(arg) {
	return typeof arg === 'function';
}

function is_Buffer(buff){
	if (typeof Buffer === 'undefined') 
		return false;
	
	return buff instanceof Buffer;
}

function is_Arguments(x){
	return obj_typeof(x) === 'Arguments';
}

function is_Primitive(arg) {
	return arg === null
		|| typeof arg === 'boolean'
		|| typeof arg === 'number'
		|| typeof arg === 'string'
		|| typeof arg === 'symbol'
		|| typeof arg === 'undefined'
		;
}