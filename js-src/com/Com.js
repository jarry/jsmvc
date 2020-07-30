/**
 * Copyright 2012 Young Inc. All rights reserved.
 *
 * @class   全局公共静态函数类
 * @name    Com
 * @file:   Com.js
 * @path:   js-src/com
 * @desc:   项目的全局公共静态小函数集合，所有函数均为公开
 *          函数采取全部键值对象式声明，方法名采用驼峰式命名
 * @author: jarry
 * @date:   2012-05-02
 */

///import js-src/lib/
///import js-src/com/

var Com = Com || {
    // 有关字符处理
    string: null,
    // cookie相关
    cookie: null,
    // 事件操作
    event: null,
    // dom处理
    dom: null,
    // 文件处理相关
    file: null,
    // 页面相关的
    page: null,
    // 基本与常用操作
    lang: null,
    // 数组相关
    array: null,
    // 格式化
    format: null,
    // 日期相关
    date: null

};

/**
 * @class 基本与常用操作
 * @name Com.lang
 */
Com.lang = {

    /**
     * 判断目标参数是否为Element对象
     *
     * @function
     * @grammar baidu.lang.isElement(source)
     * @param {Any} source 目标参数
     * @meta standard
     * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isBoolean,baidu.lang.isDate
     *
     * @returns {boolean} 类型判断结果
     */
    isElement: function(source) {
        return !!(source && source.nodeName && source.nodeType == 1);
    },

    /**
     * 判断目标参数是否为对象
     *
     * @function
     * @param {Any} source 目标参数
     * @meta standard
     * @returns {boolean} 类型判断结果
     */
    isObject: function(source) {
        return ('[object Object]' == Object.prototype.toString.call(source));
    },

    isArray: function(source) {
        if (Array.isArray) {
            return Array.isArray(source);
        }
        return ('[object Array]' == Array.prototype.toString.call(source));
    },

    isFunction: function(source) {
        return ('[object Function]' == Object.prototype.toString.call(source));
    },

    isBoolean: function(source) {
        return ('[object Boolean]' == Object.prototype.toString.call(source));
    },

    isString: function(source) {
        return ('[object String]' == Object.prototype.toString.call(source));
    },

    isNumber: function(source) {
        return ('[object Number]' == Object.prototype.toString.call(source));
    },

    isDate: function(source) {
        return ('[object Date]' == Object.prototype.toString.call(source));
    },

    isPlainObject: function(source) {
        if (typeof(source) !== 'object' || source.nodeType || source.window == window) {
            return false;
        }
        if (source.constructor && !hasOwnProperty.call(source.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }
        return true;
    },

    /**
     * 得到json及其子json的某个属性值（第一个），递归遍历整个对象
     *
     * @function
     * @param {string} prop property名称
     * @param {object} obj json object对象
     * @returns {value} 对象value或者null
     */
    getProperty: function(prop, obj) {

        if ('string' != typeof prop || 'object' != typeof obj) {
            return null;
        }

        if (obj.hasOwnProperty(prop)) {
            return obj[prop];
        }

        for (var _prop in obj) {
            if ('object' == typeof obj[_prop]) {
                return Com.getProperty(prop, obj[_prop]);
            }
        }

        return null;
    },

    /**
     * 交换a与b元素的内容
     *
     * @param {Object} a
     * @param {Object} b
     */
    exchange: function(a, b) {
        var tmp = a;
        b = a;
        a = tmp;
    },

    /**
     * 判断JOSN对象是否为空
     *
     * @function
     * @param {object} obj json object对象
     * @returns {boolean}
     */
    hasProperty: function(obj) {
        for (var prop in obj) {
            return true;
        }
        return false;
    },

    /**
     * 原型继承类，将父类全部prototype复制到子类，同名方法之类覆盖父类。
     * TODO：来自baidu tangram，仅在原型继承时使用，运行时继承采用jQuery.extend
     *
     * @function
     * @grammar baidu.lang.inherits(subClass, superClass[, type])
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @param {string} type 类名标识
     * @remark
     *
     * 使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
     * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
     * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
     
     * @shortcut inherits
     * @meta standard
     * @see baidu.lang.Class
     */
    inherits: function(subClass, superClass, type) {
        var key, proto,
            selfProps = subClass.prototype,
            Clazz = new Function();

        Clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new Clazz();

        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;

        // 类名标识，兼容Class的toString，基本没用
        // typeof type == "string" && (proto.__type = type);
        if (typeof type == 'string') {
            proto.__type = type;
        }

        subClass.extend = function(json) {
            for (var i in json) {
                proto[i] = json[i];
            }
            return subClass;
        };

        return subClass;
    },

    /**
     * 当json某个属性值为number时，如果是0或'0'，则输出为空字符串
     * 更改传递引用，不保留原来的json
     *
     * @function
     * @param {string OR array} prop property名称或名称数组
     * @param {object} json object对象
     */
    removeZeroNumberForJson: function(prop, json) {
        if (('string' != typeof prop && !(prop instanceof Array)) ||
            'object' != typeof json) {
            return;
        }
        var props = [];
        if ('string' == typeof props) {
            props[0] = props;
        } else {
            props = prop;
        }

        for (var item in json) {
            if ('object' == typeof json[item]) {
                Com.lang.removeZeroNumberForJson(props, json[item]);
            } else {

                for (var i = 0, l = props.length; i < l; i++) {
                    if (item == props[i] && (parseInt(json[item], 10) === 0)) {
                        json[item] = '';
                    }
                }
            }
        }

    },

    /**
     * 当json某个属性值为空时，则移除该属性
     *
     * @function
     * @param {object} json object对象
     */
    removeNullForJson: function(json) {
        for (var prop in json) {
            if (Com.lang.isObject(json[prop])) {
                Com.lang.removeNullForJson(props, json[prop]);
            } else {
                if (!prop) {
                    delete json.prop;
                }
            }
        }
    }

};

/**
 * @class 事件操作
 * @name Com.event
 */
Com.event = {

    /**
     * 取消事件的默认动作
     *
     * @function
     * @param {object} evt 事件对象
     */
    preventDefault: function(evt) {
        evt = evt || window.event;
        try {
            evt.preventDefault();
        } catch (e) {
            evt.returnValue = false;
        }
    },

    /**
     * 获取鼠标的位置
     *
     * @function
     * @param {object} e 事件对象
     */
    getMousePosition: function(e) {
        if (e.pageX || e.pageY) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
        return {
            x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: e.clientY + document.body.scrollTop - document.body.clientTop
        };
    },

    /**
     * 判断鼠标坐标是否在一个DOM内
     *
     * @function
     * @param {jQuery Element} $element DOM对象
     * @event {event} 鼠标事件对象
     * @returns {boolean} 是否在对象之外
     */
    isMouseOutElement: function($element, evt) {
        var self = this;
        evt = window.event || evt;
        var mouseAxis = Com.getMousePosition(evt);
        var offset = $element.offset();
        var size = {
            width: $element.width(),
            height: $element.height()
        };
        return (mouseAxis.x < offset.left || mouseAxis.y < offset.top ||
            mouseAxis.x > (offset.left + size.width) || mouseAxis.y > (offset.top + size.height));
    }
};

/**
 * @class 数组相关
 * @name Com.array
 */
Com.array = {

    /**
     * 删除数组中的空项目
     *
     * @function
     * @param {array} arr 需要执行trim操作的数组
     * @return {array} arr
     */
    trim: function(arr) {
        var l = arr.length;
        while (--l > 0) {
            if (arr[l] === undefined || arr[l] === '') {
                arr.splice(l, 1);
            }
        }
        return arr;
    },

    /**
     * 删除数组中重复的项
     *
     * @function
     * @param {array} arr 需要执行unique操作的数组
     * @return {array} arr
     */
    unique: function(arr) {
        var l = arr.length;
        while (--l > 0) {
            for (var i = 0; i < l; i++) {
                if (arr[l] == arr[i]) {
                    arr.splice(l, 1);
                    break;
                }
            }
        }
        return arr;
    },

    /**
     * 删除数组中值为item的项
     *
     * @function
     * @param {array} arr 需要执行操作的数组
     * @param {array|string|boolean|object} item 需要删除的项
     * @return {array} arr
     */
    removeItem: function(arr, item) {
        var partA;
        var partB;
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === item) {
                partA = arr.slice(0, i);
                partB = arr.slice((i + 1), l);
                return partA.concat(partB);
            }
        }
        return arr;
    },

    /**
     * 返回数组项的索引项
     *
     * @function
     * @param {array} arr 需要执行操作的数组
     * @param {array|string|boolean|object} item 查找的对象
     * @return {array} from 自第几项开始找起
     */
    indexOf: function(arr, item, from) {
        var len = arr.length;
        from = Number(from) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in arr && arr[from] === item) {
                return from;
            }
        }
        return -1;
    },

    /**
     * 返回根据数组内部对象的key值进行排序
     *
     * @function
     * @param {array} arr 数组
     * @param {number|string} field 依赖的字段
     * @return {array} 处理后的数组
     */
    sortBy: function(arr, field, order) {
        if (!arr || !arr.length) {
            return arr;
        }
        order = order === 'desc' ? 'desc' : 'asc';
        field = field || 'id';
        var _swap = function(arr, idx) {
            var tmp = arr[idx - 1];
            arr[idx - 1] = arr[idx];
            arr[idx] = tmp;
        };
        var first, next;
        for (var i = 0, len = arr.length - 2; len >= i; len--) {
            // bubble
            for (var j = 1, l = arr.length; j < l; j++) {
                first = arr[j];
                next = arr[j - 1];

                if (first[field] === undefined || first[field] === null ||
                    next[field] === undefined || next[field] === null) {
                    // continue;
                    _swap(arr, j);
                }

                if (order === 'desc' && (first[field] > next[field])) {
                    _swap(arr, j);
                } else if (order == 'asc' && (first[field] < next[field])) {
                    _swap(arr, j);
                }
            }
        }
        console.log('sort done', arr);
        return arr;
    },

    /**
     * 返回根据config提供的key名，对数组内部对象的order进行调整
     *
     * @function
     * @param {array} list数组，包含调整区间
     * @param {object} sourceObj, 需要调整顺序的obj对象
     * @param {number} targetOrder, 调整到目标位置
     * @param {object} config 配置项，用来声明key以及orderKey名称
     * @return {array} 调整顺序后的list数组
     */
    inputOrder: function(datalist, sourceObj, targetOrder, config) {
        var self = this;
        var list = datalist || [];
        if (!sourceObj || datalist.length <= 0) {
            return datalist;
        }
        sourceObj = sourceObj || {};
        config = config || {};
        var orderKey;
        if (typeof config == 'string') {
            orderKey = config;
        } else {
            orderKey = config.orderKey || 'order';
        }

        var srcOrder = sourceObj[orderKey];
        var total = list.length;

        // 获取移动对象在数组的原始位置，作为被替换对象的位置
        // 根据id来确定是同一个对象, 也可直接用indexOf直接来查找位置，但对象可能被clone过，那样查找将比较繁琐
        var sourceObjListIndex;
        var _getIndexByOrderKey = function(list, orderKey, process) {
            process = process || function(idx) {
                return (list[idx][orderKey] == sourceObj[orderKey]);
            };
            for(var i = 0, l = list.length; i < l; i++) {
                if (process(i)) {
                    return i;
                }
            }
            return -1;
        };

        // 为了确保准确根据顺序排序下
        Com.array.sortBy(list, orderKey, 'asc');
        sourceObjListIndex = _getIndexByOrderKey(list, orderKey);
        if (sourceObjListIndex < 0) {
            return list;
        }
        srcOrder = list[sourceObjListIndex][orderKey];

        if (srcOrder == targetOrder) {
            return list;
        }

        var lowerLimit = list[0][orderKey];
        var upperLimit = list[total - 1][orderKey];

        // 目标位置不能超出上下限
        if (targetOrder < lowerLimit) {
            targetOrder = lowerLimit;
        } else if (targetOrder > upperLimit) {
            targetOrder = upperLimit;
        }

        var step = (srcOrder < targetOrder) ? -1 : 1;
        var distance = Math.abs(targetOrder - srcOrder);

        // 逐个设置范围内的所有对象order，起始位置是移动对象的与调整区间差
        // 间隔为1，向上中间内容都减1位，向下则中间内容各升一位 
        while (distance) {
            var idx = (step < 1) ? (sourceObjListIndex + distance) : (sourceObjListIndex - distance);
            if (list[idx] !== undefined) {
                list[idx][orderKey] += step;
            }
            distance--;
        }

        list[sourceObjListIndex][orderKey] = targetOrder;

        return list;
    }
};

/**
 * @class cookie操作
 * @name Com.cookie
 */
Com.cookie = {
    /**
     * 验证字符串是否合法的cookie键名
     *
     * @param {string} source 需要遍历的数组
     * @meta standard
     * @returns {boolean} 是否合法的cookie键名
     */
    _isValidKey: function(key) {
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string

        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>

        return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
    },

    /**
     * 获取cookie的值，不对值进行解码
     * @name Com.cookie.getRaw
     * @function
     * @grammar Com.cookie.getRaw(key)
     * @param {string} key 需要获取Cookie的键名
     * @meta standard
     * @see Com.cookie.get,Com.cookie.setRaw
     *
     * @returns {string|null} 获取的Cookie值，获取不到时返回null
     */
    getRaw: function(key) {
        if (Com.cookie._isValidKey(key)) {
            var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                result = reg.exec(document.cookie);

            if (result) {
                return result[2] || null;
            }
        }

        return null;
    },

    /**
     * 获取cookie的值，用decodeURIComponent进行解码
     * @name Com.cookie.get
     * @function
     * @grammar Com.cookie.get(key)
     * @param {string} key 需要获取Cookie的键名
     * @remark
     * <b>注意：</b>该方法会对cookie值进行decodeURIComponent解码。如果想获得cookie源字符串，请使用getRaw方法。
     * @meta standard
     * @see Com.cookie.getRaw,Com.cookie.set
     *
     * @returns {string|null} cookie的值，获取不到时返回null
     */
    get: function(key) {
        var value = Com.cookie.getRaw(key);
        if ('string' == typeof value) {
            value = decodeURIComponent(value);
            return value;
        }
        return null;
    },


    /**
     * 设置cookie的值，不对值进行编码
     * @name Com.cookie.setRaw
     * @function
     * @grammar Com.cookie.setRaw(key, value[, options])
     * @param {string} key 需要设置Cookie的键名
     * @param {string} value 需要设置Cookie的值
     * @param {Object} [options] 设置Cookie的其他可选参数
     * @config {string} [path] cookie路径
     * @config {Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
     * @config {string} [domain] cookie域名
     * @config {string} [secure] cookie是否安全传输
     * @remark
     *
    <b>options参数包括：</b><br>
    path:cookie路径<br>
    expires:cookie过期时间，Number型，单位为毫秒。<br>
    domain:cookie域名<br>
    secure:cookie是否安全传输

     * @meta standard
     * @see Com.cookie.set,Com.cookie.getRaw
     */
    setRaw: function(key, value, options) {
        if (!Com.cookie._isValidKey(key)) {
            return;
        }

        options = options || {};

        // 计算cookie过期时间
        var expires = options.expires;
        if ('number' == typeof options.expires) {
            expires = new Date();
            expires.setTime(expires.getTime() + options.expires);
        }

        document.cookie =
            key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : '');
    },

    /**
     * 删除cookie的值
     * @name Com.cookie.remove
     * @function
     * @grammar Com.cookie.remove(key, options)
     * @param {string} key 需要删除Cookie的键名
     * @param {Object} options 需要删除的cookie对应的 path domain 等值
     * @meta standard
     */
    remove: function(key, options) {
        options = options || {};
        options.expires = new Date(0);
        Com.cookie.setRaw(key, '', options);
    },

    /**
     * 设置cookie的值，用encodeURIComponent进行编码
     * @name Com.cookie.set
     * @function
     * @grammar Com.cookie.set(key, value[, options])
     * @param {string} key 需要设置Cookie的键名
     * @param {string} value 需要设置Cookie的值
     * @param {Object} [options] 设置Cookie的其他可选参数
     * @config {string} [path] cookie路径
     * @config {Date|number} [expires] cookie过期时间,如果类型是数字的话, 单位是毫秒
     * @config {string} [domain] cookie域名
     * @config {string} [secure] cookie是否安全传输
     * @remark
     *
    1. <b>注意：</b>该方法会对cookie值进行encodeURIComponent编码。如果想设置cookie源字符串，请使用setRaw方法。<br><br>
    2. <b>options参数包括：</b><br>
    path:cookie路径<br>
    expires:cookie过期时间，Number型，单位为毫秒。<br>
    domain:cookie域名<br>
    secure:cookie是否安全传输

     * @meta standard
     * @see Com.cookie.setRaw,Com.cookie.get
     */
    set: function(key, value, options) {
        Com.cookie.setRaw(key, encodeURIComponent(value), options);
    }
};

/**
 * @class dom操作
 * @name Com.dom
 */
Com.dom = {


    /**
     * 遍历父节点,获得含有指定css名称的某个父节点(最近的)
     * 最顶层为document，如果没有返回则null
     *
     * @param {HTMLElement} elem DOM自己
     * @param {String} cssName 父节点的css名称，可以带.
     * @returns {HTMLElement} 指定的父节点 或者 Null
     */
    getParentByCss: function(elem, cssName) {
        var firstChar = cssName.substr(0, 1);
        if (firstChar === '.') {
            cssName = cssName.substr(1, cssName.length);
        }

        var classes = '';
        while ((elem = elem.parentNode) && elem != document.documentElement) {

            if (elem.className == cssName) {
                return elem;
            }

            // 如果css名称多个，含有即可
            classes = elem.className.split(' ');
            if (classes.length > 0) {

                for (var i = 0, l = classes.length; i < l; i++) {
                    if (classes[i] == cssName) {
                        return elem;
                    }
                }

            }

        }
        return null;
    },

    /**
     * 遍历父节点,获得含有指定tag名称的某个父节点(最近的)
     * 最顶层为document，如果没有返回则null
     *
     * @param {HTMLElement} elem DOM自己
     * @param {String} tagName 父节点的tag名称
     * @returns {HTMLElement} 指定的父节点 或者 Null
     */
    getParentByTag: function(elem, tagName) {
        while (elem != document.documentElement) {
            if (elem.tagName.toLowerCase() == tagName.toLowerCase()) {
                return elem;
            }
            elem = elem.parentNode;
        }
        return null;
    },

    /**
     * 获取指定DOM节点的位置
     *
     * @param {HTMLElement} elem DOM自己
     * @returns {object} 坐标
     */
    getPosition: function(elem) {
        var left = 0;
        var top = 0;
        while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return {
            x: left,
            y: top
        };
    },

    /**
     * 设置DOM节点的滚动大小，
     * 值为document.documentElement.scrollWidth/Height,
     * document.body.scrollWidth/Height,
     * document.body.offsetWidth/Height
     * 三者之间的最大值
     *
     * @param {HTMLElement} elem DOM自己
     */
    setSizeToScroll: function(elem) {
        var w = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        w = Math.max(w, document.body.offsetWidth);
        h = Math.max(h, document.body.offsetHeight);
        elem.style.width = w + 'px';
        elem.style.height = h + 'px';
    },

    /**
     * 根据style属性获得Key-Value对象。与element.style['']类似，但是只通过attr获取。
     * 可以避免style[color]获取rgb值
     * 相同属性后面覆盖前面的
     * @param {element} element DOM对象 或者 字符串
     * @returns {object} style属性
     */
    getStyle: function(element) {
        var style;
        var styles = [];
        var result = [];
        var map = {};
        var reg = /(.*):[^:\/](.*)/;
        // var reg = /((.*|[\s\S]*):(.*|[\s\S]*)){1}/;
        // var reg = /(([\s\S]*):([\s\S]*))/;
        if (!element) {
            return element;
        } else if (element.nodeType) {
            style = element.getAttribute('style');
        } else {
            style = element;
        }
        if (style && style.length > 1) {
            styles = style.split(';');
        }
        // TODO:
        // background-image:url中含有: /等，正则可能存在隐患
        // styles.forEach(function(key, i) {
        //     if (key) {
        //         result = reg.exec(key);
        //         if (result) {
        //             console.log(result);
        //             map[$.trim(result[1])] = $.trim(result[2]).replace(/\"/,'\'');
        //         }
        //     }
        // });
        var idx = -1;
        var name, value;
        styles.forEach(function(key, i) {
            if (key) {
                idx = key.indexOf(':');
                if (idx != -1) {
                    name = key.substr(0, idx);
                    value = key.substr(idx + 1) || '';
                    map[$.trim(name)] = $.trim(value).replace(/\"/g, '\'');
                }
            }
        });

        return map;
    },

    checkHTML: function(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return (div.innerHTML === html);
    }
};

/**
 * @class 字符串操作
 * @name Com.string
 */
Com.string = {

    /**
     * 获取字符串的长度，中英算作2个，英文算作1个
     * 根据标准ASCII码计算
     *
     * @param {String} str 字符串
     * @returns {Number} 字符串长度
     */
    getStrLength: function(str) {

        // return String(str).replace(/[^\x00-\xff]/g, "ci").length;

        if (typeof(str) != 'string') {
            str = str.toString();
        }
        var count = 0;

        for (var i = 0, l = str.length; i < l; i++) {
            // 0-127 ASCII char
            // 128-255 ASCII expand char
            if (str.charCodeAt(i) > 255) {
                count += 2;
            } else {
                count += 1;
            }
        }

        return count;
    },

    /**
     * 截取字符串，中文按2个，英文按1个长度计算
     *
     * @param {String} str 字符串
     * @returns {Number} 字符串长度
     */
    substrCn: function(str, length) {
        if (typeof(str) != 'string') {
            str = str.toString();
        }

        var _tmpStr = [];
        var j = 0;
        var i = 0;
        var strCnLen = 0;
        if (str.length < length) {
            return str;
        }
        // 全部按照双字节长度来处理
        // 截取的长度 x 2
        length = length * 2;
        while (j < length) {
            if (str.charCodeAt(i) > 255) {
                j += 2;
            } else {
                j++;
            }
            _tmpStr.push(str.charAt(i));
            i++;
        }
        //j > length  时（其实j == length + 1）最后一个肯定是汉字
        if (j > length) {
            _tmpStr.pop();
        }
        return _tmpStr.join('');
    },

    /**
     * 将字符串中的特殊字符替换为采用Unicode编码的字符串
     * 使之能够被JSON.parse识别
     *
     * @param {String} str 字符串
     * @returns {String} 替换后的字符串
     */
    escapeSpecialUnicode: function(str) {
        var r = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        return str.replace(r, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
    },

    /**
     * 字符替换，不区分大小写，替换所有
     *
     * @param {String} str 字符串
     * @param {String | Array} find 需要替换的字符或列表
     * @param {String} replace 新字符
     * @returns {String} 替换后的字符串
     */
    replaceAll: function(str, find, replace) {
        replace = replace || '';
        if (!find || find.length <= 0) {
            return str;
        }
        if (!(find instanceof Array)) {
            find = [find];
        }
        // 正则元字符
        var special = ['\\', ',', '!', '^', '$', '{', '}', '[', ']', '(', ')',
            '.', '*', '+', '?', '|', '<', '>', '-', '&'
        ];

        var tmp = '',
            item;
        var idx = 0,
            len = find.length;
        while (idx < len) {
            tmp = '';
            item = find[idx].toString();
            for (var i = 0, l = item.length; i < l; i++) {
                if ((special.indexOf && special.indexOf(item[i]) != -1) ||
                    (Com.array.indexOf(special, item[i]) != -1)) {
                    tmp += '\\' + item[i];
                } else {
                    tmp += item[i];
                }
            }
            item = tmp;
            str = str.replace(new RegExp(item, 'gmi'), replace);
            ++idx;
        }

        return str;
    },

    /**
     * 字符格式化，对字符中出现的指定字符按照符号格式化
     *
     * @param {String} str 字符串
     * @param {String | Array} find 需要替换的字符或列表
     * @param {String} delimiterLeft 左边界
     * @param {String} delimiterRight 右边界
     * @returns {String} 格式化后的字符串
     */
    format: function(str, find, delimiterLeft, delimiterRight) {
        delimiterLeft = delimiterLeft || '{';
        delimiterRight = delimiterRight || '}';
        find = Com.lang.isString(find) ? [find] : find;
        for (var i = 0, l = find.length; i < l; i++) {
            str = Com.string.replaceAll( str, find[i].toString(), (delimiterLeft + find[i] + delimiterRight) );
        }
        return str;
    },

    /**
     * 模板字符串与数据整合
     *
     * @param {String} tpl 模板字符串
     * @param {Object} data 需要替换的keyValue hash
     * @param {String} delimiterLeft 左边界
     * @param {String} delimiterRight 右边界
     * @returns {String} 整合后的字符串
     */
    merge: function(tpl, data, delimiterLeft, delimiterRight) {
        var str = '';
        delimiterLeft = delimiterLeft || '{';
        delimiterRight = delimiterRight || '}';
        var reg = new RegExp(delimiterLeft + '([.:a-z0-9_]+?)' + delimiterRight, 'ig');
        try {
            str = tpl.replace(reg, function(tpl, name, index) {
                var value = data[name];
                value = (value === null) ? 'null' : value;
                value = (value === undefined) ? '' : value;
                return value;
            });
            return str;
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * 获得32位的UUID
     *
     * returns {String} UUID
     */
    createUUID: (function(uuidRegEx, uuidReplacer) {
        return function() {
            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toLowerCase();
        };
    })(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    }),

    /**
     * 对目标字符串进行html解码
     *
     * @function
     * @grammar baidu.string.decodeHTML(source)
     * @param {string} source 目标字符串
     * @shortcut decodeHTML
     * @meta standard
     * @see baidu.string.encodeHTML
     *
     * @returns {string} html解码后的字符串
     */
    decodeHTML: function(source) {
        var str = String(source)
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, "&");
        //处理转义的中文和实体字符
        return str.replace(/&#([\d]+);/g, function(_0, _1) {
            return String.fromCharCode(parseInt(_1, 10));
        });
    },

    /**
     * html字符串过滤
     *
     * @function
     * @param {string} source 目标字符串
     * @returns {string} 过滤后的html字符串
     */
    filterHTML: function(source) {
        if (!source || source === '') {
            return source;
        }

        var str = source.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        return str;
    },

    /**
     * 对目标字符串进行html编码
     *
     * @function
     * @grammar baidu.string.encodeHTML(source)
     * @param {string} source 目标字符串
     * @remark
     * 编码字符有5个：&<>"'
     * @shortcut encodeHTML
     * @meta standard
     * @see baidu.string.decodeHTML
     *
     * @returns {string} html编码后的字符串
     */
    encodeHTML: function(source) {
        if (!source) {
            return source;
        }
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    },

    /**
     * 对目标字符串进行html编码
     *
     * @function
     * @param {string} source 目标字符串
     * @remark
     * 编码字符有3个：&<>
     * @see Com.string.encodeHTML
     *
     * @returns {string} html编码后的字符串
     */
    encodeHTML4Gird: function(source) {
        if (!source) {
            return source;
        }
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    /**
     * 对目标字符串进行unicode编码
     * @param {String} str 须要转换为unicode的字符
     *
     * @returns {string} html编码后的unicode串
     */
    enUnicode: function(str) {
        var strList = [];
        var _char = '';
        var tmp = '';
        /*
        for( var i = 0, l = str.length; i < l; i++ )  {
            _char = str.charCodeAt(i).toString(16);
            tmp = '\\u' + new Array(5 - _char.length).join('0') + _char;
            strList.push( tmp );
        };
         */
        for (var i = 0, l = str.length; i < l; i++) {
            _char = str.charCodeAt(i);
            tmp = '\\u' + ('000' + _char.toString(16)).slice(-4);
            strList.push(tmp);
        }


        return strList.join('');

    },
    /**
     * 对目标unicode串解码
     * @param {String} str unicode的字符
     *
     * @returns {string} 编码后的字符串
     */
    deUnicode: function(str) {
        str = str.replace(/\\/g, '%');
        return unescape(str);
    },
    /**
     * 返回字符串代表的时间，单位毫秒
     * @param  {String} str 形如：09：09表示9分9秒
     * @return {Number}     如00：09返回9000
     */
    getSeconds: function(str) {
        return Com.date.getMilliSecondByTime(str);
    },
    /**
     * 过滤掉字符串中某些特殊字符
     * @param  {String} str   待过滤的字符串
     * @param  {Array} filterChars 要过滤的字符组成的数组
     * @returns {String}   过滤之后的字符串
     */
    filterSpecialChars: function(str, filterChars) {
        // 正则元字符
        var special = [',', '!', '\\', '^', '$', '{', '}', '[', ']', '(', ')',
            '.', '*', '+', '?', '|', '<', '>', '-', '&'
        ];
        var r = new RegExp("h", "g");
        $.each(filterChars, function(index, c) {
            c = (special.indexOf(c) != -1) ? ('\\' + c) : c;
            r.compile(c, 'g');
            str = str.replace(r, '');
        });
        return str;
    },

    /**
     * 将URL参数变成Object
     * @param  {string} param   参数字符串
     * @returns {object} JSON
     */
    paramToJSON: function(param) {
        return Com.url.getParameters('?' + param);
    },
    /* utf.js - UTF-8 <=> UTF-16 convertion
     *
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */

    /*
     * Interfaces:
     * utf8 = utf16to8(utf16);
     * utf16 = utf16to8(utf8);
     */

    utf16to8: function(str) {
        var out, i, len, c;

        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },

    utf8to16: function(str) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
            }
        }

        return out;
    }

};

/**
 * @class 文件操作
 * @name Com.file
 */
Com.file = {

    /**
     * 获取文件扩展名
     *
     * @param {string} name 文件名称，包含扩展名
     * @returns {string} 文件的扩展名
     */
    getExt: function(name) {
        if (!name) {
            return null;
        }
        var idx = name.lastIndexOf('.');
        return name.substr(idx + 1).toLowerCase();
    },
    /**
     * 获取文件名
     *
     * @param {string} name 文件名称，包含扩展名
     * @returns {string} 文件名称
     */
    getName: function(name) {
        if (!name) {
            return null;
        }
        var idx = name.lastIndexOf('.');
        return name.substr(0, idx).toLowerCase();
    },
    /**
     * 将文件大小的字节数转化为格式化的字符串
     *
     * @param {number} bytes 文件大小的字节数
     * @param {boolean} si 转换方式，si为真时选择10^3，否则为2^10
     * @returns {string} 文件大小的格式化字符串
     */
    formatSize: function(bytes, si) {
        var thresh = si ? 1000 : 1024;
        var _bytes = bytes;
        if (bytes < thresh) {
            return bytes + ' B';
        }
        //var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        //              : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var units = si ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (bytes >= thresh);

        if (_bytes > (thresh * thresh * thresh)) {
            return bytes.toFixed(2) + ' ' + units[u];
        }
        return Math.round(bytes.toFixed(2)) + ' ' + units[u];
    },

    /**
     * 将文件大小的格式化字符串转化为字节数
     *
     * @param {string} strings 文件大小的格式化字符串
     * @returns {string} 文件大小的字节数
     */
    unFormatSize: function(strings) {
        if (typeof strings !== 'string') {
            return 0;
        }
        var unitTable = {
            'GB': 1000000000,
            'MB': 1000000,
            'KB': 1000,
            'G': 1262485504,
            'M': 1232896,
            'K': 1024
        };
        var sizeNum = strings.split(' ')[0];
        var unit = strings.split(' ')[1];
        return sizeNum * unitTable[unit];
    },

    /**
     * 将比特率格式化为字符串
     *
     * @param {number} bits 比特率
     * @returns {string} 比特率的格式化字符串
     */
    formatBitrate: function(bits) {
        if (typeof bits !== 'number') {
            return '';
        }
        if (bits >= 1073741824) {
            return (bits / 1073741824).toFixed(2) + ' GB/s';
        }
        if (bits >= 1048576) {
            return (bits / 1048576).toFixed(2) + ' MB/s';
        }
        if (bits >= 1024) {
            return (bits / 1024).toFixed(2) + ' KB/s';
        }
        return bits.toFixed(2) + ' Byte/s';
    },

    /**
     * 为指定的File对象创建Url对象
     *
     * @param {object} file 文件对象
     * @returns {object} url url对象
     */
    getObjectURL: function(file) {
        var url;
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
};

/**
 * @class 浏览器操作
 * @name Com.browser
 */
Com.browser = {

    /**
     * 获取用户代理数据
     *
     * @function
     */
    _getUserAgent: function() {
        var ua = navigator.userAgent;

        var result = {
            isStrict: document.compatMode == "CSS1Compat",
            isGecko: /gecko/i.test(ua) && !/like gecko/i.test(ua),
            isWebkit: /webkit/i.test(ua)
        };

        try {
            if (/(\d+\.\d+)/.test(external.max_version)) {
                result.maxthon = +RegExp['\x241'];
            }
        } catch (e) {
            console.log(e);
        }

        if (/msie (\d+\.\d+)/i.test(ua)) {
            result.ie = document.documentMode || +RegExp['\x241'];
        } else if (/trident(\.*?)/i.test(ua)) {
            result.ie = document.documentMode || +RegExp['\x241'];
        } else if (/chrome\/(\d+\.\d+)/i.test(ua)) {
            result.chrome = +RegExp['\x241'];
        } else if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua)) {
            result.safari = +(RegExp['\x241'] || RegExp['\x242']);
        } else if (/firefox\/(\d+\.\d+)/i.test(ua)) {
            result.firefox = +RegExp['\x241'];
        } else if (/opera(?:\/| )(\d+(?:\.\d+)?)(.+?(version\/(\d+(?:\.\d+)?)))?/i.test(ua)) {
            result.opera = +(RegExp["\x244"] || RegExp["\x241"]);
        }

        // switch (true) {
        //     case (/msie (\d+\.\d+)/i.test(ua)):
        //         result.ie = document.documentMode || +RegExp['\x241'];
        //         break;
        //     case /chrome\/(\d+\.\d+)/i.test(ua):
        //         result.chrome = +RegExp['\x241'];
        //         break;
        //     case /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua):
        //         result.safari = +(RegExp['\x241'] || RegExp['\x242']);
        //         break;
        //     case /firefox\/(\d+\.\d+)/i.test(ua):
        //         result.firefox = +RegExp['\x241'];
        //         break;
        //     case /opera(?:\/| )(\d+(?:\.\d+)?)(.+?(version\/(\d+(?:\.\d+)?)))?/i.test(ua):
        //         result.opera = +(RegExp["\x244"] || RegExp["\x241"]);
        //         break;
        // }
        return result;
    }
};

/** @lends Come.browser */
/**
 * 获取ie浏览器版本
 * @type number
 */
Com.browser.ie = Com.browser._getUserAgent().ie;
/**
 * 获取chrome浏览器版本
 * @type number
 */
Com.browser.chrome = Com.browser._getUserAgent().chrome;
/**
 * 获取firefox浏览器版本
 * @type number
 */
Com.browser.firefox = Com.browser._getUserAgent().firefox;
/**
 * 获取safari浏览器版本
 * @type number
 */
Com.browser.safari = Com.browser._getUserAgent().safari;
/**
 * 获取opera浏览器版本
 * @type number
 */
Com.browser.opera = Com.browser._getUserAgent().opera;
/**
 * 判断是否为严格模式
 * @type boolean
 */
Com.browser.isStrict = Com.browser._getUserAgent().isStrict;
/**
 * 判断浏览器是否为Gecko内核
 * @type boolean
 */
Com.browser.isGecko = Com.browser._getUserAgent().isGecko;
/**
 * 判断浏览器是否为Webkit内核
 * @type boolean
 */
Com.browser.isWebkit = Com.browser._getUserAgent().isWebkit;

/**
 * @class 页面相关
 * @name Com.page
 */
Com.page = {

    /**
     * IE浏览器全屏模式
     *
     * @function
     */
    fullScreenForIE: function() {
        alert("请按键盘上的F11全屏观看！");
        /*if($.browser.msie) {
            if(!!new ActiveXObject('WScript.Shell')) {
               // var WsShell = new ActiveXObject('WScript.Shell');
               // WsShell.SendKeys('{F11}');
            }
        }*/
    },

    /**
     * 进入全屏模式
     *
     * @function
     */
    loadFullScreen: function() {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else {
            this.fullScreenForIE();
        }
    },

    /**
     * 退出全屏模式
     *
     * @function
     */
    exitFullScreen: function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else {
            this.fullScreenForIE();
        }
    },

    /**
     * 跟随页面滚动器，指向页面顶部
     * @param {JQuery Object} $scrollToTop 页面滚动对象
     */
    scrollToTop: function($scrollToTop) {
        if (!$scrollToTop || $scrollToTop.length <= 0) {
            $scrollToTop = $('#' + Base.Config.SCROLL_TOP_ID);
        }
        var distance = (window.innerWidth ?
            window.pageYOffset :
            document.documentElement.scrollTop);
        if (distance > $(window).height() / 2) {
            $scrollToTop.removeClass('scroll-to-top-hide');
            $scrollToTop.addClass('scroll-to-top');
        } else {
            $scrollToTop.addClass('scroll-to-top-hide');
        }
    }

};


/**
 * @class url操作
 * @name Com.url
 */
Com.url = {

    /**
     * 获取指定url中的key参数
     *
     * @param {string} key 需要获取的参数名称
     * @param {string} url url地址
     * @returns {string|number} 参数的值
     */
    getQueryValue: function(key, url) {
        return this.getParameters(url)[key];
    },
    /**
     * 获取页面hash值
     * @author  smyle
     * @return {string} hash值
     */
    getHash: function(url, flag) {
        var segs, lastPoundKeyIndex;

        flag = flag || '?';
        url = url || window.location.href;
        segs = url.split(flag);
        lastPoundKeyIndex = segs[0].lastIndexOf('#');
        return 0 <= lastPoundKeyIndex ? segs[0].substring(lastPoundKeyIndex + 1) : void 0;
    },
    /**
     * 获取url指定参数
     *
     * @param {string} param 需要获取的参数名称
     * @returns {string|number} 参数的值
     */
    getParameter: function(param, url) {
        var params = this.getParameters(url);
        return params[param];
    },

    /**
     * 获取url中的全部参数
     *
     * @param {string} url url地址
     * @param {string|regexp} flag url参数标志
     * @param {return} object 字符串变为JSON，只支持一级
     */
    getParameters: function(url, flag) {
        url = url || window.location.href;
        flag = flag || '?';
        var params = {},
            parts = (url || '').split(flag),
            items, item,
            key, value;

        if (parts.length <= 1) {
            return params;
        }

        value = parts[1];
        key = value.lastIndexOf('#');
        value = key >= 0 ? value.substring(0, key) : value;

        items = value.split('&');
        for (var i = 0, l = items.length; i < l; i++) {

            item = items[i].split('=');
            key = decodeURIComponent(item[0]);
            // plus covert to space
            if (item[1] !== undefined) {
                value = decodeURIComponent(item[1].replace(/\+/g, ' '));
            }

            if (params[key] !== undefined) {
                if (params[key] instanceof Array) {
                    params[key].push(value);
                } else {
                    params[key] = [params[key]];
                    params[key].push(value);
                }
            } else {
                params[key] = (value || '');
            }
        }

        return params;
    },

    /**
     * 解析url地址
     *
     * @param {string} url url地址
     * @returns {object} attr 解析后的属性对象
     */
    parse: function(url) {
        if (!url || url.length <= 0) {
            return false;
        }
        var reg = /(\w+):\/\/([^/:]+)(:\d*)?([^#]*)/;
        var result = reg.exec(url);
        var key = ['protocol', 'host', 'port', 'path'];
        var attr = {};
        for (var i = 1, l = result.length; i < l; i++) {
            attr[key[i - 1]] = result[i] || '';
        }
        return attr;
    },

    /**
     * 获取url协议
     *
     * @param {string} url url地址
     * @returns {string} url协议
     */
    protocol: function(url) {
        var attr = this.parse(url);
        return attr['protocol'];
    },

    /**
     * 获取url主机名称
     *
     * @param {string} url url地址
     * @returns {string} url主机名称
     */
    host: function(url) {
        var attr = this.parse(url);
        return attr['host'];
    },

    /**
     * 获取url端口号
     *
     * @param {string} url url地址
     * @returns {string} url端口号
     */
    port: function(url) {
        var attr = this.parse(url);
        return attr['port'];
    },

    /**
     * 获取url路径
     *
     * @param {string} url url地址
     * @returns {string} url路径
     */
    path: function(url) {
        var attr = this.parse(url);
        return attr['path'];
    },

    /**
     * 格式化含有空格的参数字符串
     *
     * @param {string} str 原始字符串
     * @param {string} type 请求类型
     * @returns {string} 格式化后的字符串
     */
    getParamsStr: function(str, type) {
        var _paramsStr = str;
        type = type || 'POST';
        // URL编码中，"+"已被转码为"%2B"
        // jQuery serialize函数会把空格转换为+号
        _paramsStr = _paramsStr.replace(/\+/g, "%20");
        if (type == 'POST') {
            _paramsStr = decodeURIComponent(_paramsStr);
        }
        return _paramsStr;
    }

};

/**
 * @class 帮助函数
 * @name Com.helper
 */
Com.helper = {

    /** @lends Com.helper */
    /**
     * 函数列表
     *
     * @type Array
     * @default []
     */
    '_fnList': [],

    /**
     * 获取事件的target对象
     *
     * @param {object} evt 事件对象
     * @returns {object} dom对象
     */
    getTarget: function(evt) {
        evt = evt || window.event;

        return evt.srcElement || evt.target;
    },

    /**
     * 为_fnList添加函数
     *
     * @param {object} fn 函数对象
     * @param {object} scope 上下文
     * @returns {array} _fnList 函数列表
     */
    addFunction: function(fn, scope) {
        return this._fnList.push(function() {
            return fn.apply(scope || window, arguments);
        }) - 1;
    },

    /**
     * 调用函数
     *
     * @param {number} index 函数列表的索引
     * @returns {object} 函数对象
     */
    callFunction: function(index) {
        var fn = this._fnList[index];

        return fn && fn.apply(null, Array.prototype.slice.call(arguments, 1));
    },

    /**
     * 从函数列表中移除函数
     *
     * @param {number} index 函数列表的索引
     */
    removeFunction: function(index) {
        if (index) {
            this._fnList[index] = null;
        } else {
            this._fnList = [];
        }
    },

    /**
     * 显示错误
     *
     * @param {object} $dom
     * @param {object} $tip 错误提示的节点
     * @param {string} message 错误信息
     */
    showError: function($dom, $tip, message) {
        try {
            if ($tip) {
                $tip.addClass('error');
            }
            if ($dom) {
                $dom.addClass('error');
                $dom[0].focus();
            }
            if (message && $tip) {
                $tip.html(message);
            }
        } catch (e) {
            // alert(e);
        }
    },

    /**
     * 显示提示信息
     *
     * @param {object} $dom
     * @param {object} $tip 信息提示的节点
     * @param {string} message 信息内容
     */
    showMessage: function($dom, $tip, message) {
        try {
            if ($tip) {
                $tip.removeClass('error');
            }
            if ($dom) {
                $dom.removeClass('error');
            }
            if (message && $tip) {
                $tip.html(message);
            }
        } catch (e) {
            // alert(e);
        }
    },

    /**
     * 对不支持placeholder属性的浏览器设置占位符
     *
     * @param {object} elem dom节点对象
     */
    setPlaceHoler: function(elem) {
        if (!elem || !elem.nodeName) {
            return;
        }
        var input = elem;
        var supportPlaceholder = 'placeholder' in elem;
        var _placeholder = function(input) {
            var text = input.getAttribute('placeholder'),
                defaultValue = input.defaultValue;
            if (defaultValue === '') {
                input.value = text;
            }
            input.onfocus = function() {
                if (input.value === text) {
                    this.value = '';
                }
            };
            input.onblur = function() {
                if (input.value === '') {
                    this.value = text;
                }
            };
        };

        if ($.browser.msie || !supportPlaceholder) {
            if (input.type === 'text' &&
                input.getAttribute('placeholder')) {
                _placeholder(input);
            }
        }
    },

    /**
     * 解决IE6浏览器下的透明问题
     *
     * @function
     */
    fixIE6PNG: function() {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        var _isPNG = function() {
            var imgName = img.src.toUpperCase();
            var ext = imgName.substring(imgName.length - 3, imgName.length);
            return (ext == 'PNG');
        };

        var _replaceImg = function(img) {
            img.onload = function() {
                var width = img.width || img.offsetWidth || img.style.width;
                var height = img.height || img.offsetHeight || img.style.height;
                var imgID = (img.id) ? "id='" + img.id + "' " : "";
                var imgClass = (img.className) ? "class='" + img.className + "' " : "";
                var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
                var imgStyle = "display:inline-block;" + img.style.cssText;
                if (img.align == "left") {
                    imgStyle = "float:left;" + imgStyle;
                }
                if (img.align == "right") {
                    imgStyle = "float:right;" + imgStyle;
                }
                if (img.parentElement.href) {
                    imgStyle = "cursor:hand;" + imgStyle;
                }
                var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + width + "px; height:" + height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
                img.outerHTML = strNewHTML;
            };

        };

        if (version && (version <= 6) && (document.body.filters)) {
            for (var i = 0, l = document.images.length; i < l; i++) {
                var img = document.images[i];
                if (_isPNG(img)) {
                    _replaceImg(img);
                }
            }
        }
    },

    /**
     * @class 图片对齐
     * @name Com.helper.imageAlign
     */
    imageAlign: {

        IMG_SIZE: {
            width: '150',
            height: '150'
        },
        // align clip position
        // l is left, r is right, c is center, m is middle
        // LT, RT, LB, RB, CM, LM, RM, TC, BC
        CLIP_ALIGN_TYPE: 'TC',

        /**
         * 设置图片对齐方式
         *
         * @param {object} img 需要执行操作的图片
         * @param {string} type 对齐方式
         */
        align: function(img, type, size) {
            size = size || this.IMG_SIZE;
            var width = size.width;
            var height = size.height;
            var ca = type || this.CLIP_ALIGN_TYPE;
            // set proportion for width and height
            var proportion = 1;

            var alignLeft = function(img) {
                // css default
                // do nothing
            };

            var alignTop = function(img) {
                // css default
                // do nothing
            };

            var alignRight = function(img) {
                // var gap = (img.width - width);
                var gap = (img.width / proportion) - width;
                img.style.marginLeft = -(gap) + 'px';
            };

            var alignBottom = function(img) {
                // var gap = (img.height - height);
                var gap = (img.height / proportion) - height;
                img.style.marginTop = -(gap) + 'px';
            };

            var alignMiddle = function(img) {
                var gap = (img.height / proportion) - height;
                img.style.marginTop = -Math.floor(gap / 2) + 'px';
            };

            var alignCenter = function(img) {
                var gap = (img.width / proportion) - width;
                // if don't use lazyload that the gap don't / proportion
                // var gap = (img.width - width);
                // console.log(img.src + '?'+ img.width + ' x '+ img.height);
                img.style.marginLeft = -Math.floor(gap / 2) + 'px';
            };

            // LT, RT, LB, RB, CM, LM, RM, TC, BC
            if (img.width < img.height) {
                proportion = img.width / width;
                if (ca.indexOf('T') != -1) {
                    alignTop(img);
                } else if (ca.indexOf('M') != -1) {
                    alignMiddle(img);
                } else if (ca.indexOf('B') != -1) {
                    alignBottom(img);
                }

                img.width = width;

            } else {
                proportion = img.height / height;
                if (ca.indexOf('L') != -1) {
                    alignLeft(img);
                } else if (ca.indexOf('C') != -1) {
                    alignCenter(img);
                } else if (ca.indexOf('R') != -1) {
                    alignRight(img);
                }

                img.height = height;

            }
        },

        /**
         * 使用默认值批量设置图片对齐方式
         *
         * @param {object} $imgList 需要执行操作的图片
         */
        fitImageSize: function($imgList) {
            var self = this;
            $imgList.each(function(i, img) {
                $(img).bind('load', function() {
                    self.align(img);
                });
            });
        }
    }
};

/**
 * @class 时间操作
 * @name Com.date
 */
Com.date = {

    /**
     * 获取当前时间
     *
     * @return {string} 当前时间
     */
    getCurrentDate: function() {
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        return '/' + d.getFullYear() + '/' + month + '/' + day + '';
    },

    /**
     * 根据毫秒获得年月日天小时
     *
     * @param {String} millisecond 毫秒数
     * @param {Object} options 配置项
     * @see Com.date.convertMillisecond
     * @return 时间字符
     */
    convertmilliSecond: function(millisecond, options) {
        return this.convertMillisecond(millisecond, options);
    },

    /**
     * 根据毫秒获得年月日天小时
     *
     * @param {String} millisecond 毫秒数
     * @param {Object} options 配置项
     * @return {String} 时间字符
     */
    convertMillisecond: function(millisecond, options) {

        if ('undefined' == typeof millisecond || millisecond === '') {
            return millisecond;
        }
        var timeStr = [];
        var year = 0;
        var month = 0;
        var day = 0;
        var hour = 0;
        var minute = 0;
        var second = 0;
        var hourStr = '';
        var minuteStr = '';
        var secondStr = '';
        options = options || {};
        var onlyHour = options.onlyHour;
        var onlyMinute = options.onlyMinute;

        second = millisecond / 1000;
        if (second < 0) {
            return second;
        }

        if (second >= 60) {
            minute = second / 60;
            second = second % 60;
        }

        if (!onlyMinute) {
            if (minute >= 60) {
                hour = minute / 60;
                minute = minute % 60;
            }
        }

        if (!onlyHour) {
            if (hour >= 24) {
                day = hour / 24;
                hour = hour % 24;
            }
        }

        if (!onlyMinute && !onlyHour) {
            if (day >= 30) {
                month = day / 30;
                day = day % 30;
            }
            if (month >= 12) {
                year = month / 12;
                month = month % 12;
            }
            if (Math.floor(year) > 0) {
                timeStr.push(Math.floor(year) + '年');
            }
            if (Math.floor(month) > 0) {
                timeStr.push(Math.floor(month) + '月');
            }
            if (Math.floor(day) > 0) {
                timeStr.push(Math.floor(day) + '天 ');
            }
        }

        hour = Math.floor(hour);
        minute = Math.floor(minute);
        second = Math.floor(second);

        hourStr = hour < 10 ? '0' + hour : hour;
        minuteStr = minute < 10 ? '0' + minute : minute;
        secondStr = second < 10 ? '0' + second : second;

        if (!onlyMinute) {
            timeStr.push(hourStr + ':');
        }

        timeStr.push(minuteStr + ':');
        timeStr.push(secondStr);

        return timeStr.join('');
    },

    /**
     * 日期格式化
     *
     * @param {Date} date 日期或时间戳
     * @param {String} format 日期格式化
     * @param {Boolean|Integer|String} 时区标记，有效值：[-12, 12](例如，中国时8区为:+8)
     * @returns {String} 格式化后的字符串
     */
    format: function(date, format, useLocalDate) {
        if (!date || !format) {
            return '';
        }
        if ('string' == typeof date) {
            return date;
        }

        var offsetMilliSeconds = 0;
        if (true === useLocalDate) {
            // 北京为东8区时间，比伦敦时间早8小时，故需要加上8小时
            // (28800000 = 8 * 3600 * 1000);
            offsetMilliSeconds = 28800000;
        } else if ('number' === typeof useLocalDate || 'string' === typeof useLocalDate) {
            offsetMilliSeconds = useLocalDate * 3600 * 1000;
        }

        if (date instanceof Date) {
            date = date.getTime();
        }
        date += offsetMilliSeconds;
        date = new Date(date);

        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            '[h|H]+': date.getHours(), // @smyle: support uppercase
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return format;
    },

    /**
     * 时间格式化
     *
     * @param {number} seconds 时间戳
     * @returns {string} 格式化后的时间字符串
     */
    formatTime: function(seconds) {
        if (!seconds || seconds <= 0) {
            return '00:00:00';
        }
        var date = new Date(seconds * 1000);

        if (!date || date == 'Invalid Date') {
            return '';
        }

        var days = Math.floor(seconds / 86400);
        var month = Math.floor(days / 30);
        var year = Math.floor(month / 12);

        days = days - (month * 30);
        month = month - (year * 12);

        year = year ? year + '年' : '';
        month = month ? month + '月' : '';
        days = days ? days + '天 ' : '';

        return year + month + days +
            ('0' + date.getUTCHours()).slice(-2) + ':' +
            ('0' + date.getUTCMinutes()).slice(-2) + ':' +
            ('0' + date.getUTCSeconds()).slice(-2);
    },

    /**
     * 获取从当前时间往前数d天，m月的结果
     *
     * @param {Date} d 天数
     * @param {Date} m 月数
     * @returns {String} 格式化后的字符串
     */
    getPreviousDate: function(d, m) {
        var s = new Date();
        month = m ? s.getMonth() - m : s.getMonth();
        date = d ? s.getDate() - d : s.getDate();
        d = new Date(s.getFullYear(), month, date);
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
            ('0' + d.getDate()).slice(-2);
    },

    /**
     * 分秒格式转成毫秒秒数
     *
     * @param {string} str 时间格式09:09 或者 09:09:09
     * @returns {number} 毫秒
     */
    getMilliSecondByTime: function(str) {
        var second = 0;
        if (!str || str === '') {
            return str;
        }

        var strArr = $.trim(str).split(':');
        var multiple = 1;
        var len = strArr.length;
        /*
        for(var i = len-1;i >= 0; i--){
            second += (parseInt(strArr[i],10) * multiple);
            multiple *= 60;
        }*/
        while (len--) {
            second += (parseInt(strArr[len], 10) * multiple);
            multiple *= 60;
        }
        second *= 1000;

        return second;
    }
};

/**
 * @class 格式化
 * @name Com.format
 */
Com.format = {

    /**
     * 将文件大小的字节数转化为格式化的字符串
     *
     * @param {number} bytes 文件大小的字节数
     * @param {boolean} si 转换方式，si为真时选择10^3，否则为2^10
     * @returns {string} 文件大小的格式化字符串
     * @see Com.file.formatSize
     */
    formatFileSize: function(bytes, si) {
        return Com.file.formatSize(bytes, si);
    },

    /**
     * 将文件大小的格式化字符串转化为字节数
     *
     * @param {string} strings 文件大小的格式化字符串
     * @returns {string} 文件大小的字节数
     * @see Com.file.unFormatSize
     */
    unFormatFileSize: function(strings) {
        return Com.file.unFormatSize(strings);
    },

    /**
     * 将比特率格式化为字符串
     *
     * @param {number} bits 比特率
     * @returns {string} 比特率的格式化字符串
     * @see Com.file.formatBitrate
     */
    formatBitrate: function(bits) {
        return Com.file.formatBitrate(bits);
    },

    /**
     * 时间格式化
     *
     * @param {number} seconds 时间戳
     * @returns {string} 格式化后的时间字符串
     * @see Com.date.formatTime
     */
    formatTime: function(seconds) {
        return Com.date.formatTime(seconds);
    },

    /**
     * 状态格式化
     *
     * @param {number} value 状态值
     * @returns {string} 格式化后Html字符串
     */
    formatState: function(value) {
        //后续维护这张表
        var _stateTable = {
            '-1': '未抓取',
            '0': '<span class="success">排队中</span>',
            '1': '<span class="success">抓取中</span>',
            '2': '<span class="success">抓取完成</span>',
            '3': '<span class="error">抓取失败</span>',
            '4': '<span class="error">入库失败</span>',
            '5': '<span class="success">已入库</span>'
        };
        return _stateTable[value];
    }
};

/** @lends Come */
/**
 * 快捷方法：对象继承
 * @type function
 * @see Com.lang.inherits
 */
Com.inherits = Com.lang.inherits;
/**
 * 快捷方法：判断是否为Element对象
 * @type function
 * @see Com.lang.isElement
 */
Com.isElement = Com.lang.isElement;
/**
 * 快捷方法：获取鼠标位置
 * @type function
 * @see Com.event.getMousePosition
 */
Com.getMousePosition = Com.event.getMousePosition;