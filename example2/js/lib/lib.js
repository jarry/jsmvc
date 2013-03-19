/*
 * @file core.js
 * @desc �ײ㾲̬������⣬һ��ѡ��һ��JS�⣬��jquery,prototype,tangram��
 *       <li>���к������Ǿ�̬������UI�����һЩʵ���Թ��߿����Ƕ�����</li>
 *       <li>��һЩ�ײ�ķ���������������ҵ��Ͳ�Ʒ�����޹أ����������κ���Ŀ</li>
 *       <li>��ҵ���޹صĴ��룬������Ϊ������Ʒ����Ŀ����</li>
 *
 */


/**
 * �ж�Ŀ������Ƿ�string���ͻ�String����
 * 
 * @param {Any} source Ŀ�����
 * @return {boolean} �����жϽ��
 */
var isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

/**
 * ����id��dom���ض���
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
 * ɾ��Ŀ���ַ������˵Ŀհ��ַ�
 * 
 * @param {string} source Ŀ���ַ���
 * @return {string} ɾ�����˿հ��ַ�����ַ���
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
 * ����baidu.event��
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
 * �¼���������
 * ����������¼�ʱ��Ҫ������window����
 * 
 * @param {Event}   event        �¼�����
 * @param {Window}  win optional ���ڶ���Ĭ��Ϊwindow
 */
baidu.event.EventArg = function (event, win) {
    win = win || window;
    event = event || win.event;
    var doc = win.document;
    
    this.target = event.srcElement;
    this.keyCode = event.which;
    for (var k in event) {
        var item = event[k];
        // ���⿽��preventDefault���¼����󷽷�
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
 * ��ֹ�¼���Ĭ����Ϊ
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
 * ֹͣ�¼��Ĵ���
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
 * ֹͣ�¼�
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
 * �¼��������Ĵ洢��
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
 * ж�������¼�������
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

// ��ҳ��ж�ص�ʱ�򣬽������¼��������Ƴ�
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
 * ��ȡ��չ���¼�����
 * 
 * @param {Event}  event ԭ���¼�����
 * @param {window} win   �������
 * @return {EventArg} ��չ���¼�����
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
 * ��ȡ�����¼��ļ�ֵ
 * 
 * @param {Event} event �¼�����
 * @return {number} �����¼��ļ�ֵ
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
 * ��ȡ����¼������x����
 * 
 * @param {Event} event �¼�����
 * @return {number} ����¼������x����
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
 * ��ȡ����¼������y����
 * 
 * @param {Event} event �¼�����
 * @return {number} ����¼������y����
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
 * ��ȡ�¼��Ĵ���Ԫ��
 * 
 * @param {Event} event �¼�����
 * @return {HTMLElement} �¼��Ĵ���Ԫ��
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
 * ΪĿ��Ԫ������¼�������
 * 
 * @param {HTMLElement|string|window} element  Ŀ��Ԫ�ػ�Ŀ��Ԫ��id
 * @param {string}                    type     �¼�����
 * @param {Function}                  listener �¼�������
 * @return {HTMLElement} Ŀ��Ԫ��
 */
baidu.event.on = function (element, type, listener, args) {
    type = type.replace(/^on/i, '');
    if ('string' == typeof element) {
        element = baidu.dom.g(element);
    }

//    var fn = function (ev) {
//        // ���ﲻ֧��EventArgument
//        // ԭ���ǿ�frame��ʱ�����
//        listener.call(element, ev);
//    };
	
	// ���ز��� modified by jarryli
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
    
    // ���������洢��������
    lis[lis.length] = [element, type, listener, fn];
    
    // �¼�����������
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, fn);
    } 
    
    return element;
};

// ������ݷ���
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
 * ��ֹ�¼���Ĭ����Ϊ
 * 
 * @param {Event} event �¼�����
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
 * ֹͣ�¼�
 * 
 * @param {Event} event �¼�����
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
 * ֹͣ�¼��Ĵ���
 * 
 * @param {Event} event �¼�����
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
 * ΪĿ��Ԫ���Ƴ��¼�������
 * 
 * @param {HTMLElement|string|window} element  Ŀ��Ԫ�ػ�Ŀ��Ԫ��id
 * @param {string}                    type     �¼�����
 * @param {Function}                  listener �¼�������
 * @return {HTMLElement} Ŀ��Ԫ��
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
        
        // listener����ʱ���Ƴ�element��������listener������type�����¼�
        // listener������ʱ���Ƴ�element������type�����¼�
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

// ������ݷ���
baidu.un = baidu.event.un;/**
 * Baidu UE JavaScript Library
 * 
 * ajax.js
 * @anthor UTer
 * @version $Revision: 1.9 $
 */


/**
 * Ajax��
 * @param {Function} onSuccess ����ɹ�ʱ�ص�����
 * @param {Function} onFail ����ʧ��ʱ�ص�����
 */
function Ajax(onSuccess, onFail) {
    this.onSuccess = onSuccess;
    if (onFail) {
        this.onFail = onFail;
    }

    //��ʼ��XMLHttpRequest
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
     * ���û�ȡ����������ΪXML
     * @public
     */
    setXML: function () {
        this.dataType = "xml";
    },

    /**
     * ��������˷�������
     * @public
     * @param {String} url �����ַ
     * @param {String} data ���͵����ݣ���ʽ����a=aaa&b=bbb
     * @param {String} method ����ʽ��post|get
     * @param {String} encoding �������ݵı��뷽ʽ����postʱ��Ч
     */
    send: function (url, data, method, encoding) {
        var meth = "get";
        var contentType = "application/x-www-form-urlencoded";

        //��������
        if (method && method == "post") {
            meth = "post";
        }

        //���ݷ�������get/post������url�ͷ���ͷ
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

        //��������
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
     * ͨ��post��ʽ��������˷�������
     * @public
     * @param {String} url �����ַ
     * @param {String} data ���͵����ݣ���ʽ����a=aaa&b=bbb
     * @param {String} encoding �������ݵı��뷽ʽ
     */
    post: function (url, data, encoding) {
        this.send(url, data, "post", encoding);
    },

    /**
     * ͨ��get��ʽ��������˷�������
     * @public
     * @param {String} url �����ַ
     * @param {String} data ���͵����ݣ���ʽ����a=aaa&b=bbb
     */
    get: function (url, data) {
        this.send(url, data);
    },

    /**
     * ��send�е��ã���readyState�����ı�ʱ����
     * @private
     */
    onStateChg: function () {
        //����״̬δ����ʱ�����κ���
        if (this.xhr.readyState != 4) {
            return;
        }

        //����״̬�봥������ɹ�/ʧ�ܵ�function
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
 * Ԫ��
 * @public
 * @param {object} props ���Ա
 * @param {Class} superClass ����
 * @return {Class} ��������
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
 * ɾ���ַ����е���β�հ��ַ�
 * 
 * @public
 * @return {String} ��������ַ���
 */
String.prototype.trim = function () {
    return this.replace(/(^[\s\u3000\xa0]+|[\s\u3000\xa0]+$)/g, '');
};

/**
 * �����ַ����е�html�����ַ�
 * 
 * @public
 * @return {String} ��������ַ���
 */
String.prototype.escapeHTML = function () {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * �������ַ����е�html�����ַ�
 * 
 * @public
 * @return {String} ��������ַ���
 */
String.prototype.unescapeHTML = function () {
    return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

/**
 * �򵥵��ַ�����ʽ��
 * 
 * @public
 * @return {String} ��ʽ������ַ���
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
 * �ж��ַ����Ƿ���ĳ���ַ�����ʼ
 * 
 * @public
 * @param {String} str ��ʼ���ַ���
 * @return {Boolean} �Ƿ���param string��ʼ
 */
String.prototype.startWith = function (str) {
    return this.indexOf(str) === 0;
};

/**
 * �ж��ַ����Ƿ���ĳ���ַ�����β
 * 
 * @public
 * @param {String} str ��ʼ���ַ���
 * @return {Boolean} �Ƿ���param string��β
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
 * Dom�������չ��
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
     * ��װ���汾��Ϣ
     * @private
     */
    wrapVersion: 1,
    
    /**
     * Element����ʽ����
     * <pre>
     * <b>����css��</b>
     * .css('width', '500px')
     * .css({width : '500px', backgroundColor : '#ccc'})
     * .css('width', '500px', 'backgroundColor', '#ccc')
     * <b>��ȡcss��</b>
     * .css('width')
     * </pre>
     * @public
     * 
     * @return {Element} ��ǰԪ��
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
     * ����Element�ɼ�
     * @public
     * 
     * @param {String} display �µ���ʾ��ʽ:block|inline....,Ĭ��Ϊ""(��Щ�����,style.display=''��������ʾԪ��,ԭ�����)
     * @return {Element} ��ǰԪ��
     */
    show: function (display) {
        this.style.display = display || '';
        return this;
    },
    
    /**
     * ����Element����
     * @public
     * 
     * @return {Element} ��ǰԪ��
     */
    hide: function () {
        this.style.display = "none";
        return this;
    },
    
    /**
     * ΪElement���class
     * @public
     * 
     * @param {String} name class������
     * @return {Element} ��ǰԪ��
     */
    addClass: function (name) {
        var classArr = this.className.split(/\s+/);
        classArr.push(name);
        this.className = classArr.join(' ');
        return this;
    },
    
    /**
     * ɾ��Element��class
     * @public
     * 
     * @param {String} name class������
     * @return {Element} ��ǰԪ��
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
     * �����Element
     * @public
     * 
     * @param {HTMLElement} el Ҫ��ӵ�Ԫ��
     * @return {Element} ��ǰԪ��
     */
    append: function (el) {
        this.appendChild(el);
        return this;
    },
    
    /**
     * ����Element��innerHTML
     * @public
     * 
     * @param {String} html html�ַ���
     * @return {Element} ��ǰԪ��
     */
    setHTML: function (html) {
        this.innerHTML = html;
        return this;
    },
    
    /**
     * ��ҳ�����Ƴ�Element
     * @public
     * 
     * @return {Element} ��ǰԪ��
     */
    remove: function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        return this;
    },
    
    /**
     * �Ƴ�Element�ڲ����ı��ڵ�
     * @public
     * 
     * @return {Element} ��ǰԪ��
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
     * ���Element�ľ���λ��
     * @public
     * 
     * @return {K,V} λ����Ϣ
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
     * ����Element��͸����
     * @public
     * 
     * @param {Number} opacity ͸���ȣ�0-1
     * @return {Element} ��ǰԪ��
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
     * ��������ַ���
     * 
     * @owner window
     * @param {Number} len ����uniqueId�ĳ���
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
 * �����ؼ�
 * <pre>
 * <h3>����������˵����</h3>
 * onselect���û�ѡ������ʱ�����¼�
 * onviewchange:�����Ӿ������л�ʱ�����¼�
 * dateStyle��������ʽ����ΪString��Function
 * 
 * <h3>ʾ����</h3>
 * var myCalendar = new Calendar({
 *     onselect: function (date) {
 *         if (date.getDate() == 1){alert('������ѡ1��');return false;}
 *         G("ShowDate").innerHTML = "��ѡ���������:" + date.getFullYear() + "��" + (date.getMonth()+1) + "��" + date.getDate() + "��";
 *     },
 *     dateStyle: function (date) {
 *         if(date.getDay() == 0 || date.getDay() == 6) return "background:#eee";
 *     }
 * });
 * myCalendar.appendTo(document.body);
 * </pre>
 * 
 * @param {Object} params ���ڳ�ʼ���ؼ������Լ���
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
 * ������ڵ�ǰ�·ݵ�����
 * 
 * @private
 * @param {Date} ����
 * @return {Number} ����
 */
Calendar.getDateCountByMonth = function (date) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.getDate();
};

Calendar.prototype = {
    /**
     * ��������
     * 
     * @public
     * @param {Date} date ����
     */
    setDate: function (date) {
        this.date = date;
        this.viewDate = new Date(Date.parse(date));
        G(this.bodyId).innerHTML = this.getBodyHtml();
        G(this.titleId).innerHTML = this.getTitleHtml();
    },
    
    /**
     * ���ؼ����ӵ�ҳ������
     * 
     * @public
     * @param {HTMLElement} el ҳ������Ԫ��
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
     * ���������ؼ�ͷ
     * 
     * @private
     * @param {HTMLElement} container �ؼ���������Ԫ��
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
     * ���������ؼ���
     * 
     * @private
     * @param {HTMLElement} container �ؼ���������Ԫ��
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
     * ��ȡ�ؼ�ͷ������¼����
     * 
     * @private
     * @return {Function} �ؼ�ͷ������¼����
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
     * ��ȡ�ؼ����������¼����
     * 
     * @private
     * @return {Function} �ؼ�ͷ������¼����
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
     * ��ȡ�ؼ������html
     * 
     * @private
     * @return {String} �ؼ������html
     */
    getTitleHtml: function () {
        return '{0}��{1}��'.format(this.viewDate.getFullYear(), (this.viewDate.getMonth() + 1));
    },
    
    /**
     * ��ȡ�ؼ������html
     * 
     * @private
     * @return {String} �ؼ������html
     */
    getBodyHtml: function () {
        var theadHtml = this.getTHeadHtml();
        var tbodyHtml = this.getTBodyHtml();
        var tableTpl = '<table cellpadding="0" cellspacing="0" border="0"><thead>{0}</thead><tbody>{1}</tbody></table>';
        return tableTpl.format(theadHtml, tbodyHtml);
    },
    
    /**
     * ��ȡ�ؼ���ͷ�ܵ�html
     * 
     * @private
     * @return {String} �ؼ���ͷ�ܵ�html
     */
    getTHeadHtml: function () {
        var weekMap = ['��', 'һ', '��', '��', '��', '��', '��'];
        var headHtml = ['<tr>'];
        var headItemTpl = '<td sign="week">{0}</td>';
        for (var i = 0; i < 7; i++) {
            headHtml.push(headItemTpl.format(weekMap[i]));
        }
        headHtml.push('</tr>');
        return headHtml.join('');
    },
    
    /**
     * ��ȡ�ؼ��������html
     * 
     * @private
     * @return {String} �ؼ��������html
     */
    getTBodyHtml: function () {
        //ģ�����
        var dateTemplate = '<td sign="date" style="{4}" class="{3}" y="{2}" m="{1}" d="{0}">{0}</td>';
        var todayClass = 'calendar-today';
        var thisMonthClass = 'calendar-thismonth';
        var otherMonthClass = 'calendar-othermonth';
        
        //���ڱ���
        var viewDate = this.viewDate;
        var year = viewDate.getFullYear();
        var month = viewDate.getMonth();
        var date = viewDate.getDate();
        
        //ǰһ���µ�����
        var prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        //ǰһ���µ�����
        var beforeMonthDays = Calendar.getDateCountByMonth(prevMonth);
        //���µ�����
        var days = Calendar.getDateCountByMonth(viewDate);
        //����html��ѭ����ʼ����
        var index = 0 - new Date(year, month, 1).getDay();
        
        //make html
        var currDate, currMonth, currYear, currClass, currStyle;
        if (this.dateStyle.constructor == String) {
            currStyle = this.dateStyle;
        }
        
        //�����ϸ��ºͱ��µ�����html
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
        
        //�����¸��µ�����html
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

