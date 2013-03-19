/**
 * Baidu UE JavaScript Library
 * 
 * get-unique-id.js
 * @author UTer
 * @version $Revision: 1.3 $
 */


(function () {
    var uniqueIdMap = {};
    
    /**
     * ��������ַ���
     * 
     * @owner window
     * @param {Number} len ����uniqueId�ĳ���
     * @return {String} uniqueId
     */
    window.getUniqueId = function (len) {
        var l = len || 8;
        var uid = '';
        while (l--) {
            uid += getRandomChar();
        }
        if (!uniqueIdMap[uid]) {
            uniqueIdMap[uid] = 1;
            return uid;
        } else {
            return getUniqueId(l);
        }
    };
    
    var getRandomChar = function () {
        var charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charMapLen = charMap.length;
        return charMap.charAt(Math.floor(Math.random() * charMapLen));
    };
})();