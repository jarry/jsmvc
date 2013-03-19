 // 把action以及service都include进来，也可以把其他文件都包括进来
 // 本文件仅用作测试，当上线时被合并压缩的文件替代
 // 这个文件本身也有一个备份在js-src相应目录下，用于恢复开发调试状态

(function() {
   function write(path, scriptList) {
	   for (var i = 0; i < scriptList.length; i++) {
		document.write('<script type="text/javascript" src="' + path + scriptList[i] + ' "></script>');
	   }
   }
   // scripts list
   var SCRIPT_PATH = '../js-src/example2/';
   var SCRIPT_LIST = ['reg.action.js', 'reg.class.js'];
   write(SCRIPT_PATH, SCRIPT_LIST);
})();
