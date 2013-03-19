/**
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
