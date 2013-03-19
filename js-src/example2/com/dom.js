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
 * //�����Щ����������com�У�Ҳ���Է���action��
 * ���ݵ�ѡ��name�б���selected�ĵ�ѡ���value
 * @param {box} ��ѡ���б�
 * @return {element} ѡ�еĵ�ѡ��
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