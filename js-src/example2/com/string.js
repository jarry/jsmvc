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
