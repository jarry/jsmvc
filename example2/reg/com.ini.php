<?php
/*
 * �����������뾲̬����
 * @author lichunping jarryli@gmail.com
 */
class ERROR_TEXT
{
	public static $REG = array(
		'name' => array (
			'exist' => '�Բ����û����Ѿ�����',
			'null'  => '�������û���',
			'specialChar'  => '����������Ӣ�ġ����ֺ����ģ�����ʹ�������ַ�',
			'length' => '�������Ȳ�С��4�ֽڣ��������20���ֽ�(1�������൱��2���ֽ�'
		),
		'gender' => array (
			'null' => '��ѡ���Ա�',
		),
		'birthday' => array (
			'null'  => '��ѡ���������',
			'format'  => '���ո�ʽ����ȷ������ڲ����ڡ���ȷ��ʽ: 1999-01-01'
		),
		'password' => array (
			'null'  => '����������',
			'length'  => '���볤�Ȳ�������6�ֽ�'
		),
		'rePassword' => array (
			'null'  => '������ȷ������',
			'notEqual'  => 'ȷ�����������벻һ��'
		),
	);
}

class StringUtils
{
	static function substrCn($str, $start, $len) {
	$tmpstr = "";
	$len = ($start + $len) < strlen($str) ? ($start + $len) : strlen($str);
	for ($i = $start; $i < $len ; $i++) {
	    if( ord(substr($str, $i, 1) ) > 0xa0) {
	    $tmpstr .= substr($str, $i, 2);
	    $i++;
	    } else {
	       $tmpstr .= substr($str, $i, 1);
	    }
	 }
	    return $tmpstr;
	}	
	
    static function hasSpecialChar($str) {
	    if (trim($str) == '')
		    return true;
	    $pattern = '/^(\w|[\x4e00-\x9fa5])*$/';
//	    $pattern = '/^[0-9A-Z_a-z\x0391-\xFFE5]*$/';
//	    $pattern = '/^[0-9A-Z_a-z\u0391-\uFFE5]*$/';
	    return preg_match($pattern, $str) ? false : true;
    }
	
	static function isAvailableDate ($date) {
		try {	
		    if (empty($date)) {
			    return false;
			}
			if (preg_match('/[^\d-\/]/', $date)) {
				return false;
			}	
			$dateList = split('[/.-]', $date);
			if (sizeof($dateList) < 3 || sizeof($dateList) > 3) {
				return false;
			}
			$year  = $dateList[0];
			$month = $dateList[1];
			$day   = $dateList[2];
			if (empty($year) || empty($month) || empty($day)) {
				return false;
			}
			return checkdate($month, $day, $day);
		} catch(Exception  $ex) {
			echo $ex;
		}
	}
}
?>