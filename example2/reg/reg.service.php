<?php
require_once("com.ini.php");
require_once("reg.dao.php");
?>
<?php
/**
 * 注册业务处理
 * @author lichunping jarryli@gmail.com
 */
class RegService
{
	private $name;
	private $action;
	private $password;
	private $rePassword;
	private $birthday;
	
	private $regData;
	private $ERROR_LIST = array();
	private $errorText;
	
    function __construct() {
	    $this->regData = new CRegData();
	    $this->errorText = ERROR_TEXT::$REG;
	    $this->initErrorList();	    
    }
    
    /** 
     * 初始化报错数组列表
     * 必须先定义数组项才能输出给模板，目地是确保数组项一致, 
     */
    function initErrorList() {
    	$this->ERROR_LIST = array(
			'name' => '',
			'gender' => '',
			'birthday' => '',
			'password' => '',
			'rePassword' => ''
	    );
    }

   function setAction($action) {
		$this->action = $action;
	}
	
	function setName($name) {
		$this->name = $name;
	}
	
	function setGender($gender) {
		$this->gender = $gender;
	}
	
	function setBirthday($birthday) {
		$this->birthday = $birthday;
	}

	function setPassword($password) {
		$this->password = $password;
	}

	function setRePassword($rePassword) {
		$this->rePassword = $rePassword;
	}

	function existSameName($name) {
		$name = isset($name) ? $name : $this->name;
		$nameList = $this->regData->getNameList();
		if (in_array($name, $nameList)) {
			return true;
		}
		return false;
	}
	
	function isAvailName() {
		$validate = true;
		switch($this->name) {
			case (empty($this->name)) :
				$validate = false;
				$this->setErrorList('name', $this->errorText['name']['null']);
				break;
			case (StringUtils::hasSpecialChar($this->name)) :
				$validate = false;
				$this->setErrorList('name', $this->errorText['name']['specialChar']);
				break; 
			case (strlen($this->name) > 20 || strlen($this->name) < 4) :
				$validate = false;
				$this->setErrorList('name', $this->errorText['name']['length']);
				break; 
			case ($this->existSameName($this->name))  :
				$validate = false;
				$this->setErrorList('name', $this->errorText['name']['exist']);
				break;
			default : null;
		}

		return $validate;
	}
	
	function isAvailGender() {
		$validate = true;
		if (empty($this->gender)) {
			$validate = false;
			$this->setErrorList('gender', $this->errorText['gender']['null']);
		}
		return $validate;
	}
	
	function isAvailBirthday() {
		$validate = true;
		if (trim($this->birthday) == '' || empty($this->birthday)) {
			$validate = false;
			$this->setErrorList('birthday', $this->errorText['birthday']['null']);
		} else if (!StringUtils::isAvailableDate($this->birthday)) {
			$validate = false;
			$this->setErrorList('birthday', $this->errorText['birthday']['format']);
		}
		return $validate;
	}
	
	function isAvailPassword() {
		$validate = true;
		if (empty($this->password) || trim($this->password) == '') {
			$validate = false;
			$this->setErrorList('password', $this->errorText['password']['null']);
		} else if (strlen($this->password) < 6) {
			$validate = false;
			$this->setErrorList('password', $this->errorText['password']['length']);
		}
		return $validate;
	}
	
	function isAvailRePassword() {
		$validate = true;
		if (empty($this->rePassword) || trim($this->rePassword) == '') {
			$validate = false;
			$this->setErrorList('rePassword', $this->errorText['rePassword']['null']);
		} else if (trim($this->rePassword) != trim($this->password)) {
			$validate = false;
			$this->setErrorList('rePassword', $this->errorText['rePassword']['notEqual']);
		}
		return $validate;
	}

	function checkRegSuccess() {
		$validate = true;
		if (!$this->isAvailName()) {
			$validate = false;
		}
		if (!$this->isAvailGender()) {
			$validate = false;
		}
		if (!$this->isAvailBirthday()) {
			$validate = false;
		}
		if (!$this->isAvailPassword()) {
			$validate = false;
		}
		if (!$this->isAvailRePassword()) {
			$validate = false;
		}
			
		return $validate;
	}
	
	function setErrorList($key, $value) {
		if (isset($this->ERROR_LIST[$key])) {
			$this->ERROR_LIST[$key] = $value;
		}
	}
	
	function getErrorList() {
		return $this->ERROR_LIST;	
	}
}
?>
