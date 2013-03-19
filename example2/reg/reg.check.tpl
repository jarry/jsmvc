<?php
header( "Content-type: application/json; charset=gbk");
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header( "Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . " GMT" );
header( "Cache-Control: no-cache, must-revalidate" );
header( "Pragma: no-cache" );
?>
{
<?php
if ($regAction->getName() == '') {
?>
    status : 400,
    data : {
			notice : '请输入用户名'
		}
<?php
} else if ($regAction->existSameName(null)) {
?>
    status : 200,
    data : {
			existName : true,
			notice : '对不起，这个名字已经注册过了'
		}
<?php
} else if ($regAction->isRegSuccess()){
?>

    status : 200,
    data : {
			existName : false,
			notice : '恭喜你，这个名字可以注册'
		}
<?php
} else {	
?>

    status : 300,
    data : {
			notice : '<?php $ERRORS_REG = $regAction->getErrorList(); echo $ERRORS_REG['name']; ?> '
		}
<?php
}
?>
}