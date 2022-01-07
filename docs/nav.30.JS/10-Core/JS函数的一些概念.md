---
title: JS函数的一些概念
---

## 什么是函数？

length、name

参数或返回值为函数的函数为高阶函数

## 高阶函数特性

- 接受一个或多个函数作为输入
- 输出一个函数

## AOP

与业务逻辑无关的功能抽离出来，通过“动态植入”的方式浸入到业务逻辑中

例如吃过大蒜，说话之前先刷牙

```js
function say (who) {
  console.log(who + 'say')
}

Function.prototype.before = function (fn) {
  return who => {
    fn()
    this(who)
  }
}

const newSay = say.before(function () {
  console.log('刷牙')
})

newSay()
```

# 柯里化currying

将使用多个参数的函数转换成一系列使用单个参数的函数，并且返回接受余下的参数且返回结果为新函数的技术

- 参数复用
- 提前确认
- 延迟执行

通常柯里化的实现：
```js
function curry (fn) {
  return function f () {
    const args = [].slice.call(arguments)
    if(args.length < fn.length) {
      // 参数数量不满足原始函数数量，返回curry函数
      return function () {
        return f.apply(this, args.concat([].slice.call(arguments)))
      }
    } else {
      // 参数数量满足原始函数，触发执行
      return  fn.apply(this, args)
    }
  } 
}
```

## 反柯里化

扩大方法的使用范围

- 可以让任何对象拥有其他对象的方法
- 增加被反柯里化方法接受的参数

反柯里化的实现：
```js
function uncurrying (fn) {
  return function () {
    const args = [].slice.call(arguments, 1)
    return fn.apply(arguments[0], args)
  }
}
```

##  解读RamdaJS中的柯里化实现

上方柯里化实现的方案其实有两个缺点

- 调用柯里化的函数后无法确定函数元数。
- 传入参数位置必须和函数接受的参数位置保持一致

通过解读RamdaJS的源码看是如何解决的

#### 解决第一个问题：获取不到柯里化后函数的参数

函数的参数个数是可以通过length属性获取，所以需要一个辅助函数来确定函数参数的函数，也就是[source/internal/_arity.js](https://github.com/ramda/ramda/blob/master/source/internal/_arity.js)的作用

有了包裹函数的arity函数，来实现确定返回参数个数的柯里化版本

```js
function curry (length, recived, fn) {
  return function() {
    const args = [].slice.call(arguments)
    const combined = recived.concat(args)
    
    if(combined.length < length ) {
      return arity(length - combined.length, curry(length, combined, fn))
    } else {
      return fn.apply(this, combined)
    }
  }
}
```

这里的curry接受三个参数

- length 即函数参数的个数
- recived 一个保存传入参数的数组，初始化为空数组
- fn 柯里化的函数

调用curry后返回一个函数，通过闭包将返回的函数的参数和recived中的函数合并。如果接收的参数个数小于柯里化函数的参数个数，那么通过arity函数递归调用curry函数来收集剩余参数

```js
const add = (x, y, z) => x + y + z

const b = curry(3, [], add)(1)
console.log(b.length) //=> 2

const c = curry(3, [], add)(1, 2)
console.log(c.length) //=> 1

const d = curry(3, [], add)(1)(2)
console.log(d.length) //=> 1
```

#### 第二个问题：传入参数位置必须保持一致

这里我们需要一个[占位符source/internal/_isPlaceholder.js](https://github.com/ramda/ramda/blob/master/source/internal/_isPlaceholder.js)，占位符的作用就是尚待指定的参数，如果当前的参数是占位符，那表明应该忽略传入的参数。我们想要的结果是这样的

```js
g(1, 2, 3)
g(_, 2, 3)(1)
g(_, _, 3)(1)(2)
```

现在实现加入占位符的curry函数，这里我们需要一个数组来存放初始化传入的参数和经过柯里化函数调用时传入的参数，这是一个参数数组合并的过程。假设我们有一个函数

```js
const add = (x, y, z) => x + y + z
```

调用const g = curry(3, [], f) 初始化时传入了一个空数组，得到一个包裹函数，现在我们声明一个名为combined的空数组，来保存调用这个包裹函数传入的参数和初始化函数时传入的参数的数组。这里是RamdaJS中[curry](https://github.com/ramda/ramda/blob/master/source/internal/_curryN.js)的实现

这里做下解释

```js
// length： 柯里化函数参数的个数
// recived: 初始化接收的参数数组，
// fn : 柯里化的函数
function _curryN (length, recived, fn) {
  return function () {
    //存放每次调用函数参数的数组
    var combined = []
    var args = [].slice.call(arguments)
    var argsIdx = 0
    //用于检查参数是否全部传入
    var offset = length
    /* 
    这里同时迭代recived和arguments。
    我们要循环取出每一次curryN初始化接收到的参数和调用函数时传入的参数保存在combined中，
    这里用一个额外的变量argsIdx用于迭代arguments的。
    */
    while(combined.length < recived.length || argsIdx < args.length) {
      var result
      //首先迭代recived，取出不是占位符的参数仿入combined中
      if (combined.length < recived.length && (!_isPlaceholder(recived[combined.length]) || argsIdx >= args.length)) {
        result = recived[combined.length]
      } else {
        //如果recived已经迭代完了那么将arguments放入combined中
        result = args[argsIdx]
        argsIdx++
      }
      
      combined[combined.length] = result
      //如果当前参数不是占位符，则长度减1
      if(!_isPlaceholder(result)) offset -= 1
      console.log(combined)
    }
    
    //如果传入参数满足fn参数个数，则直接调用fn，否则递归调用curry函数,反复过滤掉recived的占位符
    return offset <= 0 ? fn.apply(this, combined) : _arity(offset, _curryN(length, combined, fn))
  }
}
```

现在我们得到一个带有占位符功能的柯里化函数
```js
function say (name, age, like) { console.log(`我叫${name},我${age}岁了, 我喜欢${like}`) };
const msg = _curryN(3, [], say)
// => 我叫大西瓜,我20岁了, 我喜欢妹子
msg(_, 20)('大西瓜', _,) ('妹子')
// => 我叫小hb,我25岁了, 我喜欢瞎bb
msg(_, _, '瞎bb')(_, '25')('小hb')
// => 我叫小明,我22岁了, 我喜欢小红
msg('小明')(_, _)(22,  '小红')
```

以上就是RamdaJS中_curryN中的实现，至于curry和curryN也是基于_curryN来实现的
