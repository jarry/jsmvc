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



/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/02
 */

///import baidu;

var baidu = baidu || {};

/**
 * 声明baidu.event包
 */
baidu.event = baidu.event || {};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/EventArg.js
 * author: erik
 * version: 1.1.0
 * date: 2010/01/11
 */

///import baidu.event;

/**
 * 事件对象构造器
 * 监听框架中事件时需要传入框架window对象
 * 
 * @param {Event}   event        事件对象
 * @param {Window}  win optional 窗口对象，默认为window
 */
baidu.event.EventArg = function (event, win) {
    win = win || window;
    event = event || win.event;
    var doc = win.document;
    
    this.target = event.srcElement;
    this.keyCode = event.which;
    for (var k in event) {
        var item = event[k];
        // 避免拷贝preventDefault等事件对象方法
        if ('function' != typeof item) {
            this[k] = item;
        }
    }
    
    if (!this.pageX && this.pageX !== 0) {
        this.pageX = (event.clientX || 0) 
                        + (doc.documentElement.scrollLeft 
                            || doc.body.scrollLeft);
        this.pageY = (event.clientY || 0) 
                        + (doc.documentElement.scrollTop 
                            || doc.body.scrollTop);
    }
    this._event = event;
};

/**
 * 阻止事件的默认行为
 */
baidu.event.EventArg.prototype.preventDefault = function () {
    if (this._event.preventDefault) {
        this._event.preventDefault();
    } else {
        this._event.returnValue = false;
    }
    return this;
};

/**
 * 停止事件的传播
 */
baidu.event.EventArg.prototype.stopPropagation = function () {
    if (this._event.stopPropagation) {
        this._event.stopPropagation();
    } else {
        this._event.cancelBubble = true;
    }
    return this;
};

/**
 * 停止事件
 */
baidu.event.EventArg.prototype.stop = function () {
    return this.stopPropagation().preventDefault();
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/_listeners.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event._unload;

/**
 * 事件监听器的存储表
 * @private
 */
baidu.event._listeners = baidu.event._listeners || [];
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/_unload.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

///import baidu.event;

/**
 * 卸载所有事件监听器
 * @private
 */
baidu.event._unload = function () {
    var lis = baidu.event._listeners,
        len = lis.length,
        standard = !!window.removeEventListener,
        item, el;
        
    while (len--) {
        item = lis[len];
        el = item[0];
        if (el.removeEventListener) {
            el.removeEventListener(item[1], item[3], false);
        } else if (el.detachEvent){
            el.detachEvent('on' + item[1], item[3]);
        }
    }
    
    if (standard) {
        window.removeEventListener('unload', baidu.event._unload, false);
    } else {
        window.detachEvent('onunload', baidu.event._unload);
    }
};

// 在页面卸载的时候，将所有事件监听器移除
if (window.attachEvent) {
    window.attachEvent('onunload', baidu.event._unload);
} else {
    window.addEventListener('unload', baidu.event._unload, false);
}
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/get.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event.EventArg;

/**
 * 获取扩展的事件对象
 * 
 * @param {Event}  event 原生事件对象
 * @param {window} win   窗体对象
 * @return {EventArg} 扩展的事件对象
 */
baidu.event.get = function (event, win) {
    return new baidu.event.EventArg(event, win);
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/getKeyCode.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event;

/**
 * 获取键盘事件的键值
 * 
 * @param {Event} event 事件对象
 * @return {number} 键盘事件的键值
 */
baidu.event.getKeyCode = function (event) {
    return event.which || event.keyCode;
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/getPageX.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

///import baidu.event;

/**
 * 获取鼠标事件的鼠标x坐标
 * 
 * @param {Event} event 事件对象
 * @return {number} 鼠标事件的鼠标x坐标
 */
baidu.event.getPageX = function (event) {
    var result = event.pageX,
        doc = document;
    if (!result && result !== 0) {
        result = (event.clientX || 0) 
                    + (doc.documentElement.scrollLeft 
                        || doc.body.scrollLeft);
    }
    return result;
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/getPageY.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

///import baidu.event;

/**
 * 获取鼠标事件的鼠标y坐标
 * 
 * @param {Event} event 事件对象
 * @return {number} 鼠标事件的鼠标y坐标
 */
baidu.event.getPageY = function (event) {
    var result = event.pageY,
        doc = document;
    if (!result && result !== 0) {
        result = (event.clientY || 0) 
                    + (doc.documentElement.scrollTop 
                        || doc.body.scrollTop);
    }
    return result;
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/getTarget.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/17
 */

///import baidu.event;

/**
 * 获取事件的触发元素
 * 
 * @param {Event} event 事件对象
 * @return {HTMLElement} 事件的触发元素
 */
baidu.event.getTarget = function (event) {
    return event.target || event.srcElement;
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/on.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

///import baidu.event._listeners;

/**
 * 为目标元素添加事件监听器
 * 
 * @param {HTMLElement|string|window} element  目标元素或目标元素id
 * @param {string}                    type     事件类型
 * @param {Function}                  listener 事件监听器
 * @return {HTMLElement} 目标元素
 */
baidu.event.on = function (element, type, listener, args) {
    type = type.replace(/^on/i, '');
    if ('string' == typeof element) {
        element = baidu.dom.g(element);
    }

//    var fn = function (ev) {
//        // 这里不支持EventArgument
//        // 原因是跨frame的时间挂载
//        listener.call(element, ev);
//    };
	
	// 挂载参数 modified by jarryli
	if (typeof args != 'undefined') {
		var fn = function(ev) {
			listener.call(element, args, ev);
		};
	} else {
	    var fn = function (ev) {
	      listener.call(element, ev);
	  };
	}

    var lis = baidu.event._listeners;
    
    // 将监听器存储到数组中
    lis[lis.length] = [element, type, listener, fn];
    
    // 事件监听器挂载
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, fn);
    } 
    
    return element;
};

// 声明快捷方法
baidu.on = baidu.event.on;
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/preventDefault.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event;

/**
 * 阻止事件的默认行为
 * 
 * @param {Event} event 事件对象
 */
baidu.event.preventDefault = function (event) {
   if (event.preventDefault) {
       event.preventDefault();
   } else {
       event.returnValue = false;
   }
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/stop.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event.stopPropagation;
///import baidu.event.preventDefault;

/**
 * 停止事件
 * 
 * @param {Event} event 事件对象
 */
baidu.event.stop = function (event) {
    var e = baidu.event;
    e.stopPropagation(event);
    e.preventDefault(event);
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/stopPropagation.js
 * author: erik
 * version: 1.1.0
 * date: 2009/11/23
 */

///import baidu.event;

/**
 * 停止事件的传播
 * 
 * @param {Event} event 事件对象
 */
baidu.event.stopPropagation = function (event) {
   if (event.stopPropagation) {
       event.stopPropagation();
   } else {
       event.cancelBubble = true;
   }
};
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: baidu/event/un.js
 * author: erik
 * version: 1.1.0
 * date: 2009/12/16
 */

///import baidu.event._listeners;

/**
 * 为目标元素移除事件监听器
 * 
 * @param {HTMLElement|string|window} element  目标元素或目标元素id
 * @param {string}                    type     事件类型
 * @param {Function}                  listener 事件监听器
 * @return {HTMLElement} 目标元素
 */
baidu.event.un = function (element, type, listener) {
    if ('string' == typeof element) {
        element = baidu.dom.g(element);
    }
    type = type.replace(/^on/i, '');
    
    var lis = baidu.event._listeners, 
        len = lis.length,
        isRemoveAll = !listener,
        item;
    
    while (len--) {
        item = lis[len];
        
        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if (item[1] === type
            && item[0] === element
            && (isRemoveAll || item[2] === listener)) {
            if (element.removeEventListener) {
                element.removeEventListener(type, item[3], false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + type, item[3]);
            }
            lis.splice(len, 1);
        }
    }
    
    return element;
};

// 声明快捷方法
baidu.un = baidu.event.un;/**
 * Baidu UE JavaScript Library
 * 
 * ajax.js
 * @anthor UTer
 * @version $Revision: 1.9 $
 */


/**
 * Ajax类
 * @param {Function} onSuccess 请求成功时回调方法
 * @param {Function} onFail 请求失败时回调方法
 */
function Ajax(onSuccess, onFail) {
    this.onSuccess = onSuccess;
    if (onFail) {
        this.onFail = onFail;
    }

    //初始化XMLHttpRequest
    if (window.XMLHttpRequest) {
        this.xhr = new XMLHttpRequest();
    } else {
        try {
            this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    this.async = true;
    this.dataType = "text";
}

Ajax.prototype = {
    /**
     * 设置获取的数据类型为XML
     * @public
     */
    setXML: function () {
        this.dataType = "xml";
    },

    /**
     * 向服务器端发送数据
     * @public
     * @param {String} url 请求地址
     * @param {String} data 发送的数据，格式参照a=aaa&b=bbb
     * @param {String} method 请求方式，post|get
     * @param {String} encoding 发送数据的编码方式，仅post时有效
     */
    send: function (url, data, method, encoding) {
        var meth = "get";
        var contentType = "application/x-www-form-urlencoded";

        //发送类型
        if (method && method == "post") {
            meth = "post";
        }

        //根据发送类型get/post，解析url和发送头
        if (meth == "post") {
            contentType += (encoding ? (';charset=' + encoding) : '');
        } else {
            if (url.indexOf('?') < 0) {
                url = url + '?';
            }
            
            var lastIndex = url.length - 1;
            if (url.lastIndexOf('&') != lastIndex &&
                url.lastIndexOf('?') != lastIndex) {
                url = url + '&';
            }
            if (data) {
                url = url + data + '&';
            }
            url  = url + "reqTime=" + new Date().getTime();
            data = null;
        }

        //发送数据
        var me = this;
        this.xhr.open(meth.toUpperCase(), url, this.async);
        this.xhr.onreadystatechange = function () {
            me.onStateChg.call(me);
        };
        if (meth == "post") {
            this.xhr.setRequestHeader("Content-Type", contentType);
        }
        this.xhr.send(data);
        if (!this.async) {
            me.onStateChg.call(me);
        }
    },

    /**
     * 通过post方式向服务器端发送数据
     * @public
     * @param {String} url 请求地址
     * @param {String} data 发送的数据，格式参照a=aaa&b=bbb
     * @param {String} encoding 发送数据的编码方式
     */
    post: function (url, data, encoding) {
        this.send(url, data, "post", encoding);
    },

    /**
     * 通过get方式向服务器端发送数据
     * @public
     * @param {String} url 请求地址
     * @param {String} data 发送的数据，格式参照a=aaa&b=bbb
     */
    get: function (url, data) {
        this.send(url, data);
    },

    /**
     * 在send中调用，当readyState发生改变时触发
     * @private
     */
    onStateChg: function () {
        //请求状态未就绪时不做任何事
        if (this.xhr.readyState != 4) {
            return;
        }

        //根据状态码触发请求成功/失败的function
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
            var data;
            if (this.dataType == "xml") {
                data = this.xhr.responseXML;
            } else {
                data = this.xhr.responseText;
            }

            this.onSuccess.call(this, data);
        } else if (this.onFail) {
            this.onFail();
        }
    }
};/**
 * Baidu UE JavaScript Library
 * 
 * class.js
 * @author UTer
 * @version $Revision: 1.5 $
 */


/**
 * 元类
 * @public
 * @param {object} props 类成员
 * @param {Class} superClass 父类
 * @return {Class} 创建的类
 */
function Class(props, superClass) {
	var con = props.constructor == Object ? undefined : props.constructor;
	if (superClass) {
		var superConstructor = function () {
		    superClass.call(this);
		};
	}
	var clazz = con || superConstructor || new Function();
	var s_ = new Function();
	if (superClass) {
		s_.prototype = superClass.prototype;
		clazz.prototype = new s_();
	}
	for (var k in props) {
		clazz.prototype[k] = props[k];
	}
	clazz.constructor = clazz;
	return clazz;
}/**
 * Baidu UE JavaScript Library
 * 
 * string.js
 * @author UTer
 * @version $Revision: 1.8 $
 */


/**
 * 删除字符串中的首尾空白字符
 * 
 * @public
 * @return {String} 处理过的字符串
 */
String.prototype.trim = function () {
    return this.replace(/(^[\s\u3000\xa0]+|[\s\u3000\xa0]+$)/g, '');
};

/**
 * 编码字符串中的html敏感字符
 * 
 * @public
 * @return {String} 处理过的字符串
 */
String.prototype.escapeHTML = function () {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * 反编码字符串中的html敏感字符
 * 
 * @public
 * @return {String} 处理过的字符串
 */
String.prototype.unescapeHTML = function () {
    return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

/**
 * 简单的字符串格式化
 * 
 * @public
 * @return {String} 格式化后的字符串
 */
String.prototype.format = function () {
    var argus = [];
    argus = Array.apply(argus, arguments);
    var reStr = this.replace(/\{([0-9]+)\}/g, function ($0, num) {
        var str = argus[parseInt(num, 10)];
        return  typeof(str) == 'undefined' ? '' : str;
    });
    return reStr;
};

/**
 * 判断字符串是否以某个字符串开始
 * 
 * @public
 * @param {String} str 开始的字符串
 * @return {Boolean} 是否以param string开始
 */
String.prototype.startWith = function (str) {
    return this.indexOf(str) === 0;
};

/**
 * 判断字符串是否以某个字符串结尾
 * 
 * @public
 * @param {String} str 开始的字符串
 * @return {Boolean} 是否以param string结尾
 */
String.prototype.endWith = function (str) {
    return this.lastIndexOf(str) == (this.length - str.length);
};/**
 * Baidu UE JavaScript Library
 * 
 * element.js
 * @author UTer
 * @version $Revision: 1.10 $
 */

/**
 * Dom对象的扩展类
 * @public
 */
var Element = function (el) {
    if (!el) {
        return;
    }
        
    if (el.constructor == String) {
        el = document.createElement(el);
    }
    var p = Element.prototype;
    if (el.wrapVersion == p.wrapVersion) {
        return el;
    }
    // inherit all properties to `el` from prototype
    // added by jarry
    for (var n in p) {
        el[n] = p[n];
    }
    
    return el;
}

Element.prototype = {
    /**
     * 包装器版本信息
     * @private
     */
    wrapVersion: 1,
    
    /**
     * Element的样式操作
     * <pre>
     * <b>设置css：</b>
     * .css('width', '500px')
     * .css({width : '500px', backgroundColor : '#ccc'})
     * .css('width', '500px', 'backgroundColor', '#ccc')
     * <b>获取css：</b>
     * .css('width')
     * </pre>
     * @public
     * 
     * @return {Element} 当前元素
     */
    css: function (arg) {
        var argLen = arguments.length;
        if (argLen > 1 && argLen % 2 === 0) {
            for (var i = 0; i < argLen; i += 2) {
                var a = arguments[i], a2 = arguments[i + 1];
                if (typeof a == 'string' && typeof a2 == 'string') {
                    this.style[a] = a2;
                }
            }
        } else if (argLen == 1) {
            if (typeof arg == 'string') {
                var sty = this.currentStyle || document.defaultView.getComputedStyle(this, null);
                return sty[arg]; 
            } else {
                for (var k in arg) {
                    this.style[k] = arg[k];
                }
            }
        }
        return this;
    },
    
    /**
     * 设置Element可见
     * @public
     * 
     * @param {String} display 新的显示样式:block|inline....,默认为""(有些情况下,style.display=''还不能显示元素,原因待查)
     * @return {Element} 当前元素
     */
    show: function (display) {
        this.style.display = display || '';
        return this;
    },
    
    /**
     * 设置Element隐藏
     * @public
     * 
     * @return {Element} 当前元素
     */
    hide: function () {
        this.style.display = "none";
        return this;
    },
    
    /**
     * 为Element添加class
     * @public
     * 
     * @param {String} name class的名称
     * @return {Element} 当前元素
     */
    addClass: function (name) {
        var classArr = this.className.split(/\s+/);
        classArr.push(name);
        this.className = classArr.join(' ');
        return this;
    },
    
    /**
     * 删除Element的class
     * @public
     * 
     * @param {String} name class的名称
     * @return {Element} 当前元素
     */
    removeClass: function (name) {
        var classArr = this.className.split(/\s+/);
        var len = classArr.length;
        while (len--) {
            if (classArr[len] == name) {
                classArr.splice(len, 1);
            }
        }
        this.className = classArr.join(' ');
        return this;
    },
    
    /**
     * 添加子Element
     * @public
     * 
     * @param {HTMLElement} el 要添加的元素
     * @return {Element} 当前元素
     */
    append: function (el) {
        this.appendChild(el);
        return this;
    },
    
    /**
     * 设置Element的innerHTML
     * @public
     * 
     * @param {String} html html字符串
     * @return {Element} 当前元素
     */
    setHTML: function (html) {
        this.innerHTML = html;
        return this;
    },
    
    /**
     * 从页面中移除Element
     * @public
     * 
     * @return {Element} 当前元素
     */
    remove: function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        return this;
    },
    
    /**
     * 移除Element内部的文本节点
     * @public
     * 
     * @return {Element} 当前元素
     */
    clearEmptyNode: function () {
        var nodes = this.childNodes;
        var i = nodes.length;
        while (i--) {
            var node = nodes[i];
            if (node.nodeType != 1 && 
                (node.nodeType != 3 || node.nodeValue.trim().length === 0)) {
                this.removeChild(node);
            }
        }
        return this;
    },
    
    /**
     * 获得Element的绝对位置
     * @public
     * 
     * @return {K,V} 位置信息
     */
    getPosition : function () {
        var el = this;
        var left = el.offsetLeft, top = el.offsetTop;
        
        while ((el = el.offsetParent)) {
            var tag = el.tagName;
            if (tag == 'HTML' || tag == 'BODY') {
                break;
            }
            left += (el.offsetLeft - el.scrollLeft) || 0;
            top += (el.offsetTop - el.scrollTop) || 0;
        }
        return  {'left': left, 'top': top};
    },
    
    /**
     * 设置Element的透明度
     * @public
     * 
     * @param {Number} opacity 透明度，0-1
     * @return {Element} 当前元素
     */
    setOpacity: function (opacity) {
        this.style.visibility = opacity < 0.001 ? "hidden" : "visible";
        if (!this.currentStyle || !this.currentStyle.hasLayout) {
            this.style.zoom = 1;
        }
            
        if (window.ActiveXObject) {
            this.style.filter = (opacity == 1) ? '' : "alpha(opacity=" + opacity * 100 + ")";
        }
            
        this.style.opacity = opacity;
        return this;
    }
};
/**
 * Baidu UE JavaScript Library
 * 
 * get-unique-id.js
 * @author UTer
 * @version $Revision: 1.3 $
 */


(function () {
    var uniqueIdMap = {};
    
    /**
     * 生成随机字符串
     * 
     * @owner window
     * @param {Number} len 生成uniqueId的长度
     * @return {String} uniqueId
     */
    window.getUniqueId = function (len) {
        var l = len || 8;
        var uid = '';
        while (l--) {
            uid += getRandomChar();
        }
        if (!uniqueIdMap[uid]) {
            uniqueIdMap[uid] = 1;
            return uid;
        } else {
            return getUniqueId(l);
        }
    };
    
    var getRandomChar = function () {
        var charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charMapLen = charMap.length;
        return charMap.charAt(Math.floor(Math.random() * charMapLen));
    };
})();/**
 * Baidu UE JavaScript Library - Web Control
 * 
 * calendar.js
 * @author UTer
 * @version $Revision: 1.13 $
 */


/**
 * 日历控件
 * <pre>
 * <h3>构造器参数说明：</h3>
 * onselect：用户选中日期时触发事件
 * onviewchange:日期视觉区域切换时触发事件
 * dateStyle：日期样式，可为String或Function
 * 
 * <h3>示例：</h3>
 * var myCalendar = new Calendar({
 *     onselect: function (date) {
 *         if (date.getDate() == 1){alert('不让你选1号');return false;}
 *         G("ShowDate").innerHTML = "您选择的日期是:" + date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate() + "日";
 *     },
 *     dateStyle: function (date) {
 *         if(date.getDay() == 0 || date.getDay() == 6) return "background:#eee";
 *     }
 * });
 * myCalendar.appendTo(document.body);
 * </pre>
 * 
 * @param {Object} params 用于初始化控件的属性集合
 */
function Calendar(params) {
    this.uniqueId = getUniqueId();
    
    params = params || {};
    this.date = params.date || new Date();
    this.viewDate = new Date(Date.parse(this.date));
    
    this.onselect = params.onselect || new Function();
    this.onviewchange = params.onviewchange || new Function();
    this.dateStyle = params.dateStyle || "";
    
    this.wrapId = this.uniqueId + 'Calendar';
    this.headId = this.uniqueId + 'Head';
    this.bodyId = this.uniqueId + 'Body';
    this.titleId = this.uniqueId + 'Title';
    
    this.wrapClass            = "calendar-wrap";
    this.headClass            = "calendar-head";
    this.bodyClass            = "calendar-body";
    this.titleClass            = "calendar-title";
    this.prevMonthClass        = "calendar-prev-month";
    this.prevYearClass        = "calendar-prev-year";
    this.nextMonthClass        = "calendar-next-month";
    this.nextYearClass        = "calendar-next-year";
}

/**
 * 获得日期当前月份的天数
 * 
 * @private
 * @param {Date} 日期
 * @return {Number} 天数
 */
Calendar.getDateCountByMonth = function (date) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.getDate();
};

Calendar.prototype = {
    /**
     * 设置日期
     * 
     * @public
     * @param {Date} date 日期
     */
    setDate: function (date) {
        this.date = date;
        this.viewDate = new Date(Date.parse(date));
        G(this.bodyId).innerHTML = this.getBodyHtml();
        G(this.titleId).innerHTML = this.getTitleHtml();
    },
    
    /**
     * 将控件附加到页面容器
     * 
     * @public
     * @param {HTMLElement} el 页面容器元素
     */
    appendTo: function (el) {
        var wrap = new Element('div');
        wrap.id = this.wrapId;
        wrap.className = this.wrapClass;
        el.appendChild(wrap);
        
        this.renderHead(wrap);
        this.renderBody(wrap);
        this.appendTo = new Function();
    },
    
    /**
     * 绘制日历控件头
     * 
     * @private
     * @param {HTMLElement} container 控件自身容器元素
     */
    renderHead: function (container) {
        var head = new Element('div');
        head.id = this.headId;
        head.className = this.headClass;
        container.append(head);
        
        var prevYear = new Element('div');
        prevYear.className = this.prevYearClass;
        head.append(prevYear);
        
        var prevMonth = new Element('div');
        prevMonth.className = this.prevMonthClass;
        head.append(prevMonth);
        
        var title = new Element('div');
        title.id = this.titleId;
        title.className = this.titleClass;
        title.innerHTML = this.getTitleHtml();
        head.append(title);
        
        var nextMonth = new Element('div');
        nextMonth.className = this.nextMonthClass;
        head.append(nextMonth);
        
        var nextYear = new Element('div');
        nextYear.className = this.nextYearClass;
        head.append(nextYear);
        
        head.onclick = this.getHeadClickHandler();
    },
    
    /**
     * 绘制日历控件体
     * 
     * @private
     * @param {HTMLElement} container 控件自身容器元素
     */
    renderBody: function (container) {
        var body = new Element('div');
        body.className = this.bodyClass;
        body.id = this.bodyId;
        body.onclick = this.getBodyClickHandler();
        container.append(body);
        
        body.innerHTML = this.getBodyHtml();
    },
    
    /**
     * 获取控件头点击的事件句柄
     * 
     * @private
     * @return {Function} 控件头点击的事件句柄
     */
    getHeadClickHandler: function () {
        var me = this;
        return function (e) {
            e = e || window.event;
            var tar = e.srcElement || e.target;
            var vDate = new Date(me.viewDate);
            
            switch (tar.className) {
            case me.prevYearClass:
                vDate.setFullYear(me.viewDate.getFullYear() - 1);
                break;
            case me.prevMonthClass:
                vDate.setMonth(me.viewDate.getMonth() - 1);
                break;
            case me.nextMonthClass:
                vDate.setMonth(me.viewDate.getMonth() + 1);
                break;
            case me.nextYearClass:
                vDate.setFullYear(me.viewDate.getFullYear() + 1);
                break;
            }
            
            var val = me.onviewchange.call(me, vDate);
            if (val !== false) {
                me.viewDate = vDate;
                G(me.bodyId).innerHTML = me.getBodyHtml();
                G(me.titleId).innerHTML = me.getTitleHtml();
            }
        };
    },
    
    /**
     * 获取控件主体点击的事件句柄
     * 
     * @private
     * @return {Function} 控件头点击的事件句柄
     */
    getBodyClickHandler: function () {
        var me = this;
        return function (e) {
            e = e || window.event;
            var tar = e.srcElement || e.target;
            var sign = tar.getAttribute('sign');
            if (sign == 'date') {
                var selDate = new Date(tar.getAttribute('y'),
                                        tar.getAttribute('m'),
                                        tar.getAttribute('d'));
                var reVal = me.onselect.call(me, selDate);
                if (!(reVal === false)) {
                    me.setDate(selDate);
                }
            }
        };
    },
    
    /**
     * 获取控件标题的html
     * 
     * @private
     * @return {String} 控件标题的html
     */
    getTitleHtml: function () {
        return '{0}年{1}月'.format(this.viewDate.getFullYear(), (this.viewDate.getMonth() + 1));
    },
    
    /**
     * 获取控件主体的html
     * 
     * @private
     * @return {String} 控件主体的html
     */
    getBodyHtml: function () {
        var theadHtml = this.getTHeadHtml();
        var tbodyHtml = this.getTBodyHtml();
        var tableTpl = '<table cellpadding="0" cellspacing="0" border="0"><thead>{0}</thead><tbody>{1}</tbody></table>';
        return tableTpl.format(theadHtml, tbodyHtml);
    },
    
    /**
     * 获取控件表头周的html
     * 
     * @private
     * @return {String} 控件表头周的html
     */
    getTHeadHtml: function () {
        var weekMap = ['日', '一', '二', '三', '四', '五', '六'];
        var headHtml = ['<tr>'];
        var headItemTpl = '<td sign="week">{0}</td>';
        for (var i = 0; i < 7; i++) {
            headHtml.push(headItemTpl.format(weekMap[i]));
        }
        headHtml.push('</tr>');
        return headHtml.join('');
    },
    
    /**
     * 获取控件日期体的html
     * 
     * @private
     * @return {String} 控件日期体的html
     */
    getTBodyHtml: function () {
        //模板变量
        var dateTemplate = '<td sign="date" style="{4}" class="{3}" y="{2}" m="{1}" d="{0}">{0}</td>';
        var todayClass = 'calendar-today';
        var thisMonthClass = 'calendar-thismonth';
        var otherMonthClass = 'calendar-othermonth';
        
        //日期变量
        var viewDate = this.viewDate;
        var year = viewDate.getFullYear();
        var month = viewDate.getMonth();
        var date = viewDate.getDate();
        
        //前一个月的日期
        var prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        //前一个月的天数
        var beforeMonthDays = Calendar.getDateCountByMonth(prevMonth);
        //本月的天数
        var days = Calendar.getDateCountByMonth(viewDate);
        //构造html的循环初始索引
        var index = 0 - new Date(year, month, 1).getDay();
        
        //make html
        var currDate, currMonth, currYear, currClass, currStyle;
        if (this.dateStyle.constructor == String) {
            currStyle = this.dateStyle;
        }
        
        //构造上个月和本月的日期html
        var html = [];
        html.push('<tr>');
        for (var trTag = 0; index < days; index++, trTag++) {
            if (trTag > 0 && trTag % 7 === 0) {
                html.push('</tr><tr>');
            }
            
            if (index < 0) {
                currDate = beforeMonthDays + index + 1;
                currMonth = prevMonth.getMonth();
                currYear = prevMonth.getFullYear();
                currClass = otherMonthClass;
            } else {
                currDate = index + 1;
                currMonth = month;
                currYear = year;
                currClass = thisMonthClass;
                if (date == currDate &&
                    month == this.date.getMonth() &&
                    year == this.date.getFullYear()) {
                    currClass = todayClass;
                }
            }
            
            if (typeof this.dateStyle == 'function') {
                currStyle = this.dateStyle(new Date(currYear, currMonth, currDate)) || "";
            }

            html.push(dateTemplate.format(currDate, 
                                            currMonth, 
                                            currYear, 
                                            currClass, 
                                            (currClass == todayClass ? "" : currStyle)));
        }
        
        //构造下个月的日期html
        currMonth = month + 1;
        currYear = year;
        if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }
        currClass = otherMonthClass;
        for (var i = trTag % 7, oriI = i; i > 0 && i < 7; i++) {
            currDate = i - oriI + 1;
            if (typeof this.dateStyle == 'function') {
                currStyle = this.dateStyle(new Date(currYear, currMonth, currDate)) || "";
            }
            html.push(dateTemplate.format(currDate, currMonth, currYear, currClass, currStyle));
        }
        html.push('</tr>');
        
        return html.join('');
    }
};

