function ExpressPermission() {
	var that = this
	this.reqMethodName = 'somePermission'
	this.getPermissions = function(req, res, cb) {
		cb([])
	}
	this.some = function(arg, permissions) {
		if (typeof arg === 'string') {
			arg = arg.replace(/\(/g,'( ')
			arg = arg.replace(/\)/g,' )')
			var str = arg.split(/\s+/).map((x) => {
				if (['||', '&&', '(', ')'].indexOf(x) > -1) {
					return x
				} else {
					return permissions.indexOf(x) > -1
				}
			}).join(' ')
			return eval(str)
		} else {
			return false
		}
	}
	this.somePermission = function(req, res, next) {
		req[that.reqMethodName] = function(arg, cb) {
			that.getPermissions(req, res, (permissions) => {
				cb(that.some(arg, permissions))
			})
		}
		next()
	}
	this.verify = function(arg, forbidden_fn) {
		return ((arg) => {
			return function(req, res, next ) {
				that.getPermissions(req, res, (permissions) => {
					forbidden_fn = forbidden_fn || that.forbidden
					that.some(arg, permissions) ? next() : forbidden_fn(req, res, next)
				})
			}
		})(arg, forbidden_fn)
	}
	this.forbidden = function(req, res, next) {
		res.status(403).send('forbidden')
	}
	this.next = function(req, res, next) {
		next()
	}
	this.init = function(opt) {
		opt = opt || {}
		this.reqMethodName = opt.reqMethodName === undefined ? this.reqMethodName : opt.reqMethodName
		this.getPermissions = opt.getPermissions === undefined ? this.getPermissions : opt.getPermissions
		this.forbidden = opt.forbidden === undefined ? this.forbidden : opt.forbidden
		return this.somePermission
	}
}

module.exports = new ExpressPermission()
