var EventEmitter;
(function(){
	EventEmitter = function(){};
	EventEmitter.prototype = {
		_listeners: null,
		_events: {
			complete: 1,
			fail: 1,
			success: 1,
			progress: 1
		},
		on (event, fn) {
			if (fn == null) 
				return this;
			
			if (event in this._events === false) {
				throw Error(`Unsupported event ${event}. Events: ` + Object.keys(this._event));
			}
			
			event_collection(this, event).push(fn);
			return this;
		},
		off (event, fn) {
			var fns = event_collection(this, event),
				i = fns.indexOf(fn);
			
			fns.splice(i, -1);
			return this;
		},
		emit (event, ...args) {
			event_emit(this, event, args);
			return this;
		},
		has (event) {
			return event_collection(this, event).length !== 0;
		}
	};
	
	function event_collection(emitter, event) {
		if (emitter._listeners == null) 
			emitter._listeners = {};
		
		var fns = emitter._listeners[event];
		if (fns == null) {
			fns = emitter._listeners[event] = [];
		}
		return fns;
	}
	function event_emit(emitter, event, args) {
		var fns = event_collection(emitter, event),
			fn;
	
		var i = -1, imax = fns.length;
		while( ++i < imax ){
			fn = fns[i];
			fn.apply(emitter, args);
		}
	}
}());