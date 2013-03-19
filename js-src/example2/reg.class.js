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

	// this.regForm    = this.regForm || null;
	// 公有的成员数据，用于验证
	this.name       = this.name || null;
	this.gender     = this.gender || null;
	this.birthday   = this.birthday || null;
	this.password   = this.password || null;
	this.rePassword = this.rePassword || null;

	this.errorName       = this.errorName || null;
	this.errorBirthday   = this.errorBirthday || null; 
	this.errorGender     = this.errorGender || null;
	this.errorPassword   = this.errorPassword || null;
	this.errorRePassword = this.errorRePassword || null;
    // 检验完成合法时增加一个外调函数(可选)
	this.onCheckoutDone = this.onCheckoutDone || null;
	this.regCheckUrl     = this.regCheckUrl || null;
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
			this.throwError(this.errorName, ERROR_REG_TEXT.name['null']);
			validate = false;
		} else if (hasSpecialChar(this.name)) {
			this.throwError(this.errorName, ERROR_REG_TEXT.name['specialChar']);
			validate = false;
		} else if (countByteLength(this.name) > 20 || countByteLength(this.name) < 4) {
			this.throwError(this.errorName, ERROR_REG_TEXT.name['length']);
			validate = false;
		} else {
			this.throwError(this.errorName, '');
		}
		return validate;
	},

    /**
	 * 验证性别是否正确
	 * @return {boolean} 
	 */
	isAvailGender : function() {
		var validate = true;
		if(this.gender == null || this.gender == 0) {
			this.throwError(this.errorGender, ERROR_REG_TEXT.gender['null']);
			return false;
		} else {
			this.throwError(this.errorGender, '');
		}
		return true;
	},

    /**
	 * 验证生日是否正确
	 * @return {boolean} 
	 */
	isAvailBirthday : function() {
		var date  = this.birthday.split('-');
		var year  = date[0];
		var month = date[1];
		var day   = date[2];

		if (trim(this.birthday) == '') {
			this.throwError(this.errorBirthday, ERROR_REG_TEXT.birthday['null']);
			return false;
		} else if (date.length != 3 || !isAvailableDate(year, month, day)) {
			this.throwError(this.errorBirthday, ERROR_REG_TEXT.birthday['format']);
			return false;
		} else {
			this.throwError(this.errorBirthday, '');
		}
		return true;
	},

    /**
	 * 验证密码是否正确
	 * @return {boolean} 
	 */
	isAvailPassword : function() {
		if (trim(this.password) == '') {
			this.throwError(this.errorPassword, ERROR_REG_TEXT.password['null']);
			return false;
		} else if (countByteLength(this.password) < 6) {
			this.throwError(this.errorPassword, ERROR_REG_TEXT.password['length']);
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
			this.throwError(this.errorRePassword, ERROR_REG_TEXT.rePassword['null']);
			return false;
		} else if(trim(this.rePassword) != trim(this.password)) {
			this.throwError(this.errorRePassword, ERROR_REG_TEXT.rePassword['notEqual']);
			return false;
		} else {
			this.throwError(this.errorRePassword, '');
		}
		return true;
	},

    /**
	 * 检查是否存在相同用户名的回调测试函数
	 * @param {object} ajax ajax对象
	 * @param {object} regClass ajax执行完后的回调函数
	 */
	checkUserNameCallback : function(ajax, superClass) {
		var responseText = ajax.xhr.responseText;
		if (responseText && responseText.length > 0) {
			try {
		    	var json = eval('(' + responseText + ')');
		    	superClass.throwError(superClass.errorName, json.data.notice);
			} catch (ex) {
				alert(ERROR_NET_TEXT.ajax['dataError']);
			}
		}
	},

    /**
	 * 验证用户名是否已经存在，做一个Ajax的测试
	 * @param {function} callBackFun ajax执行完后的回调函数
	 */
	checkUserName : function(callBackFun) {
		var callBack = ('function' == typeof callBackFun) ? callBackFun : this.checkUserNameCallback;
		if (this.isAvailName()) {
			var superClass = this;
			var ajax = new Ajax(
				function() {
					// 把ajax对象以及class对象作为参数传递给回调函数
					callBack(this, superClass);
				}, 

				function() {
					//alert('XMLHttpRequest Error : \r\n' + this.xhr.responseText);
					alert(ERROR_NET_TEXT.ajax['noconnect']);
				}
			);
			var url = superClass.regCheckUrl;
			var param = 'action=checkName&name=' + this.name;
			ajax.get(url, param);
			this.throwError(this.errorName, ERROR_NET_TEXT.ajax['loading']);
			
			ajax = null;
		}
	},


    /**
	 * 提交方法
	 */
	submit : function() {     
		// 批量报错提示
		var validate = true;
		if (!this.isAvailName()) {
			validate = false;
		}
		if (!this.isAvailGender()) {
			validate = false;
		}
		if (!this.isAvailBirthday()) {
			validate = false;
		}
		if (!this.isAvailPassword()) {
			validate = false;
		}
		if (!this.isAvailRePassword()) {
			validate = false;
		}

		// 检验完成合法时增加一个外调函数，便于扩展
		if (validate && 'function' == typeof this.onCheckoutDone) {
			return this.onCheckoutDone.call(this);			 
		}

        return validate;
	},

    /**
	 * 抛出错误提示信息给页面
	 */
	throwError : function(obj, info) {
		if ('object' == typeof obj)
			obj.innerHTML = info;
	}
}