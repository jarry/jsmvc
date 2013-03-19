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
 * //如果这些方法不放在com中，也可以放入action中
 * 根据单选框name列表获得selected的单选框的value
 * @param {box} 单选框列表
 * @return {element} 选中的单选框
 */
var getRadioboxChecked = function(box) {
	var i;
	for (i = 0; i < box.length; i++) {
		if (box[i].checked) {
			return box[i];
		}
	}
	return null;
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
}/*
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
}/*
 * @file com.js
 * @author jarryli@gmail.com
 * @desc 本项目中用到的静态公共函数库，有产品的特性
 *       <li>所有方法都是表达式静态函数(对象)</li>
 *       <li>与具体业务逻辑无关，但有项目的特性，如验证规则、字符串处理方式、编码处理等</li>
 *       <li>避免重复以及处理规则不一致</li>
 *
 */


/**
 * 公共的一些报错提示文字
 */
var ERROR_REG_TEXT = {
	name : {
		'exist' : '对不起，用户名已经存在',
		'null'  : '请输入用户名',
		'specialChar'  : '姓名仅限于英文、数字和中文，不能使用特殊字符',
		'length' : '姓名最断不小于4字节，最长不超过20个字节(1个汉字相当于2个字节'			
	},
	gender : {
		'null' : '请选择性别'
	},
	birthday : {
		'null'  : '请选择出生日期',
		'format'  : '生日格式不正确或该日期不存在。正确格式: 1999-01-01'
	},
	password : {
		'null'  : '请输入密码',
		'length'  : '密码长度不能少于6字节'
	},
	rePassword : {
		'null'  : '请输入确认密码',
		'notEqual'  : '确认密码与密码不一致'
	}
};
var ERROR_NET_TEXT = {
	ajax : {
		'loading' : '请求中...',
		'noconnect' : '请求失败，请检查网络连接是否正确！',
		'unknow'    : '未知错误',
		'delay'    : '请求延迟',
		'nofile'   : '文件不存在',
		'dataError'         : '返回数据异常'
	}			
};