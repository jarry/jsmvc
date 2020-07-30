/**
 * Copyright 2013 Young Inc. All rights reserved.
 *
 * @class:  接口类
 * @name:   Interface
 * @file:   Interface.js
 * @path:   js-src/com
 * @desc:   对外接口
 * @author: jarry
 * @date:   2013-05-30
 */

 

///import js-src/lib/
///import js-src/com/

window.Interface = window.Interface || {};

/**
 * @class flash接口
 * @name Interface.Flash
 */
Interface.Flash = {

    /**
     * 判断函数是否属于某个列表中，通过toString()来判断
     * 并不十分准确.
     *
     * @function
     * @param {Function} func 被绑定函数
     * @param {Array} funcList 被绑定的函数列表
     * @param {Number} -1为为找到，否则返回下标
     */
    _inArray: function(func, funcList) {
        try {
            var funcStr = func.toString();
            var funcStrList = [];

            for (var i = 0, l = funcList.length; i < l; i++) {
                funcStrList[i] = funcList[i].toString();
            }
            for (var j = funcStrList.length - 1; j >= 0; j--) {
                if (funcStr === funcStrList[j]) {
                    return j;
                }
            }

        } catch (e) {
            console.log(e.message);
        }

        return -1;
    },

    _bindFuncList: {
        'makeVideoSpot': [],
        'closeVideoSpot': [],
        'getVideoSpot': [],
        'simpleTotraditional': []
    },

    /**
     * 注册Flash函数，绑定一个方法。
     *
     * @function
     * @param {String} interfaceName 需要绑定的接口名称
     * @param {Function} bindFunc 被绑定的函数
     * @desc bindFunc.scope 为函数指定一个作用域范围，默认指向window
     */
    register: function(interfaceName, bindFunc) {
        var bindList = this._bindFuncList[interfaceName];
        if (!bindList) {
            return;
        }
        var idx = this._inArray(bindFunc, bindList);

        if ( idx < 0) {
            bindList.push(bindFunc);
        } else {
            bindList.splice(idx, 1, bindFunc);
        }
    },

    /**
     * 卸载Flash的绑定函数
     *
     * @function
     * @param {String} interfaceName 需要绑定的接口名称
     * @param {Function} bindFunc 被绑定的函数
     */
    unregister: function(interfaceName, bindFunc) {
        var bindList = this._bindFuncList[interfaceName];
        var idx      = this._inArray(bindFunc, bindList);
        if ( idx >= 0) {
            bindList.splice(idx, 1);
        }
    },

    /**
     * 调用绑定的函数
     *
     * @function
     *
     * @param {String} bindFunc 被绑定的函数名
     * @param {Array} args 参数列表
     */
    _callFunction: function(interfaceName, args) {
        var bindList = this._bindFuncList[interfaceName];
        args = Array.prototype.slice.call(arguments, 1);
        for(var i = 0, l = bindList.length; i < l; i++) {
            return bindList[i].apply(bindList[i].scope, args);
        }
    },

   /**
    * 通过Flash打点获取打点内容
    *
    * @function
    */
    getVideoSpot: function() {
        var interfaceName = 'getVideoSpot';
        var args = [interfaceName].concat( Array.prototype.slice.call(arguments) );
        return this._callFunction.apply(this, args);
    },

   /**
    * 给flash提供简体转繁体的功能
    *
    * @function
    */
    simpleTotraditional: function() {
        var interfaceName = 'simpleTotraditional';
        var args = [interfaceName].concat( Array.prototype.slice.call(arguments) );
        return this._callFunction.apply(this, args);
    },

   /**
    * 通过Flash打点关闭窗口
    *
    * @function
    */
    closeVideoSpot: function() {
        var interfaceName = 'closeVideoSpot';
        var args = [interfaceName].concat( Array.prototype.slice.call(arguments) );
        this._callFunction.apply(this, args);
    },

   /*
    * 通过Flash打点获取的数据类型，详见接口文档
    data = {
    "kd": [
            {
            "begin": "00:20:10",
            "end": "00:30:10",
            "type": "0",
            "desc": "abc",
            "img": "1.jpg"
            }
        ]
    }*/

   /**
    * 创建Flash打点
    *
    * @function
    */
    makeVideoSpot: function() {
        var interfaceName = 'makeVideoSpot';
        var args = [interfaceName].concat( Array.prototype.slice.call(arguments) );
        this._callFunction.apply(this, args);
    }
};

// 测试用例
// var callbackMakeSpot = function(data) {
//     console.log(data);
//     console.log(arguments);
// };
// callbackMakeSpot.scope = 'Upload';
// Interface.Flash.register('makeVideoSpot', callbackMakeSpot);

