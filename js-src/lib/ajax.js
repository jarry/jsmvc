/**
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
};