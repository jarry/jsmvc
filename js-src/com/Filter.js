/**
 * Copyright 2016 Young Inc. All rights reserved.
 *
 * @file:   Filter.js
 * @path:   js-src/com
 * @desc:   对内容进行过滤或替换
 * @author: jarry
 * @date:   2012-11-29
 */

var Filter = Filter || {};
Filter = {
    _rules: {
        // @see http://www.hipenpal.com/tool/characters_to_unicode_charts_in_simplified_chinese.php?unicode=71
        // Unicode字符值  转义序列    含义  类别
        // \u0008  \b  Backspace   
        // \u0009  \t  Tab 空白
        // \u000A  \n  换行符（换行） 行结束符
        // \u000B  \v  垂直制表符   空白
        // \u000C  \f  换页  空白
        // \u000D  \r  回车  行结束符
        // \u0020      空格  空白
        // \u0022  \"  双引号 (") 
        // \u0027  \'  单引号 (') 
        // \u005C  \   反斜杠 ()  
        // \u00A0      不间断空格   空白
        // \u2028      行分隔符    行结束符
        // \u2029      段落分隔符   行结束符
        // \uFEFF      字节顺序标记  空白
        JS_CHAR_CODE: ['\\u000b', '\\u000c', '\\u2028', '\\u2029']
    },
    /**
     * 根据unicode编码过滤掉JS特殊字符
     * @param  {String} source   待过滤的字符串
     * @param {Array}[option] codeList 要过滤编码列表
     * @returns {String}   过滤之后的字符串
     * Filter.filterJSChars(div.innerHTML);
     * result: 
     */
    filterJSChars: function (source, codeList) {
        var l = source.length, tmp, _char;
        codeList = codeList || Filter._rules.JS_CHAR_CODE;
        for (var i = 0; i < l; i++) {
            _char = source.charCodeAt(i);
            tmp = '\\u' + ('000' + _char.toString(16)).slice(-4).toLowerCase();
            if (tmp && codeList.indexOf(tmp) != -1) {
                // console.log('inner:', _char, i, source.charCodeAt(i), tmp, source);
                source = source.replace(source[i], '');
                i--;
                l--;
            }
        }
        return source;
    },
    /**
     * 过滤掉全部HTML标记与内容
     * @param  {String} source   待过滤的字符串
     * @returns {String}   过滤之后的字符串
     */
    filterHTML: function(source) {
        if (!source || source === '') {
            return source;
        }

        var str = source.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        return str;
    },
    /**
     * 过滤掉字符串中某些特殊字符
     * @param  {String} str   待过滤的字符串
     * @param  {Array} filterChars 要过滤的字符组成的数组
     * @returns {String}   过滤之后的字符串
     */
    filterSpecialChars: function(str, filterChars) {
        // 正则元字符执行时要转义
        var special = [',', '!', '\\', '^', '$', '{', '}', '[', ']', '(', ')',
            '.', '*', '+', '?', '|', '<', '>', '-', '&'
        ];
        var r = new RegExp("h", "g");
        $.each(filterChars, function(index, c) {
            c = (special.indexOf(c) != -1) ? ('\\' + c) : c;
            r.compile(c, 'g');
            str = str.replace(r, '');
        });
        return str;
    }
};