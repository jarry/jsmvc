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
