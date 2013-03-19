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

// ʵ��������
$regAction = new RegAction();
$regControl = new RegControl();
$regControl->setRegAction($regAction);
$templetePath = $regControl->getTempletePath();

// ������ģ��ı���������
$ERRORS_REG = $regAction->getErrorList();
$REG_INFO = array(
	'name' => $regAction->getName(),
	'gender' => $regAction->getGender(),
	'birthday' => $regAction->getBirthday(),
	'password' => $regAction->getPassword(),
	'rePassword' => $regAction->getRePassword()
	
);
// ѡ�������ģ�����Դ���������δʹ��ģ������
$genderSelected = array (
	'male' => ($REG_INFO['gender'] == 'male') ? 'selected' : '',
	'female' => ($REG_INFO['gender'] == 'female') ? 'selected' : ''
);

// ���ݻ�����ԣ�ֱ��ʹ��Ӧ��ʹ��ģ�����������
// ����Ϊ�˲���ʹ�õ�js��䣬Ϊ��ֱ�Ӳ鿴html�ļ�ʱ�����ұ�ǩ
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

// Ƕ��ģ��
if(isset($templetePath)) {
	require_once($templetePath);
}
?>