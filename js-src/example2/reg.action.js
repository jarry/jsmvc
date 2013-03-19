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
	var checkUserNameBtn;
	var ALLOW_HIDE_CALENDAR = 0;
	// ������ʾ��ص�DOM����
    var calendarWrap;
	var calenderSelector;
	// �����Ƿ��Ѿ���ʾ(1�ǣ�0��)
	var CALENDAR_VISIBLE = 0;
	// �Ƿ�����ر�����(1����0��ֹ)

	/**
	 * ��ʼ��reg.classҵ����ķ�������ʱ����Ҫ��ʼ��һ��
	 * @private
	 */
	var initRegClass = function() {
		// ʵ�������󣬲��Ҹ��������Ը�ֵ
		regClass                 = new RegClass();
		regClass.errorName       = G('errorName');
		regClass.errorGender     = G('errorGender');
		regClass.errorBirthday   = G('errorBirthday');
		regClass.errorPassword   = G('errorPassword');
		regClass.errorRePassword = G('errorRePassword');
		regClass.regCheckUrl     = 'reg.php';
	}

	/**
	 * form���ύ�ӹ�
	 */
	var submit = function(obj) {
		if (obj == null || 'object' != typeof obj) {
    		return false;
		} 
		
		// �ֱ��ʵ��������Ҫ�Ĳ���
		regClass.name       = obj.name.value;
		var genderChecked   = getRadioboxChecked(obj.gender);
		regClass.gender     = genderChecked ? genderChecked.value : null;
		regClass.birthday   = obj.birthday.value;
		regClass.password   = obj.password.value;
		regClass.rePassword = obj.rePassword.value;

        
        // ���onCheckoutDone�������ԣ��������Ҫ�Ͳ�����
		regClass.onCheckoutDone = function() {
			var s = ['��������������£�\r\n--------------------------'];
			s.push(getPreviousSpanNode(obj.name).innerHTML + ' = ' + obj.name.value);
			s.push(getPreviousSpanNode(obj.gender[0]).innerHTML + ' = ' + genderChecked.nextSibling.nodeValue);
			s.push(getPreviousSpanNode(obj.birthday).innerHTML + ' = ' + obj.birthday.value);
			s.push(getPreviousSpanNode(obj.password).innerHTML + ' = ' + obj.password.value);
			s.push(getPreviousSpanNode(obj.rePassword).innerHTML + ' = ' + obj.rePassword.value);
			s.push('--------------------------\r\nȷ���ύ��');
			if (confirm(s.join('\r\n'))) {
				return true;
			} else {
				return false;
			}
		}

		// ����reg.class�ύ�Ľ�����ظ�ҳ��
		return regClass.submit();
	};

    /**
	 * ���������ؼ�
	 * @private
	 */
	var setCalenderToWrap = function() {
		var myCalendar = new Calendar({
			onselect: function (date) {
				var dateText = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
				// ����RegAction������¼�������ע��ҳ��
				setBirthdayInput(dateText);
				hideCalender();
			},
			dateStyle: function (date) {
				if(date.getDay() == 0 || date.getDay() == 6) return "background:#eee";
			}
		});
		myCalendar.appendTo(calendarWrap);	
	};

	/**
	 * ��ҳ��Ԫ�ص��õ���ʾ��������
	 */
	var showCalender = function() {
		calendarWrap.style.display = 'block';
		if (calendarWrap.innerHTML == '') {
			setCalenderToWrap();
		}
		CALENDAR_VISIBLE = 1;
	};

	/**
	 * ��ҳ��Ԫ�ص��õ�������������
	 */
	var hideCalender = function() {
		calendarWrap.style.display = 'none';
		CALENDAR_VISIBLE = 0;
	};

	/**
	 * ������õ��������տ��ֵ
	 */
	var setBirthdayInput = function(value) {
		regForm.birthday.value = value;
	}

	/**
	 * ÿ��Action���и��¼���������ͨ���ÿ��������ַ�ע���¼���
	 * [Ҳ��������Ϊһ��ͳһ�Ŀ���ת������]
	 * @private
	 */ 
	var eventsControlloer = function(event, events) {
		
		/**
		 * @param {number} value �������ػ�����ʾ��ֵ��1��ʾ��0����
		 * @param {mouse event} events ����¼����󶨲������Ҵ�ֵ
		 */	
		var setAllowHideCalender = function(value, events) {
			ALLOW_HIDE_CALENDAR = value;
		};
		/**
		 * ���ػ�����ʾ���������������Ƿ��Ѿ���ʾ
		 */	
		var showOrHideCalender = function() {
			if (CALENDAR_VISIBLE != 1) {
				showCalender();
			} else {
				hideCalender();
			}
		};
		/**
		 * ����û����Ƿ��Ѿ�����
		 */	
		var checkUserName = function() {
			regClass.name = regForm.name.value;
			regClass.checkUserName();
		};
		/**
		 * ������Ϊ��ʾ״̬��������
		 */	
		var hideCalenderOnVisible = function() {
			if (ALLOW_HIDE_CALENDAR != 1)
				hideCalender();	
		};
		// �¼�ͳһ�������Ƴ�����
		baidu.on(regForm.birthday, 'mouseover', setAllowHideCalender, 1);
		baidu.on(regForm.birthday, 'mouseout', setAllowHideCalender, 0);
		baidu.on(calendarWrap, 'mouseover', setAllowHideCalender, 1);
		baidu.on(calendarWrap, 'mouseout', setAllowHideCalender, 0);
		baidu.on(calenderSelector, 'mouseover', setAllowHideCalender, 1);
		baidu.on(calenderSelector, 'mouseout', setAllowHideCalender, 0);
		baidu.on(regForm.birthday, 'click', showOrHideCalender);
		baidu.on(checkUserNameBtn, 'click', checkUserName);
		baidu.on(calenderSelector, 'click', showOrHideCalender);
		baidu.on(document.body, 'click', hideCalenderOnVisible);
		regForm.onsubmit = function() {
			// �ύ����̨����ҳ�棬ҳ�漴ʱ��ת�������ձ鳡��
			return submit(this);
			/**
			 * <dl>
			 * <dt>���ʹ��ajax��ȡ��̨��֤�ķ�ʽ��</dt>
			 * <dd>��Ҫ����postȫ�����ݵ���̨��ajax����</dd>
			 * <dd>���ݷ���������д���
			 *   <li>�����鲻ͨ�����׳���Ӧ�����ҳ��</li>
			 *   <li>������ͨ������js������ҳ���Ƿ���ת</li>
			 * </dd>
			 * <dd>������form sbumit�¼���ʼ����false</dd>
			 * <dd>���õ�����ʽ�ĵ�¼ע��ҳ�棬�ɹ���ͨ��js�رտ����ˢ����תҳ��</dd>
			 * </dl>
			 */
			// return false;
		};
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
		// ��ʼ���ڲ���������
		 regForm          = document.regForm;
		 calendarWrap     = G('calendarWrap');
		 calenderSelector = G('calenderSelector');
		 checkUserNameBtn = G('checkUserName');
		// ��ʼ��ͳһ�¼�������
		eventsControlloer();

	};
	
	// ���ⲿ���õķ���
	return {
		init : init,
		submit : submit
	}
	
})();