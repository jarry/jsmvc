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

	// ���еĳ�Ա���ݣ�������֤
	this.name       = this.name || null;
	this.password   = this.password || null;
	this.rePassword = this.rePassword || null;
	// ע��������
	this.errorName       = this.errorName || null;
	this.errorPassword   = this.errorPassword || null;
	this.errorRePassword = this.errorRePassword || null;
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
			this.throwError(this.errorName, '����������');
			validate = false;
		} else if (hasSpecialChar(this.name)) {
			this.throwError(this.errorName, '����������Ӣ�ġ����ֺ����ģ�����ʹ�������ַ�');
			validate = false;
		} else if (countByteLength(this.name) > 20 || countByteLength(this.name) < 4) {
			this.throwError(this.errorName, '������ϲ�С��4�ֽڣ��������20���ֽ�(1�������൱��2���ֽ�)');
			validate = false;
		} else {
			this.throwError(this.errorName, '');
		}
		return validate;
	},

    /**
	 * ��֤�����Ƿ���ȷ
	 * @return {boolean} 
	 */
	isAvailPassword : function() {
		if (trim(this.password) == '') {
			this.throwError(this.errorPassword, '����������');
			return false;
		} else if (countByteLength(this.password) < 6) {
			this.throwError(this.errorPassword, '���볤�Ȳ�������6�ֽ�');
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
			this.throwError(this.errorRePassword, '������ȷ������');
			return false;
		} else if(trim(this.rePassword) != trim(this.password)) {
			this.throwError(this.errorRePassword, 'ȷ�����������벻һ��');
			return false;
		} else {
			this.throwError(this.errorRePassword, '');
		}
		return true;
	},

    /**
	 * �ύ����
	 */
	submit : function() {  
        // ��������ʾ
		if (this.isAvailName() && this.isAvailPassword()
			                     && this.isAvailRePassword()
		                         ) {
	        // ����֤ȫ��ͨ��ʱ����true
			return true;
		}
		return false;	
 
	},

    /**
	 * �׳�������ʾ��Ϣ��ҳ��
	 */
	throwError : function(obj, info) {
		if ('object' == typeof obj)
			obj.innerHTML = info;
	}
}