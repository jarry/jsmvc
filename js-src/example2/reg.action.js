/*
 * @file reg.action.js 
 * @author jarryli@gmail.com
 * @desc 注册功能的action静态类
 *       <li>属于某个页面或功能，不能复用，作为页面的统一入口</li>
 *       <li>主要作用是接受输入的数据、绑定事件，并实例化reg.class，把数据发送给reg.class处理</li>
 *       <li>得到返回结果，反馈给页面</li>
 *       <li>一律为采用工厂模式的静态类</li>
 *
 */

var RegAction = RegAction || {};
var RegAction = (function() {
	// 对应的regClass类
	var regClass;

	var regForm;
	var checkUserNameBtn;
	var ALLOW_HIDE_CALENDAR = 0;
	// 日历显示相关的DOM对象
    var calendarWrap;
	var calenderSelector;
	// 日历是否已经显示(1是，0否)
	var CALENDAR_VISIBLE = 0;
	// 是否允许关闭日历(1允许，0禁止)

	/**
	 * 初始化reg.class业务类的方法，有时仅需要初始化一次
	 * @private
	 */
	var initRegClass = function() {
		// 实例化对象，并且给公共属性赋值
		regClass                 = new RegClass();
		regClass.errorName       = G('errorName');
		regClass.errorGender     = G('errorGender');
		regClass.errorBirthday   = G('errorBirthday');
		regClass.errorPassword   = G('errorPassword');
		regClass.errorRePassword = G('errorRePassword');
		regClass.regCheckUrl     = 'reg.php';
	}

	/**
	 * form表单提交接管
	 */
	var submit = function(obj) {
		if (obj == null || 'object' != typeof obj) {
    		return false;
		} 
		
		// 分别给实例传递需要的参数
		regClass.name       = obj.name.value;
		var genderChecked   = getRadioboxChecked(obj.gender);
		regClass.gender     = genderChecked ? genderChecked.value : null;
		regClass.birthday   = obj.birthday.value;
		regClass.password   = obj.password.value;
		regClass.rePassword = obj.rePassword.value;

        
        // 外调onCheckoutDone方法测试，如果不需要就不增加
		regClass.onCheckoutDone = function() {
			var s = ['你输入的内容如下：\r\n--------------------------'];
			s.push(getPreviousSpanNode(obj.name).innerHTML + ' = ' + obj.name.value);
			s.push(getPreviousSpanNode(obj.gender[0]).innerHTML + ' = ' + genderChecked.nextSibling.nodeValue);
			s.push(getPreviousSpanNode(obj.birthday).innerHTML + ' = ' + obj.birthday.value);
			s.push(getPreviousSpanNode(obj.password).innerHTML + ' = ' + obj.password.value);
			s.push(getPreviousSpanNode(obj.rePassword).innerHTML + ' = ' + obj.rePassword.value);
			s.push('--------------------------\r\n确定提交吗？');
			if (confirm(s.join('\r\n'))) {
				return true;
			} else {
				return false;
			}
		}

		// 根据reg.class提交的结果返回给页面
		return regClass.submit();
	};

    /**
	 * 设置日历控件
	 * @private
	 */
	var setCalenderToWrap = function() {
		var myCalendar = new Calendar({
			onselect: function (date) {
				var dateText = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
				// 调用RegAction的相关事件，操作注册页面
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
	 * 供页面元素调用的显示日历方法
	 */
	var showCalender = function() {
		calendarWrap.style.display = 'block';
		if (calendarWrap.innerHTML == '') {
			setCalenderToWrap();
		}
		CALENDAR_VISIBLE = 1;
	};

	/**
	 * 供页面元素调用的隐藏日历方法
	 */
	var hideCalender = function() {
		calendarWrap.style.display = 'none';
		CALENDAR_VISIBLE = 0;
	};

	/**
	 * 供外调用的设置生日框的值
	 */
	var setBirthdayInput = function(value) {
		regForm.birthday.value = value;
	}

	/**
	 * 每个Action都有个事件控制器，通过该控制器来分发注销事件。
	 * [也可以整合为一个统一的控制转发中心]
	 * @private
	 */ 
	var eventsControlloer = function(event, events) {
		
		/**
		 * @param {number} value 日历隐藏还是显示的值。1显示，0隐藏
		 * @param {mouse event} events 鼠标事件，绑定参数并且传值
		 */	
		var setAllowHideCalender = function(value, events) {
			ALLOW_HIDE_CALENDAR = value;
		};
		/**
		 * 隐藏或者显示日历，根据日历是否已经显示
		 */	
		var showOrHideCalender = function() {
			if (CALENDAR_VISIBLE != 1) {
				showCalender();
			} else {
				hideCalender();
			}
		};
		/**
		 * 检查用户名是否已经存在
		 */	
		var checkUserName = function() {
			regClass.name = regForm.name.value;
			regClass.checkUserName();
		};
		/**
		 * 当日历为显示状态则隐藏它
		 */	
		var hideCalenderOnVisible = function() {
			if (ALLOW_HIDE_CALENDAR != 1)
				hideCalender();	
		};
		// 事件统一挂载与移除处理
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
			// 提交给后台处理页面，页面即时跳转，适用普遍场景
			return submit(this);
			/**
			 * <dl>
			 * <dt>如果使用ajax获取后台验证的方式则：</dt>
			 * <dd>需要增加post全部数据到后台的ajax请求</dd>
			 * <dd>根据反馈结果进行处理
			 *   <li>如果检查不通过则抛出相应错误给页面</li>
			 *   <li>如果检查通过则用js来控制页面是否跳转</li>
			 * </dd>
			 * <dd>反馈给form sbumit事件的始终是false</dd>
			 * <dd>适用弹出框式的登录注册页面，成功后通过js关闭框而不刷新跳转页面</dd>
			 * </dl>
			 */
			// return false;
		};
	};

	/**
	 * 初始化Action
	 * @public
	 */
	var init = function() {
		// 先执行class初始化
		if (!regClass) {
			initRegClass();
		}
		// 初始化内部各种属性
		 regForm          = document.regForm;
		 calendarWrap     = G('calendarWrap');
		 calenderSelector = G('calenderSelector');
		 checkUserNameBtn = G('checkUserName');
		// 初始化统一事件控制器
		eventsControlloer();

	};
	
	// 供外部调用的方法
	return {
		init : init,
		submit : submit
	}
	
})();