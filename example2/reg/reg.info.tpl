<!doctype html> 
<html> 
<head> 
<title>register - JS MVC Example</title> 
</head> 
<link href="css/reg.css" rel="stylesheet" type="text/css" />
<body>
	<div class="main">
		<h3>��ϲ��ע��ɹ���<br/></h3>
		<strong><?php echo $regAction->getName();?>������ע����Ϣ���£�</strong>
		<pre>
		<?php
			print_r($_POST);
		?>
		</pre>
	</div>
</body>
</html>