 // ��com���õ��ĸ����ļ�����������
 // ����ĿҪ����ʱcom.js��ϲ�ѹ�����������ߺ�Ľ��Ǻϲ����һ���ļ�
 // ����ļ�����Ҳ��һ��������js-src��ӦĿ¼�£����ڻָ������͵���

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