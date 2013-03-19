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



