/**
 * Baidu UE JavaScript Library
 * 
 * class.js
 * @author UTer
 * @version $Revision: 1.5 $
 */


/**
 * Ԫ��
 * @public
 * @param {object} props ���Ա
 * @param {Class} superClass ����
 * @return {Class} ��������
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