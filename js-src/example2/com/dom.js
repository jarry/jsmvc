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
}