/**
 * Baidu UE JavaScript Library
 * 
 * class.js
 * @author UTer
 * @version $Revision: 1.5 $
 */


/**
 * 元类
 * @public
 * @param {object} props 类成员
 * @param {Class} superClass 父类
 * @return {Class} 创建的类
 */
function Class(props, superClass) {
	var con = props.constructor == Object ? undefined : props.constructor;
	if (superClass) {
		var superConstructor = function () {
		    superClass.call(this);
		};
	}
	var clazz = con || superConstructor || new Function();
	var s_ = new Function();
	if (superClass) {
		s_.prototype = superClass.prototype;
		clazz.prototype = new s_();
	}
	for (var k in props) {
		clazz.prototype[k] = props[k];
	}
	clazz.constructor = clazz;
	return clazz;
}