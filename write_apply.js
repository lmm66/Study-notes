Function.prototype.myApply = function (context, arr) {
    context = context ? Object(context) : window;   // Object()返回一个和给定的值相对应的类型的对象
    context.fn = this;  // 给context对象一个属性fn(称作执行函数)，用来保存this值
    let result;
    if (!arr) {
        result = context.fn();
    } else {
        result = context.fn(...arr);    // 通过拓展运算符将传入的数组参数元素取出并与执行函数的参数一一对应传入
    }
    delete context.fn;  // 删除context对象属性fn
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
obj.myFun.myApply(db, ['北京', '上海', 'ss']);    // Jim来自北京去往上海
