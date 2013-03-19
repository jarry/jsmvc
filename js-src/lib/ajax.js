/**
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
};