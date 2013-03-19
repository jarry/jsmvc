/*
 * @file reg.action.js 
 * @author jarryli@gmail.com
 * @desc ע�Ṧ�ܵ�action��̬��
 *       <li>����ĳ��ҳ����ܣ����ܸ��ã���Ϊҳ���ͳһ���</li>
 *       <li>��Ҫ�����ǽ�����������ݡ����¼�����ʵ����reg.class�������ݷ��͸�reg.class����</li>
 *       <li>�õ����ؽ����������ҳ��</li>
 *       <li>һ��Ϊ���ù���ģʽ�ľ�̬��</li>
 *
 */

var RegAction = RegAction || {};
var RegAction = (function() {
	// ��Ӧ��regClass��
	var regClass;
	var regForm;

	/**
	 * ��ʼ��reg.classҵ����ķ�������ʱ����Ҫ��ʼ��һ��
	 * @private
	 */
	var initRegClass = function() {
		// ʵ�������󣬲��Ҹ��������Ը�ֵ
		regClass                 = new RegClass();
		regClass.errorName       = G('errorName');
		regClass.errorPassword   = G('errorPassword');
		regClass.errorRePassword = G('errorRePassword');
	}

	/**
	 * form���ύ�ӹ�
	 * @public
	 */
	var submit = function(obj) {
		if (obj == null || 'object' != typeof obj) {
    		return false;
		} 		
		// �ֱ��ʵ��������Ҫ�Ĳ���
		regClass.name       = obj.name.value;
		regClass.password   = obj.password.value;
		regClass.rePassword = obj.rePassword.value;

		// ����reg.class�ύ�Ľ�����ظ�ҳ��
		return regClass.submit();
	};

	/**
	 * ÿ��Action���и��¼���������ͨ���ÿ�������ע��ͷַ��¼���
	 * @private
	 */ 
	var eventsControlloer = function(event, obj) {	
		regForm.onsubmit = function() {
			return submit(this);
		}
	};

	/**
	 * ��ʼ��Action
	 * @public
	 */
	var init = function() {
		// ��ִ��class��ʼ��
		if (!regClass) {
			initRegClass();
		}
		// ��ʼ���ڲ�����
		 regForm = document.regForm;
		// ��ʼ��ͳһ�¼�������
		eventsControlloer();

	};
	
	// ���ⲿ���õķ���
	return {
		init : init,
		submit : submit
	}
	
})();