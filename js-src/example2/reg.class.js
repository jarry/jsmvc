/*
 * @file reg.class.js 
 * @author jarryli@gmail.com
 * @desc ע�Ṧ�ܵ�sevice��
 *       <li>����Ϊ���ע��action���ã��ﵽ����</li>
 *       <li>Ҳ���Ա�����reg class�̳У�ͨ����̬���ĺ͸��ø��෽��</li>
 *       <li>��action�ֿ��ĸ���Ҫԭ���ǣ�����д���������׶�</li>
 *       <li>һ���ǿɶ�̬�ĺ���(����)ԭ����</li>
 */

function RegClass() {

	// this.regForm    = this.regForm || null;
	// ���еĳ�Ա���ݣ�������֤
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
    // ������ɺϷ�ʱ����һ���������(��ѡ)
	this.onCheckoutDone = this.onCheckoutDone || null;
	this.regCheckUrl     = this.regCheckUrl || null;
}

/**
 * ��չԭ�ͷ������Ա�̳к͸���
 */
RegClass.prototype = {

    /**
	 * ��֤�û����Ƿ���ȷ
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
	 * ��֤�Ա��Ƿ���ȷ
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
	 * ��֤�����Ƿ���ȷ
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
	 * ��֤�����Ƿ���ȷ
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
	 * ��֤ȷ�������Ƿ���ȷ
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
	 * ����Ƿ������ͬ�û����Ļص����Ժ���
	 * @param {object} ajax ajax����
	 * @param {object} regClass ajaxִ�����Ļص�����
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
	 * ��֤�û����Ƿ��Ѿ����ڣ���һ��Ajax�Ĳ���
	 * @param {function} callBackFun ajaxִ�����Ļص�����
	 */
	checkUserName : function(callBackFun) {
		var callBack = ('function' == typeof callBackFun) ? callBackFun : this.checkUserNameCallback;
		if (this.isAvailName()) {
			var superClass = this;
			var ajax = new Ajax(
				function() {
					// ��ajax�����Լ�class������Ϊ�������ݸ��ص�����
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
	 * �ύ����
	 */
	submit : function() {     
		// ����������ʾ
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

		// ������ɺϷ�ʱ����һ�����������������չ
		if (validate && 'function' == typeof this.onCheckoutDone) {
			return this.onCheckoutDone.call(this);			 
		}

        return validate;
	},

    /**
	 * �׳�������ʾ��Ϣ��ҳ��
	 */
	throwError : function(obj, info) {
		if ('object' == typeof obj)
			obj.innerHTML = info;
	}
}