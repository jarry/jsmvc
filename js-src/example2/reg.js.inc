 // ��action�Լ�service��include������Ҳ���԰������ļ�����������
 // ���ļ����������ԣ�������ʱ���ϲ�ѹ�����ļ����
 // ����ļ�����Ҳ��һ��������js-src��ӦĿ¼�£����ڻָ���������״̬

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