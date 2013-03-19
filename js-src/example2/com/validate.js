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
	if (trim(name) != '') {
//		reg = /^(\w|[\u4E00-\u9FA5])*$/;
		reg = /^[0-9A-Z_a-z\u0391-\uFFE5]*$/;
	}
	return (!name.match(reg)) ? true : false;
}

/**
 * У�����ڸ�ʽ�Ƿ���Ч
 * 
 * @param {number} year ��yyyy
 * @param {number} month ��mm
 * @param {number} day ��dd
 * @return {boolean} true���ϸ�false�ϸ�
 */
function isAvailableDate(year, month, day) {
	if (isNaN(year) || isNaN(month) || isNaN(day)) {
		return false;
	} 
	if (year > 9999 || year < 1
		|| month > 12 || month < 0
		|| day > 31 || day < 0
		) {
		return false;
	}
	if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) {
		
		return false;
	} else if (month == 2) {

		if (year % 4 > 0 && day > 28) {
			return false;
		} else if (day > 29) {
			return false;
		}
	}
	return true;
}