 // include������Ҫ������ļ��� ������Ҫ����
 // ���ļ����������ԣ�������ʱ���ϲ�ѹ������ļ����
 // ����ļ�����Ҳ��һ��������js-src��ӦĿ¼�£����ڻָ���������״̬

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