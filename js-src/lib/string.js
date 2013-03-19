/**
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
};