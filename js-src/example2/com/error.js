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