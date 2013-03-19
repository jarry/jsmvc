<?php
require_once("reg.service.php");
?>
<?php
/**
 * 注册action
 * @author lichunping jarryli@gmail.com
 */
class RegAction 
{
    private $action;
    private $name;
    private $gender;
    private $birthday;
    private $password;
    private $rePassword;
    
	private $regService;
	private $post;
	private $get;

    function __construct() {
	   // 未作统一处理, 仅用作测试
	    $this->post = $_POST;
	    $this->get  = $_GET;
	    $action = isset($this->get['action']) ? $this->get['action'] : '';
	    
	    if (!empty($this->post)) {
	    	$name = $this->post['name'];
    	} else {
	    	$name = isset($this->get['name']) ? $this->get['name'] : '';
    	}
    	  	
	    $this->setName($name);
	    $this->setAction($action);
	    
	    if (!empty($this->post)) {
	    	if (isset($this->post['gender']))$this->setGender($this->post['gender']);
	    	$this->setBirthday($this->post['birthday']);
	    	$this->setPassword($this->post['password']);
	    	$this->setRePassword($this->post['rePassword']);
    	}
	    
		$this->regService = new RegService();
		$this->regService->setAction($this->action);
		$this->regService->setName($this->name);
	    $this->regService->setGender($this->gender);
	    $this->regService->setBirthday($this->birthday);
	    $this->regService->setPassword($this->password);
	    $this->regService->setRePassword($this->rePassword);
    }

	function existSameName($name) {
		return $this->regService->existSameName($name);	
	}

    function setAction($action) {
		$this->action = $action;
	}
	function getAction() {
		return $this->action;	
	}

	function setName($name) {
		$this->name = $name;
	}

	function getName() {
		return $this->name;	
	}
	
	function setGender($gender) {
		$this->gender = $gender;
	}

	function getGender() {
		return $this->gender;	
	}
	
	function setBirthday($birthday) {
		$this->birthday = $birthday;
	}
	
	function getBirthday() {
		return $this->birthday;	
	}
	
	function setPassword($password) {
		$this->password = $password;
	}
	
	function getPassword() {
		return $this->password;	
	}
	
	function setRePassword($rePassword) {
		$this->rePassword = $rePassword;
	}
	
	function getRePassword() {
		return $this->rePassword;	
	}
	
	function setErrorList($value) {
		$this->regService->setErrorList($this->regService->ERRORS, $value);	
	}
	
	function getErrorList() {
		return $this->regService->getErrorList();	
	}

	function isRegSuccess() {
		return $this->regService->checkRegSuccess();	
	}
}

?>