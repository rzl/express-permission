function ExpressPermission() {
	var that = this
	this.method = 'some'
	this.getPermissions = function(cb) {
		console.log('getPermissions')
		cb([])
	}
	this.some = function(req, res, next) {
		req[that.method] = function(arg) {
			that.getPermissions((permissions) => {
				console.log(permissions)
				if (typeof arg === 'string') {
					var re = arg.replace(/(\w)/g,"p='$1'")
					console.log(re)
					permissions.some((p) => { return eval(arg)}) ? next() : that.forbidden(req, res)
				} else {
					console.log('function')
					permissions.some(arg) ? next() : that.forbidden(req, res)
				}
			})
		}
		next()
	}
	this.forbidden = function(req, res, next) {
		res.status(403).send('forbidden')
	}
}

module.exports = new ExpressPermission()