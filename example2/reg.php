<?php
require_once('reg/reg.action.php');
?>
<?php
class RegControl
{	
	private $BASE_PATH;
	private $actionPathList;
	private $regAction;
	
	 function __construct() {
		$this->setBaseUrl('reg/');
		$actionPathList = array(
					'checkName'  =>  $this->BASE_PATH . 'reg.check.tpl',
					'regSuccess' => $this->BASE_PATH . 'reg.info.tpl',
					'regFailed' => 'reg.html',
					'none'      => 'reg.html'
		);	
		$this->setActionPathList($actionPathList);
	}
	
	function setBaseUrl($path) {
		$this->BASE_PATH = $path;
	}
	
	function setActionPathList($actionPathList) {
		$this->actionPathList = $actionPathList;
	}

	function addActionPathList($key, $value) {
		if (isset($key) && isset($value)) {
			$this->actionPathList[$key] = $value;
		}
	}
	
	function setRegAction($regAction) {
		$this->regAction = isset($regAction) ? $regAction : new RegAction();
	}

	function getTempletePath() {
		$path = null;			
		$action = $this->regAction->getAction();		
		if (empty($action)) {
			$path = $this->actionPathList['none'];
			return $path;
		}
		
		if ($action == 'reg') {
			$action = $this->regAction->isRegSuccess() ? 'regSuccess' : 'regFailed';
		}
			
		if (isset($this->actionPathList[$action])) {
			$path = $this->actionPathList[$action];
		} 
		return $path;
	}

}

// 实例化对象
$regAction = new RegAction();
$regControl = new RegControl();
$regControl->setRegAction($regAction);
$templetePath = $regControl->getTempletePath();

// 反馈给模板的变量与数组
$ERRORS_REG = $regAction->getErrorList();
$REG_INFO = array(
	'name' => $regAction->getName(),
	'gender' => $regAction->getGender(),
	'birthday' => $regAction->getBirthday(),
	'password' => $regAction->getPassword(),
	'rePassword' => $regAction->getRePassword()
	
);
// 选中项可以模板语言处理，本例子未使用模板语言
$genderSelected = array (
	'male' => ($REG_INFO['gender'] == 'male') ? 'selected' : '',
	'female' => ($REG_INFO['gender'] == 'female') ? 'selected' : ''
);

// 数据回填测试，直接使用应当使用模板语言来填充
// 本例为了测试使用的js填充，为了直接查看html文件时不打乱标签
function _tmp_getFillRegInfo($REG_INFO) {
	$html = '<script>';
	$html .= '(function() {'
		 . ' var name = \'' . $REG_INFO['name'] . '\';' 
		 . ' var gender = \'' . $REG_INFO['gender'] . '\';'
		 . ' var birthday = \'' . $REG_INFO['birthday'] . '\';'
		 . ' var password = \'' . $REG_INFO['password'] . '\';'
		 . ' var rePassword = \'' . $REG_INFO['rePassword'] . '\';'
		 . 'document.regForm.name.value = name;'
		 . 'document.regForm.birthday.value = birthday;'
		 . 'document.regForm.password.value = password;'
		 . 'document.regForm.rePassword.value = rePassword;'
		 . 'if (gender==\'male\') { document.regForm.gender[0].checked = true;}'
		 . 'else if (gender==\'female\') { document.regForm.gender[1].checked = true;}'
	     . '})();';
	$html .= '</script>';
	return $html;
}

$tmp_FILL_REG_INFO = _tmp_getFillRegInfo($REG_INFO);

// 嵌入模板
if(isset($templetePath)) {
	require_once($templetePath);
}
?>