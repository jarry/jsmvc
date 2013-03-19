 // 把com里用到的各种文件都包括进来
 // 当项目要上线时com.js会合并压缩，这样上线后的将是合并后的一个文件
 // 这个文件本身也有一个备份在js-src相应目录下，用于恢复开发和调试

(function() {
   function write(path, scriptList) {
	   for (var i = 0; i < scriptList.length; i++) {
		document.write('<script type="text/javascript" src="' + path + scriptList[i] + ' "></script>');
	   }
   }
   // script list
   var SCRIPT_PATH = '../js-src/example2/com/';
   var SCRIPT_LIST = ['dom.js', 'string.js', 'validate.js', 'error.js'];
   write(SCRIPT_PATH, SCRIPT_LIST);
})();
