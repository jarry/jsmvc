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
}/*
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
}/*
 * @file com.js
 * @author jarryli@gmail.com
 * @desc ����Ŀ���õ��ľ�̬���������⣬�в�Ʒ������
 *       <li>���з������Ǳ��ʽ��̬����(����)</li>
 *       <li>�����ҵ���߼��޹أ�������Ŀ�����ԣ�����֤�����ַ�������ʽ�����봦���</li>
 *       <li>�����ظ��Լ��������һ��</li>
 *
 */


/**
 * ������һЩ������ʾ����
 */
var ERROR_REG_TEXT = {
	name : {
		'exist' : '�Բ����û����Ѿ�����',
		'null'  : '�������û���',
		'specialChar'  : '����������Ӣ�ġ����ֺ����ģ�����ʹ�������ַ�',
		'length' : '������ϲ�С��4�ֽڣ��������20���ֽ�(1�������൱��2���ֽ�'			
	},
	gender : {
		'null' : '��ѡ���Ա�'
	},
	birthday : {
		'null'  : '��ѡ���������',
		'format'  : '���ո�ʽ����ȷ������ڲ����ڡ���ȷ��ʽ: 1999-01-01'
	},
	password : {
		'null'  : '����������',
		'length'  : '���볤�Ȳ�������6�ֽ�'
	},
	rePassword : {
		'null'  : '������ȷ������',
		'notEqual'  : 'ȷ�����������벻һ��'
	}
};
var ERROR_NET_TEXT = {
	ajax : {
		'loading' : '������...',
		'noconnect' : '����ʧ�ܣ��������������Ƿ���ȷ��',
		'unknow'    : 'δ֪����',
		'delay'    : '�����ӳ�',
		'nofile'   : '�ļ�������',
		'dataError'         : '���������쳣'
	}			
};