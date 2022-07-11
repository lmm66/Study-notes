Function.prototype.myCall = function (context) {
    context = context ? Object(context) : window;    // Object()返回一个和给定的值相对应的类型的对象。
    context.fn = this;    // 给context对象一个属性fn(称作执行函数)，用来保存this值
    let args = [...arguments].slice(1);    // 选取传入的第二个及以外参数
    let result = context.fn(...args);    // 将选取的参数作为执行函数fn的参数，并将该执行函数存入变量result
    delete context.fn    // 删除context对象属性fn
    return result;
}
let obj = {
    myFun(from, to) {
        console.log(this.name + '来自' + from  + '去往' + to);
    }
}
let db = {
    name: "Jim"
}
obj.myFun.myCall(db, '北京', '上海');    // Jim来自北京去往上海