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

	/**
	 * 初始化reg.class业务类的方法，有时仅需要初始化一次
	 * @private
	 */
	var initRegClass = function() {
		// 实例化对象，并且给公共属性赋值
		regClass                 = new RegClass();
		regClass.errorName       = G('errorName');
		regClass.errorPassword   = G('errorPassword');
		regClass.errorRePassword = G('errorRePassword');
	}

	/**
	 * form表单提交接管
	 * @public
	 */
	var submit = function(obj) {
		if (obj == null || 'object' != typeof obj) {
    		return false;
		} 		
		// 分别给实例传递需要的参数
		regClass.name       = obj.name.value;
		regClass.password   = obj.password.value;
		regClass.rePassword = obj.rePassword.value;

		// 根据reg.class提交的结果返回给页面
		return regClass.submit();
	};

	/**
	 * 每个Action都有个事件控制器，通过该控制器来注册和分发事件。
	 * @private
	 */ 
	var eventsControlloer = function(event, obj) {	
		regForm.onsubmit = function() {
			return submit(this);
		}
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
		// 初始化内部属性
		 regForm = document.regForm;
		// 初始化统一事件控制器
		eventsControlloer();

	};
	
	// 供外部调用的方法
	return {
		init : init,
		submit : submit
	}
	
})();