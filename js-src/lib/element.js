/**
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
