/*
 * @file com.js
 * @author jarryli@gmail.com
 * @desc 本项目中用到的静态公共函数库，有产品的特性
 *       <li>所有方法都是表达式静态函数(对象)</li>
 *       <li>与具体业务逻辑无关，但有项目的特性，如验证规则、字符串处理方式、编码处理等</li>
 *       <li>避免重复以及处理规则不一致</li>
 *
 */


/**
 * 判断是否含有为注册时候禁止的特殊字符
 * 有效注册限于: 英文字母、数字、中文
 * @param {string} name 来源字符串
 * @return {boolean} 是否含有非法字符
 */
var hasSpecialChar = function(name) {
	var reg;
	if (trim(name) != '')
		reg = /^(\w|[\u4E00-\u9FA5])*$/;
	return (!name.match(reg)) ? true : false;
}


/**
 * 根据当前DOM往上追溯最近的一个SPAN子节点，返回该节点
 * 如果兄弟节点没有就往父节点寻找，知道document
 * @param {DOM object} obj dom对象
 * @return {DOM object} 往前或往上最近的一个SPAN，如没有则返回null
 */
var getPreviousSpanNode = function(obj) {
	if (!obj || 'object' != typeof obj)
		return obj;

	if(obj.tagName && obj.tagName == 'SPAN') {
		return obj;
	} else if (obj.previousSibling) {
		return getPreviousSpanNode(obj.previousSibling);
	} else if (obj.parentNode) {
		return getPreviousSpanNode(obj.parentNode.previousSibling);
	}
	return obj;
}

/**
 * 获取目标字符串的字节长度
 * 
 * @param {string} source 目标字符串
 * @return {number} 字节长度
 */
var countByteLength = function (source) {
	var i = 0;
	var l = source.length;
	var length = 0;
	while (i < l) {
		if (source.charCodeAt(i) > 0 && source.charCodeAt(i) < 128) {
			length += 1;
		} else {
			length += 2;
		}
		i++;
	}
	return length;
}