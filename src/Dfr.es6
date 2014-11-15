function Dfr() {}

Dfr.prototype = {
	resolved: null,
	rejected: null,
	
	_resolveCb: null,
	_rejectCb : null,
	_alwaysCb : null,
	
	resolve (...args) {
		this.resolved = args;
		dfr_call(this._resolveCb, args);
		dfr_call(this._alwaysCb);
		dfr_clear(this);
	},
	reject (...args) {
		this.rejected = args;
		dfr_call(this._rejectCb, args);
		dfr_call(this._alwaysCb);
		dfr_clear(this);
	},
	done (cb) {
		if (cb == null) 
			return this;
		if (this.resolved) {
			cb.apply(null, this.resolved);
			return this;
		}
		if (this.rejected == null) {
			dfr_bind(this, 'resolve', cb);
		}
		return this;
	},
	fail (cb) {
		if (cb == null) 
			return this;
		if (this.rejected) {
			cb.apply(null, this.rejected);
			return this;
		}
		if (this.resolved == null) {
			dfr_bind(this, 'reject', cb);
		}
		return this;
	},
	always (cb) {
		if (cb == null) 
			return this;
		if (this.rejected || this.resolved) {
			cb();
			return this;
		}
		dfr_bind(this, 'always', cb);
		return this;
	},
	then (ok, fail) {
		return this.done(ok).fail(fail);
	}
};