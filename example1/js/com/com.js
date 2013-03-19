/*
 * @file com.js
 * @author jarryli@gmail.com
 * @desc ����Ŀ���õ��ľ�̬���������⣬�в�Ʒ������
 *       <li>���з������Ǳ��ʽ��̬����(����)</li>
 *       <li>�����ҵ���߼��޹أ�������Ŀ�����ԣ�����֤�����ַ�������ʽ�����봦���</li>
 *       <li>�����ظ��Լ��������һ��</li>
 *
 */


/**
 * �ж��Ƿ���Ϊע��ʱ���ֹ�������ַ�
 * ��Чע������: Ӣ����ĸ�����֡�����
 * @param {string} name ��Դ�ַ���
 * @return {boolean} �Ƿ��зǷ��ַ�
 */
var hasSpecialChar = function(name) {
	var reg;
	if (trim(name) != '')
		reg = /^(\w|[\u4E00-\u9FA5])*$/;
	return (!name.match(reg)) ? true : false;
}


/**
 * ���ݵ�ǰDOM����׷�������һ��SPAN�ӽڵ㣬���ظýڵ�
 * ����ֵܽڵ�û�о������ڵ�Ѱ�ң�֪��document
 * @param {DOM object} obj dom����
 * @return {DOM object} ��ǰ�����������һ��SPAN����û���򷵻�null
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

/**
 * ��ȡĿ���ַ������ֽڳ���
 * 
 * @param {string} source Ŀ���ַ���
 * @return {number} �ֽڳ���
 */
var countByteLength = function (source) {
	var i = 0;
	var l = source.length;
	var length = 0;
	while (i < l) {
		if (source.charCodeAt(i) > 0 && source.charCodeAt(i) < 128) {
			length += 1;
		} else {
			length += 2;
		}
		i++;
	}
	return length;
}