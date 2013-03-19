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
baidu.un = baidu.event.un;