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
	if (trim(name) != '') {
//		reg = /^(\w|[\u4E00-\u9FA5])*$/;
		reg = /^[0-9A-Z_a-z\u0391-\uFFE5]*$/;
	}
	return (!name.match(reg)) ? true : false;
}

/**
 * 校验日期格式是否有效
 * 
 * @param {number} year 年yyyy
 * @param {number} month 年mm
 * @param {number} day 年dd
 * @return {boolean} true不合格，false合格
 */
function isAvailableDate(year, month, day) {
	if (isNaN(year) || isNaN(month) || isNaN(day)) {
		return false;
	} 
	if (year > 9999 || year < 1
		|| month > 12 || month < 0
		|| day > 31 || day < 0
		) {
		return false;
	}
	if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) {
		
		return false;
	} else if (month == 2) {

		if (year % 4 > 0 && day > 28) {
			return false;
		} else if (day > 29) {
			return false;
		}
	}
	return true;
}