class Promise {
  constructor(executor) {
    // 添加属性
    this.PromiseState = 'Pending' // 初始状态
    this.PromiseResult = null // 初始结果
    // 处理异步任务时保存成功、失败的回调函数
    this.callbacks = []
    // 保存实例对象的this
    const self = this
    // 定义resolve函数
    function resolve(data) {
      if (self.PromiseState !== 'Pending') return
      // 改变 Promise 的状态和结果
      self.PromiseState = 'fulfilled'
      self.PromiseResult = data
      // 异步任务后结束后调用then方法保存在callbacks中的所有的成功的异步回调函数
      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onResolved(data)
        })
      })
    }
    // 定义reject函数
    function reject(data) {
      if (self.PromiseState !== 'Pending') return
      // 改变 Promise 的状态和结果
      self.PromiseState = 'rejected'
      self.PromiseResult = data
      // 异步任务后结束后调用then方法保存在callbacks中的所有的失败的异步回调函数
      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onRejected(data)
        })
      })
    }
    // 抛出错误则调用reject()
    try {
      // 同步调用执行器函数
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  // 封装then()方法
  then(onResolved, onRejected) {
    const self = this
    // 判断回调函数参数
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw reason
      }
    }
    if (typeof onResolved !== 'function') {
      onResolved = (value) => {
        return value
      }
    }
    // 返回一个新Promise对象
    return new Promise((resolve, reject) => {
      // 封装函数
      function callback(type) {
        try {
          let result = type(self.PromiseResult)
          // 判断是否返回Promise对象
          if (result instanceof Promise) {
            result.then(
              (v) => {
                resolve(v)
              },
              (r) => {
                reject(r)
              },
            )
          } else {
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }
      // 调用回调函数
      if (this.PromiseState === 'fulfilled') {
        setTimeout(() => {
          callback(onResolved)
        })
      }
      if (this.PromiseState === 'rejected') {
        setTimeout(() => {
          callback(onRejected)
        })
      }
      // 若为异步任务，执行then方法时状态仍为Pending，则保存回调函数
      if (this.PromiseState === 'Pending') {
        // 通过数组方式保存回调，实现可以执行多个回调不会被后保存的回调覆盖
        this.callbacks.push({
          onResolved: function () {
            callback(onResolved)
          },
          onRejected: function () {
            callback(onRejected)
          },
        })
      }
    })
  }
  // 封装catch()方法
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  // 封装resolve()方法
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          (v) => {
            resolve(v)
          },
          (r) => {
            reject(r)
          },
        )
      } else {
        resolve(value)
      }
    })
  }
  // 封装reject()方法
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  // 封装all()方法
  static all(promises) {
    let count = 0
    let arr = []
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            count++
            arr[i] = v
            if (count === promises.length) {
              resolve(arr)
            }
          },
          (r) => {
            reject(r)
          },
        )
      }
    })
  }
  // 封装race()方法
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            resolve(v)
          },
          (r) => {
            reject(r)
          },
        )
      }
    })
  }
}
