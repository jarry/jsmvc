<?php
/*
 * 公共函数库与静态变量
 * @author lichunping jarryli@gmail.com
 */
class ERROR_TEXT
{
	public static $REG = array(
		'name' => array (
			'exist' => '对不起，用户名已经存在',
			'null'  => '请输入用户名',
			'specialChar'  => '姓名仅限于英文、数字和中文，不能使用特殊字符',
			'length' => '姓名长度不小于4字节，最长不超过20个字节(1个汉字相当于2个字节'
		),
		'gender' => array (
			'null' => '请选择性别',
		),
		'birthday' => array (
			'null'  => '请选择出生日期',
			'format'  => '生日格式不正确或该日期不存在。正确格式: 1999-01-01'
		),
		'password' => array (
			'null'  => '请输入密码',
			'length'  => '密码长度不能少于6字节'
		),
		'rePassword' => array (
			'null'  => '请输入确认密码',
			'notEqual'  => '确认密码与密码不一致'
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