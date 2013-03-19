/**
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
};