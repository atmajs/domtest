function str_truncate(str, length) {
	
	if (is_String(str) == false) 
		return str;
	
	return str.length < length
		? str
		: str.slice(0, length)
		;
}