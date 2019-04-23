# express-permission
express permission middleware
> * 安装
npm install express-permission-middleware -S

> * 中间件启用
```js
var express = require('express');
var app = express();
var p = require('express-permission-middleware');
app.use(p.init({
  reqMethodName: 'somePermission',
  forbidden: function(req, res, next) {
    res.status(403).send('global forbidden method')
  },
  getPermissions: function(req, res, cb) {
    console.log('dynamic get user permissions')
    // permissions cache in req
    if (req._permissions === undefined) {
      req._permissions = ['a','b']
    }
    cb(req._permissions)
  }
}))
```
### 1. 中间件初始化的参数
| 参数名称        | 描述   | 
| --------   | -----:  | 
| reqMethodName     | 自定义req中调用插件的名称，默认值(somePermission) 即在路由中可以调用req.somePermission|   
| getPermissions        |   定义用户获取权限数组的方法   |  
| forbidden        |    定义权限不足是默认的返回    | 


> * 中间件在路由中启用
主要的有两个方法参数都是一样的

1.p.verify中间件的函数 

| 参数名称        | 说明   | 
| --------   | -----:  | 
| 参数1     | 权限验证表达式 如'a','a && b', 'a \|\| (b && c)'|   
| 参数2        |   传入权限不足时调用的方法，如果设置该参数，则不会调用设定的全局的权限不足处理函数   |  

2.req.somePermission 请求的附加函数（其中somePermission可以通过reqMethodName自定义）

| 参数名称        | 说明   | 
| --------   | -----:  | 
| 参数1     | 权限验证表达式 如'a','a && b', 'a \|\| (b && c)'|  
| 参数2        |   验证结果处理回调函数 (result)   |
```js
var p = require('express-permission-middleware');
/* GET home page. */
router.get('/', 
  p.verify('a && (b && c)', (req, res, next) => {
    console.log('forbidden in router ')
    next()
  }),
  (req, res, next) => { 
    req.somePermission('a && (b && c)', (result) => {
      console.log('using in req method result: ' + result)
      if (result) {
        res.render('index', { title: 'Express' });
      } else {
        next()
      }
    }
  )},
  p.verify('a && (b && c)'),
  function(req, res, next) {
    res.render('index', { title: 'Express' });
  }
);
```
