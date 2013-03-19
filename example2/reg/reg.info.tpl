<!doctype html> 
<html> 
<head> 
<title>register - JS MVC Example</title> 
</head> 
<link href="css/reg.css" rel="stylesheet" type="text/css" />
<body>
	<div class="main">
		<h3>恭喜，注册成功！<br/></h3>
		<strong><?php echo $regAction->getName();?>，您的注册信息如下：</strong>
		<pre>
		<?php
			print_r($_POST);
		?>
		</pre>
	</div>
</body>
</html>