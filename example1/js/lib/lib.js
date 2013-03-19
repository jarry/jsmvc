/*
 * @file core.js
 * @desc 底层静态函数类库，一般选用一个JS库，如jquery,prototype,tangram等
 *       <li>所有函数都是静态方法，UI组件与一些实用性工具可以是对象类</li>
 *       <li>把一些底层的方法含括进来，与业务和产品特性无关，可以适用任何项目</li>
 *       <li>与业务无关的代码，可以作为整个产品或项目共用</li>
 *
 */


/**
 * 判断目标参数是否string类型或String对象
 * 
 * @param {Any} source 目标参数
 * @return {boolean} 类型判断结果
 */
var isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

/**
 * 根据id和dom返回对象
 * 
 * @param {string || object}
 * @return {object}
 */
var G = function(){
    for(var a = [], i = arguments.length - 1; i > -1; i --){
        var e = arguments[i];
        a[i] = null;
        if(typeof e == "object" && e && e.dom){
            a[i] = e.dom;
        } else if((typeof e  == "object" && e && e.tagName) || e == window || e == document) {
            a[i] = e;
        } else if(isString(e) && (e = document.getElementById(e))){
            a[i] = e;
        }
    }
    return a.length < 2 ? a[0] : a;
};


/**
 * 删除目标字符串两端的空白字符
 * 
 * @param {string} source 目标字符串
 * @return {string} 删除两端空白字符后的字符串
 */
var trim = function (source) {
	var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
	return String(source)
			.replace(trimer, "");
};



