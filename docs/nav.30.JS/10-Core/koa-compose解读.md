> compose 是一个工具函数，Koa.js 的中间件通过这个工具函数组合后，按 app.use() 的顺序同步执行，也就是形成了 洋葱圈 式的调用，源码地址[https://github.com/koajs/compose/blob/master/index.js](https://github.com/koajs/compose/blob/master/index.js)

## 实现一个简单版的递归洋葱模型

```js
function compose (middleware) {
  // 校验传入middleware是否为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 校验数组中的每一项是否为Function
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context) {
    // 设定一个递归启动点
    return dispatch(0)
    function dispatch (i) {
      // 取出当前的中间件，fn指向每一个中间件
      const fn = middleware[i]
      // 递归终止条件
      if (!fn) return
      // 执行当前中间件
      fn(context)
      // 形成递归调用
      return dispatch(i + 1)
    }
  }
}
```

进行测试

```js
// 简单准备第三个中间件
const mw1 = () => console.log('mw1')
const mw2 = () => console.log('mw2')
const mw3 = () => console.log('mw3')

const fn = compose([mw1, mw2, mw3]) 
fn() // mw3 mw2 mw1
```

## 支持异步

- 使用```next```表示开启下个中间件的函数句柄
- 使用```bind```对```dispatch```进行函数改造

```js
function compose (middleware) {
  // 校验传入middleware是否为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 校验数组中的每一项是否为Function
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    // 设定一个递归启动点
    return dispatch(0)
    function dispatch (i) {
      // 取出当前的中间件，fn指向每一个中间件
      const fn = middleware[i]
      // 递归终止条件
      if (!fn) return
      // 改造当前中间件执行时传入的参数，将下一个中间件的含数句柄，作为第二个参数 next 传入
      // 这里的bind为null表示this指针将指向global
      return fn(context, dispatch.bind(null, i + 1))
    }
  }
}
```

进行测试

```js
const mw1 =  (ctx, next) => {
  console.log('mw1')
  setTimeout(()=>{
    console.log('mw1 wait for 2s')
    next()
  }, 2000)
  console.log('mw1 after')
}
const mw2 = (ctx, next) => {
  console.log('mw2')
  setTimeout(()=>{
    console.log('mw2 wait for 2s')
    next()
  },2000)
  console.log('mw2 after')
}
const mw3 = function (ctx, next) {
  console.log('mw3')
  console.log('mw3 after')
}

const fn = compose([mw1, mw2, mw3]) 
fn()
```

## 支持```thenable```

```js
function compose (middleware) {
  // 校验传入middleware是否为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 校验数组中的每一项是否为Function
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (context, next) {
    // 设定一个递归启动点
    return dispatch(0)
    function dispatch (i) {
      // 取出当前的中间件，fn指向每一个中间件
      const fn = middleware[i]
      if (i === middlewares.length) fn = next
      // 调用最后一个中间件
      if (!fn) return Promise.resolve()
      try {
        // ⑥ 成功调用
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        // ⑦ 成功过程出错
        return Promise.resolve()
      }
    }
  }
}
```

## 防止多次调用 ```next``` 的调用次数

我们知道依次深入到最内层，再原路返回到最外层，就是一次完整的洋葱模型。对于代码设计中的 ```index``` 与 ```i``` 的关系，也是一个设计巧妙的宝盒。如下测试代码，在 ```mw1``` 中调用多次 ```next``` 函数

```js
async function mw1 (context, next) {
  console.log('===== middleware 1 =====')
  next()
  next() // 预计这里是会爆出一个错误，但是为什么呢？是如何工作的呢？
}

function mw2 (context, next) {
  console.log('===== middleware 2 =====')
  next()
}

async function mw3 (context, next) {
  console.log('===== middleware 3 =====')
}
```

![compose-prevent-multiple-time-next](https://user-images.githubusercontent.com/1658546/93297997-fb7ce980-f824-11ea-8384-564e9e309604.png)


如上图我们可以知道，用 ```index``` 去标记 ```i``` 曾经到达过的最深层词的中间件的下标，那么就能有效防止再原路返回时，每个中间件再次出触发 ```next``` 深入深层次的情况。

```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    // 表示初始的层次
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 当前调用的层次，是否小于曾经到过的最大层次(变相判断这一个中间件的next是否已经调用过了)
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // 通过了上面的校验，就标记本次到达的最深层次
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

## componse 结果

若还是不太明白上面写法的原理，那我们来看看 ```compose``` 组合 ```middleware``` 后的结果会是什么样子

```js
const [mid1, mid2, mid3] = middlewares
// compose 可以理解为
const fnMiddleware = function(ctx) {
  return Promise.resolve(
    mid1(ctx, function next () {
     return Promise.resolve(
       mid2(ctx, function next () {
          return Promise.resolve(
            mid3(ctx, function next() {
              return Promise.resolve()
           }) 
         )
       })
     )
   })
 )
}
```

## 整体源码解读

```js
'use strict'

/**
 * Expose compositor.
 */
module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 * 👉 原文译: 将所有中间件组合,返回一个包含所有传入中间件的函数
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  // 校验传入middleware是否为数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 校验数组中的每一项是否为Function
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  // 返回一个每个中间件依次串联的函数闭包
  // 其实第一次调用 return fnMiddleware(ctx).then(handleResponse).catch(onerror); 时并没有传入第二个next参数，当然也传入不了
  return function (context, next) {
    // last called middleware #
    // 这里的 index 是用于防止在一个中间件中重复调用 next() 函数，初始值设置为 -1
    let index = -1

    // 启动递归，遍历所有中间件
    return dispatch(0)

    // 递归包装每一个中间件,并且统一输出一个 Promise 对象
    function dispatch (i) {
      // 注意随着 next() 执行，i、index + 1、当前中间件的执下标，在进入每个中间件的时候会相等
      // 每执行一次 next (或者dispatch) 上面三个值都会加 1

      /* 原理说明: 
       * 当一个中间件中调用了两次 next方法，第一次next调用完后，洋葱模型走完，index的值从 -1 变到了 middlewares.length,
       * 此时第一个某个中间件中的 next 再被调用，那么当时传入的 i + 1 的值，必定是 <= middlewares.length 的
       */
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))

      // 通过校验后，index 与 i 的值同步
      index = i

      // 取出一个中间件函数
      let fn = middleware[i]

      // 若执行到了最后一个，(其实此时的next也一定为undefined),我认为作者是为何配合下一句一起判断中间件的终结
      if (i === middleware.length) fn = next
      // 遍历到了最后一个中间件，则返回一个 resolve 状态的 Promise 对象
      if (!fn) return Promise.resolve()

      try {
        // 递归执行每一个中间件，当前中间件的 第二个 入参为下一个中间件的 函数句柄(此处用bind实现)
        // 这里注意：每一个 next 函数，都是下一个 dispatch函数，而这个函数永远会翻译一个 Promise 对象
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        // 中间件执行过程中出错的异常捕获
        return Promise.reject(err)
      }
    }
  }
}
```
