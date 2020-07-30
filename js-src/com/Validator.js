/**
 * Copyright 2012 Young Inc. All rights reserved.
 *
 * @file:   Com.js
 * @path:   js-src/com
 * @desc:   项目的公共验证函数集合，所有函数均为公开
 *          函数采取全部键值对象式声明，方法名采用驼峰式命名
 * @author: jarry
 * @date:   2012-05-06
 */

///import js-src/lib/
///import js-src/com/

var Validator = Validator || {};

Validator = {

    formulae: {
        // reg : /^[a-zA-Z0-9]+$/,
        // reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

        number: /^\d+$/,
        english: /^[A-Za-z]+$/,
        numAndEn: /^[a-zA-Z0-9]+$/,
        numAndEnAndCn: /^[a-zA-Z0-9_\u4E00-\u9FA5]+$/,
        // email :  /^(.+)@(.+)$/,  
        // email : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
        // chinese : /[\u4E00-\u9FA5\uF900-\uFA2D]/, 
        chinese: /^[\u0391-\uFFE5]+$/,

        // special : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/
        // specailSimple : /[^\\\/\*\?\|\<\>\:]+/
        specailSimple: /[\\\/:*?\"<>|\']+/g
    },

    isEmail: function(str) {
        var reg = Validator.formulae.email;
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        var minLen = 4;
        if (str.length < minLen) {
            return false;
        }
        return str.match(reg) ? true : false;
    },

    /**
     * 验证合法的name也就是昵称
     * 规则：4-25 字符，支持数字、中英文以及“_”
     *
     * @param {String} str 字符串
     * @return {Boolean} 是否正确
     */
    isName: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        var len = Com.getStrLength(str);
        var maxLen = 25;
        var minLen = 4;
        if (len < minLen || len > maxLen) {
            return false;
        }

        var reg = Validator.formulae.numAndEnAndCn;
        return reg.test(str);
    },

    /**
     * 验证合法的password
     * 规则： 6个字符以上
     *
     * @param {String} str 字符串
     * @return {Boolean} 是否正确
     */
    isPassWord: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        var len = Com.getStrLength(str);
        var minLen = 6;
        if (len < minLen) {
            return false;
        }
        return true;
    },

    isBoardName: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        var reg = Validator.formulae.specailSimple;
        return !reg.test(str);
    },

    /**
     * 验证合法的domain
     * 规则：5-15字符，仅支持英文和数字，首字母须为英文
     *
     * @param {String} str 字符串
     * @return {Boolean} 是否正确
     */
    isDomain: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }

        var len = str.length;
        var minLen = 5;
        var maxLen = 15;

        if (len < minLen || len > maxLen) {
            return false;
        }

        var en = Validator.formulae.english;
        var numAndEn = Validator.formulae.numAndEn;
        var firstChar = str.substr(0, 1);

        if (!en.test(firstChar)) {
            return false;
        }

        return numAndEn.test(str);
    },

    /**
     * 根据后缀验证合法的视频文件
     * 规则：以.分割，最后的字符串提取为后缀，匹配配置的视频文件类型
     *
     * @param {String} str 字符串
     * @return {Boolean} 是否正确
     */
    isVideo: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        if (!this.isValidName(str)) {
            return false;
        }
        var type = Com.file.getExt(str);
        var name = str.substr(0, (str.length - type.length - 1));
        if (name === '') {
            return false;
        }
        // var allowFileTypes = ["mpg", "mpeg", "mp4", "m4v", "flv", "f4v", "mkv", "avi", "rm", "rmvb", "wmv", "mov", "ts", "vob"];
        // var allowFileTypes = ['mpg','mp4', 'rmvb', 'ts', 'vob', 'flv', 'm4v'];
        var allowFileTypes = ['mpg', 'mp4', 'rmvb', 'ts', 'vob', 'flv',
            'm4v', 'mkv', 'mpeg', 'avi', 'mov', 'wmv', 'f4v', 'm2ts', 'm2t', 'mts', 'mxf'
        ];
        if (allowFileTypes.indexOf(type) != -1) {
            return true;
        } else {
            return false;
        }
    },
        /**
     * 根据后缀验证合法的音频文件
     * 规则：以.分割，最后的字符串提取为后缀，匹配配置的视频文件类型
     *
     * @param {String} str 字符串
     * @return {Boolean} 是否正确
     */
    isAudio: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        if (!this.isValidName(str)) {
            return false;
        }
        var type = Com.file.getExt(str);
        var name = str.substr(0, (str.length - type.length - 1));
        if (name === '') {
            return false;
        }
        var allowFileTypes = ['aac', 'wav', 'wma', 'mp3', 'pcm', 'ape', 'ogg'];
        if (allowFileTypes.indexOf(type) != -1) {
            return true;
        } else {
            return false;
        }
    },

    isImage: function(str) {
        if (!str || 'string' != typeof str || $.trim(str) === '') {
            return false;
        }
        if (!this.isValidName(str)) {
            return false;
        }
        var type = Com.file.getExt(str);
        var name = str.substr(0, (str.length - type.length - 1));
        if (name === '') {
            return false;
        }
        var allowFileTypes = ['jpg', 'jpeg', 'png'];
        if (allowFileTypes.indexOf(type) != -1) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 校验文件名是否合法
     * @param {String} name
     * @return {Boolean} true || false
     */
    isValidName: function(name) {
        if ($.trim(name) === '' || name.length < 0) {
            return false;
        }
        var regexp = /[\\\/:*?\"<>|]+/g;
        // var regexp = /[\\\/:*?\"<>|\']+/g; // 不允许单引号
        return !regexp.test(name);
    },

    // dateStr: 2012-06-05 00:00:00
    isValidDate: function(dateStr) {
        var date = '2012-06-05 00:00:00';
        if (!dateStr || (dateStr.length != date.length) || ('string' !== typeof dateStr)) {
            return false;
        }
        dateStr = dateStr.replace(/-/g, '/');
        if (Date.parse(new Date(dateStr)) >= 0) {
            return true;
        }
        return false;
    },

    //当前时间是否大于今天
    isAfterToday: function(dateStr) {
        var date = '2012-06-05 00:00:00';
        if (!dateStr || (dateStr.length != date.length) || ('string' !== typeof dateStr)) {
            return false;
        }
        dateStr = dateStr.replace(/-/g, '/');
        var today = new Date();
        if ((Date.parse(new Date(dateStr)) >= 0) && (today < Date.parse(dateStr))) {
            return true;
        }
        return false;
    },
    // timeStr: 10:00
    isValidTime: function(timeStr) {
        var date = '00:00';
        if (!timeStr || (timeStr.length < date.length) || ('string' !== typeof timeStr)) {
            return false;
        }
        try {
            var parts = (timeStr || '').split(':');
            if (parts.length > 2) {
                return false;
            }

            // var minute = parseInt(parts[0], 10);
            // var second = parseInt(parts[1], 10);
            var minute = Number(parts[0]).toFixed(0);
            var second = Number(parts[1]).toFixed(0);

            if ((parts[0].indexOf('.') != -1) || (parts[1].indexOf('.') != -1)) {
                return false;
            }
            if (isNaN(minute) || isNaN(second)) {
                return false;
            }
            if (minute >= 0 && (second >= 0 && second < 60)) {
                return true;
            }
        } catch (e) {
            console.log(e.message);
        }
        return false;
    },

    /**
     * 验证年月日的格式是否正确，不验证必填项
     *
     */
    validateDateYMD: function(value) {
        if (!$.trim(value)) {
            return true;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }
        return !/Invalid|NaN/.test(new Date(value).toString());
    }

};

Validator.isPassword = Validator.isPassWord;