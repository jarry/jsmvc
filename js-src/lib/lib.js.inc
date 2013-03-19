 // include各种需要的类库文件， 根据需要加载
 // 本文件仅用作测试，当上线时被合并压缩后的文件替代
 // 这个文件本身也有一个备份在js-src相应目录下，用于恢复开发调试状态

(function() {
   function write(path, scriptList) {
	   for (var i = 0; i < scriptList.length; i++) {
		document.write('<script type="text/javascript" src="' + path + scriptList[i] + ' "></script>');
	   }
   }
   // library script
   var SCRIPT_LIB_LIST = ['core.js', 'event.js', 'ajax.js', 'class.js', 'string.js', 'element.js', 'get-unique-id.js'];
   var SCRIPT_LIB_PATH = '../js-src/lib/';
   // UI component script
   var SCRIPT_UI_LIST = ['calendar/calendar.js'];
   var SCRIPT_UI_PATH = '../js-src/ui/';

   write(SCRIPT_LIB_PATH, SCRIPT_LIB_LIST);
   write(SCRIPT_UI_PATH, SCRIPT_UI_LIST);

})();
