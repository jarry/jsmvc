/*
 * @file reg.class.js 
 * @author jarryli@gmail.com
 * @desc 注册功能的sevice类
 *       <li>可以为多个注册action调用，达到复用</li>
 *       <li>也可以被其他reg class继承，通过多态更改和复用父类方法</li>
 *       <li>与action分开的更重要原因是，这样写代码更清楚易懂</li>
 *       <li>一律是可动态的函数(对象)原型类</li>
 */

function RegClass() {

	// 公有的成员数据，用于验证
	this.name       = this.name || null;
	this.password   = this.password || null;
	this.rePassword = this.rePassword || null;
	// 注册错误对象
	this.errorName       = this.errorName || null;
	this.errorPassword   = this.errorPassword || null;
	this.errorRePassword = this.errorRePassword || null;
}

/**
 * 扩展原型方法，以便继承和覆盖
 */
RegClass.prototype = {

    /**
	 * 验证用户名是否正确
	 * @return {boolean} 
	 */
	isAvailName : function() {
		var validate = true;
		if(trim(this.name) == '') {
			this.throwError(this.errorName, '请输入姓名');
			validate = false;
		} else if (hasSpecialChar(this.name)) {
			this.throwError(this.errorName, '姓名仅限于英文、数字和中文，不能使用特殊字符');
			validate = false;
		} else if (countByteLength(this.name) > 20 || countByteLength(this.name) < 4) {
			this.throwError(this.errorName, '姓名最断不小于4字节，最长不超过20个字节(1个汉字相当于2个字节)');
			validate = false;
		} else {
			this.throwError(this.errorName, '');
		}
		return validate;
	},

    /**
	 * 验证密码是否正确
	 * @return {boolean} 
	 */
	isAvailPassword : function() {
		if (trim(this.password) == '') {
			this.throwError(this.errorPassword, '请输入密码');
			return false;
		} else if (countByteLength(this.password) < 6) {
			this.throwError(this.errorPassword, '密码长度不能少于6字节');
			return false;
		} else {
			this.throwError(this.errorPassword, '');
		}
		return true;
	},

    /**
	 * 验证确认密码是否正确
	 * @return {boolean} 
	 */
	isAvailRePassword : function() {
		if (trim(this.rePassword) == '') {
			this.throwError(this.errorRePassword, '请输入确认密码');
			return false;
		} else if(trim(this.rePassword) != trim(this.password)) {
			this.throwError(this.errorRePassword, '确认密码与密码不一致');
			return false;
		} else {
			this.throwError(this.errorRePassword, '');
		}
		return true;
	},

    /**
	 * 提交方法
	 */
	submit : function() {  
        // 逐项检查提示
		if (this.isAvailName() && this.isAvailPassword()
			                     && this.isAvailRePassword()
		                         ) {
	        // 当验证全部通过时返回true
			return true;
		}
		return false;	
 
	},

    /**
	 * 抛出错误提示信息给页面
	 */
	throwError : function(obj, info) {
		if ('object' == typeof obj)
			obj.innerHTML = info;
	}
}