/**
 * Copyright 2012 Jiae Inc. All rights reserved.
 * 
 * file: Template.js
 * path: js-src/com/
 * description: 模板解析器
 * author: lichunping
 * date: 2010-4-16
 */


/**
 * 
 * 用于模板解析 模板一共分为三种情况 
 * 1. 页面模板，即把模板写在框架页面中，用script type="template"标识，随页面同步载入 
 * 2. 功能模板，当页面执行操作时需要载入的功能模板，一般是一段JS块，可随js一同载入，也可通过Ajax异步载入 
 * 3. 后台模板，用于请求载入外部较独立页面，iframe访问或通过Ajax请求得到内容
 * 
 * 项目中把第2中与第1种模板合并，即所有页面用到的功能全部写成页面模板 相对独立的功能或外部功能采用第3种方式
 * 
 * 模板解析提供的功能有：
 * 1. 变量直接替换(var)、数组变量循环替换(loopArray)、数组下匿名对象变量循环替换(loopObject)
 * 2. 多层模板嵌套
 * 3. 模板可以嵌套多个循环，但一个循环下仅支持嵌套一个全部值为直接量的模板(成为循环子模板)
 * 
 * 本模板主要解决的是一般情况下的字符串变量替换、循环和嵌套，多维数组以及需要流程控制由JS单独来控制
 * 
 * 其他：
 * 1. 不支持流程控制等
 * 2. 模板名称、变量名称、模板结构与JSON一一对应
 * 3. 模板不能重名，同一模板下的变量或循环不能同名
 * 
 * 模板数据结构:
 *                   Object(Template)
 *         ____________|____________________
 *        |            |                    |
 *     Direct       Object               Array(Loop)
 *     Value       (SubTemplate)  _________|__________________
 *                                |         |                  |
 *                             Direct    Object(anonymous)   Object(only one and anonymous)
 *                             Value        |                  |
 *                                       Direct              Object(Loop SubTemplate)
 *                                       Value                 |
 *                                                           Direct
 *                                                           Value
 *  
 * Direct Value include : 
 * string, number, boolean, date, null
 * 
 * 模板使用示例：
 * <script type="text/template" id="TemplateName">
 *    <h2>name：#{name} age：#{age}</h2>
 *    <template:subTemplateName1>
 *         <ul><loop:sub1_loop1> <li>#{sub1_loop1}</li> </loop></ul>
 *
 *         <loop:sub1_loop2>
 *             <ul>
 *             <template:sub1_loop2_subTemplateName1_1>
 *                   <li>#{a}</li> <li>#{b}</li>
 *             </template>
 *             </ul>
 *         </loop>
 *    </template>
 *    <template:subTemplateName2>
 *         #{sub2_var1}  #{sub2_var2}
 *         <loop:subTemplateLoop2_1>
 *               <li>#{a}  #{b}</li>
 *         </loop>
 *     </template>
 * </script>
 * 
 * JSON数据示例:
 * var TemplateData = {
 *    'name'    : '用户姓名',
 *    'age'     : 100,
 *    'subTemplateName1' : {
 *        'sub1_loop1' : [null , 'sub1_loop1', new Date(), true, 999],
 *        'sub1_loop2' : 
 *        [{
 *            sub1_loop2_subTemplateName1_1 : 
 *            {
 *                a : null,  
 *                b : 'sub1_loop2_subTemplateName1_1b' 
 *            }
 *        }]
 *    },
 *
 *   'subTemplateName2' : {
 *          'sub2_var1' : null,
 *          'sub2_var2' : 'sub2_var2',
 *          'subTemplateLoop2_1' :
 *          [
 *              {'a' : 'sub2_1_var1', 'b' : 'sub2_1_var2'},
 *              {'a' : 'sub2_2_var1', 'b' : 'sub2_2_var2'},
 *              {'a' : 'sub2_3_var1', 'b' : 'sub2_3_var2'}
 *          ]
 *    }
 * };
 *
 * 调用
 *  var tpl = Template.getById('TemplateName', TemplateData);
 * 
 */

var Template = Template || {};
Template.Data = Template.Data || {};

/**
 * 配置项
 * 主要是模板变量标记符，直接修改或通过com里的方法来配置
 */
Template.config = {
    VAR_LEFT   : '{{',
    VAR_RIGHT  : '}}',
    LOOP_LEFT  : '<loop:',
    LOOP_RIGHT : '>',
    LOOP_END   : '</loop>',
    TPL_LEFT   : '<template:',
    TPL_RIGHT  : '>',
    TPL_END    : '</template>',


    TPL_SOURCE_LEFT  : '<!--template:',
    TPL_SOURCE_RIGHT : '-->',
    TPL_SOURCE_END   : '<!--template:end-->',

    NULL_VALUE : 'null'
};

/**
 * 公共方法
 * 与模板处理业务无关的单独函数集合
 */
Template.com = function() {

    // base function from Tangram
    var _isBoolean = function(o) {
        return typeof o === 'boolean';
    };
    
    var _isNumber = function (source) {
        return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
    };
    
    var _isString = function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    };
    
    var _isDate = function(o) {
        // return o instanceof Date;
        return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
    };
    
    var _isArray = function (source) {
        return '[object Array]' == Object.prototype.toString.call(source);
    };
    
    var _isElement = function (source) {
        return !!(source && source.nodeName && source.nodeType == 1);
    };
    
    var _isObject = function (source) {
        return 'function' == typeof source || !!(source && 'object' == typeof source);
    };

    var trim = function(source) {
        var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        return String(source).replace(trimer, "");
    };
    
   /**
    * 根据类型返回字符串
    * 共支持object,array,string,number,boolean,date六种类型
    * 其中object为模板类型，当数组下仅仅含有一个object时为模板
    * 
    * @param {string} type 对象类型
    * @return {string|null}  
    */
    var getType = function(obj) {
        if (_isString(obj)) {
                return 'string';
        } else if (_isNumber(obj)) {
                return 'number';
        } else if (_isBoolean(obj)) {
                return 'boolean';
        } else if (_isDate(obj)) {
                return 'date';
        } else if (_isArray(obj)) {
                return 'array';
        } else if (_isElement(obj)) {
                return 'element';
        } else if (_isObject(obj)) {
                return 'object';
        } else {
                return null;
        }
    };

   /**
    * 判断数据是否为直接量，即直接替换的模板变量
    * 
    * @param {string} type 对象类型
    * @return {boolean}  
    */
    var isRealValue = function(type) {
        switch(type) {
            case 'string' :
                    return true;            
                    break;
            case 'number' :
                    return true;                    
                    break;
            case 'boolean' :
                    return true;                    
                    break;          
            case 'date' :
                    return true;                    
                    break;  
           default : 
               return false;
        }
    };

   /**
    * 判断数组下的内容是否全部为直接量，
    * 如果是则表示为循环，反之则表示为子模板
    * 
    * @param {array} arr 数组对象
    * @return {boolean}  
    */
    var isRealValueInArray = function(arr) {
        var type = '';
            for (var i = 0, l = arr.length; i < l; i++) {
                type = getType(arr[i]);
                    if (arr[i] === null) {
                        arr[i] = Template.config.NULL_VALUE;
                    } 
                    if (type && !isRealValue(type)) {
                        return false; 
                    }
            }
        return true;
    };

    /**
     * 解析模板资源，当一个模板资源内有多个模板块时
     * 可根据模板块名称来获得模板内容，主要用于异步加载的模板
     *
     * @param {string} source 模板资源内容，如整个页面内容
     * @param {string} name 模板块的名称，不能重名
     * @param {return} string 返回指定名称的模板块字符串
     */
    var parseSource = function(source, name) {
        var left  = Template.config.TPL_SOURCE_LEFT;
        var right = Template.config.TPL_SOURCE_RIGHT;
        var end   = Template.config.TPL_SOURCE_END;
        if (source && name) {
            var sign  = left + name + right;
//            var partA = '';
//            var partB = '';
//            var partC = '';
            var startIndex = source.indexOf(sign);
            if (startIndex != -1) {
                source = source.substr(startIndex + sign.length);
            }
            var endIndex = source.indexOf(end);
            if (endIndex != -1) {
                source = source.substr(0, endIndex);
            }
        }
        return source;
    };

    /**
     * 保存原始模板内容，存放在Template.Data下
     *
     * @param {string} name 要保存的名称
     * @param {string} tpl 模板内容
     */
    var saveData = function(name, tpl) {
        if (typeof name == 'string' && tpl) {
            Template.Data[name] = tpl;
        }
    };

    /**
     * 取出保存在Template.Data下原始模板
     *
     * @param {string} name 模板名称
     * @return {string} 模板内容
     */
    var getData = function(name) {
        if( name && Template.Data[name]) {
            return Template.Data[name];
        }
    };

    return {
        getType            : getType,
        isRealValue        : isRealValue,
        isRealValueInArray : isRealValueInArray,
        parseSource        : parseSource,
        saveData           : saveData,
        getData            : getData,
        trim               : trim
    };

}();


/**
 * 主程序
 * 根据JSON数据结构寻找模板内容，替换模板变量
 */
Template.main = function() {

    var VAR_LEFT   = Template.config.VAR_LEFT;
    var VAR_RIGHT  = Template.config.VAR_RIGHT;
    var LOOP_LEFT  = Template.config.LOOP_LEFT;
    var LOOP_RIGHT = Template.config.LOOP_RIGHT;
    var LOOP_END   = Template.config.LOOP_END;
    var TPL_LEFT   = Template.config.TPL_LEFT;
    var TPL_RIGHT  = Template.config.TPL_RIGHT;
    var TPL_END    = Template.config.TPL_END;

    var _getType            = Template.com.getType;
    var _isRealValue        = Template.com.isRealValue;
    var _isRealValueInArray = Template.com.isRealValueInArray;


//    var templateId      = '';
    var subTemplateLength = 0;

    var _g = function(id) {
        if (!id) return null;
        if ('string' == typeof id || id instanceof String) {
            return document.getElementById(id);
        } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
            return id;
        }
        return null;
    };
    
    
    /**
     * 判断一个对象是否为循环
     * 如果当前对象是数组则表示为循环
     * @param {object} obj json的某个对象
     * @return {boolean} 是否为子模板
     */ 
     var isLoop = function(obj) {
        if (_getType(obj) == 'array') {
            return true;
        }
        return false;
     };

    /**
     * 判断一个对象是否为模板
     * 如果当前不是直接量也不是数组，并且长度为undefined，则表示为对象。
     * @param {object} obj json的某个对象
     * @return {boolean} 是否为子模板
     */ 
     var isTemplate = function(obj) {
//         if (!_isRealValue(obj) && !isLoop(obj) && _getType(obj) == 'object') {
         if (!_isRealValue(obj) && !isLoop(obj) && _getType(obj) == 'object') {
            return true;
        }
        return false;
     };

    var isSubTemplate = isTemplate;

                
    /**
     * 解析模板内容，将对象内容添加到模板字串中
     * 将解析后的直接替换原模板块的父级对象
     * 并将原模板内容保存为TemplateSource对象中
     *
     * @param {HTMLElement|string} id或dom
     * @param {string} true|'save' 是否存原模板内容
     */
    var parse = function(id, json, save) {
        var tplObj;
        var tpl = '';
        if (_g(id) && json) {
            tplObj = _g(id);
            var tplParent = tplObj.parentNode;
            var originTpl = tplObj.innerHTML;
            tpl           = getByContent(tplObj.innerHTML, json);
            tplParent.innerHTML = tpl;
            if (save == true || save == 'save') {
                // 如果需要则保存原模板
                id = _getType(id) == 'element' ? id.id : id;
                Template.com.saveData(id, originTpl);
            }
        }        
    };
    
    /**
     * 
     * 通过ID/DOM或模板内容来替换变量快捷方法
     *
     * @param {string} idOrTpl 模板内容或模板ID或DOM
     * @param {object} json json对象，变量名与值对象
     * @return {string} 模板内容
     */
     var get = function(idOrTpl, json) {
         if (idOrTpl && _g(idOrTpl)) {
             return getById(idOrTpl, json);
         }
         return getByContent(idOrTpl, json);
     };
        
    /**
     * 
     * 通过模板id或模板DOM对象来得到模板内容，并根据对象内容来替换变量
     * 模板类型: <tag type="text/template" id="TemplateTest"></tag>
     * 推荐使用script作为tag，若使用其他tag，则模板结束标记不能使用默认'<','>'标记
     *
     * @param {HTMLElement|string} id或dom
     * @param {object} json json对象，变量名与值对象
     * @return {string} 对应id的模板内容
     */
    var getById = function(id, json) {
//        templateId  = id;
        var template = _g(id);
        var tpl      = '';
        if (template && json) {
            if (template.nodeType === 1 && 
                template.getAttribute('type') == 'text/template') {
                    tpl = template.innerHTML;
            }
            tpl = getByContent(tpl, json);
        }
        return tpl; 
    };   

 
   /**
    * 
    * 遍历json替换对应的变量与模板，得到新内容
    * 
    * @param {string} tpl 模板字符串
    * @param {object} json json对象，变量名与值对象集合
    * @return {string} 替换变量后内容
    */
    var getByContent = function(tpl, json) {
        if (tpl && tpl.length > 0 && json) {
            if (_getType(json) == 'array') {
                tpl = getContentByArray(tpl, json);
            } else if (_getType(json) == 'object') {
                tpl = getContentByObject(tpl, json);
            }
            return tpl;
        }
        return tpl;
    };
         
    /**
     * 
     * 根据JSON对象获得替换模板后的内容
     * 对象value包括：string,number,boolean,date和array
     *                array再分为内容是直接量的循环和单一对象的子模板
     * 
     * 键值对象有三种情况：
     *   1. 直接量，变量名与value对应，value类型包括string,number,boolean,date，不含object
     *   2. 子模板，为object，value为object，且非循环。支持多重嵌套。
     *   3. 是规则数组，包括循环与子模板:
     *      - 循环直接量(loop)，所有value都为直接量
     *      - 循环匿名对象，且该对象下所有key的value都是直接量
     *      - 子模板，当循环里一个匿名对象，且该匿名对象下的key包括含有模板(object)，则表示为子模板。
     *        目前循环里仅支持嵌套一层子模板，且该循环没有被包含在子模板内。多层循环嵌套方式暂不支持。
     * 
     * @param {string} tpl 模板原始字符
     * @param {object} json json对象，变量名与值对象
     * @return {string} 替换了变量后的模板内容
     */ 
     var getContentByObject = function(tpl, json) {
        var name  = '';
        var value = '';
        var tplHash = {};
        for (var key in json) {
            name = key;
            value = json[key];
            if (_isRealValue(_getType(value))) {
                // 直接量直接替换变量
                tplHash[name] = value;          
            } else if (isLoop(value)) {               
                tpl = getContentByLoop(tpl, name, value);
            } else if (isSubTemplate(value)) {
                // 子模板长度置空
                subTemplateLength = 0;
                subTemplateLength = getSubTemplateLength(name, value);
                // 遍历合并子模板变量
                tpl = getContentBySubObject(tpl, name, subTemplateLength, value);

            } else {
//              ('This object [' + name + '] value is undefined.');
                tplHash[name] = value;
            }
        }
        tpl = mergeVar(tpl, tplHash);
        // tpl = filterEmptyTemplate(tpl);
        return tpl;
     };

    /* 
     * 删除掉空模板内容,当自模板对应的json对象为空是删除掉该空余的模板
     * @param {string} tpl 模板原始字符
     * @return {string} 删除空模板后的模板
     * //todo: 待改进，改为正则匹配
     */
    var filterEmptyTemplate = function(tpl) {
        if (tpl.indexOf(TPL_LEFT) == -1) {
            return tpl;
        }
        var innerBeginIdx = null;
        var _getInnerTemplate = function(str) {
            var idx = str.indexOf(TPL_LEFT);
            if (idx != -1) {
                str = str.substr(idx + TPL_LEFT.length);
                innerBeginIdx += idx;
                _getInnerTemplate(str);
            }
            return str;
        };

        var _getFirstTagBeginIndex = function(str) { 
            innerBeginIdx = 0;
            if (str.indexOf(TPL_LEFT) != -1 ) {
                var tmp =  _getInnerTemplate(str);   
                return innerBeginIdx;
            }
            return str.indexOf(TPL_LEFT + TPL_LEFT.length);
        };

        var _getFirstTagEndIndex = function(str) {
            return str.indexOf(TPL_END) + TPL_END.length;
        };

        var _removeEmptyTemplate = function(str, beginIdx, endIdx) {
            var first = str.substr(0, beginIdx);
            var last  = str.substr(endIdx);
            return first + last;
        };
        var beginIdx = _getFirstTagBeginIndex(tpl);
        var endIdx   = _getFirstTagEndIndex(tpl);
        var tpl = _removeEmptyTemplate(tpl, beginIdx, endIdx);
        return filterEmptyTemplate(tpl);
    }; 

    var _removeEmptyTemplateTag = function(str) {
        // var TPL_LEFT = '<template'; 
        // var TPL_RIGHT = '</template>'; 
        var beginIdx = str.indexOf(TPL_LEFT);
        if (beginIdx < 0) { 
            return str;
        }
        var endIdx = str.indexOf(TPL_RIGHT) + TPL_RIGHT.length;
        var first = str.substr(0, beginIdx);
        var last  = str.substr(endIdx);
        return first + last;
    };

    /**
     * 
     * 根据子模板对象获得替换子模板部分变量后的新模板
     * 
     * @param {string} tpl 原始模板
     * @param {string} name 子模板名
     * @param {number} length 当前模板子模板数量
     * @param {object} json 含有模板键值对应的json
     * @return {string} 替换了子模板变量的新模板
     */ 
     var getContentBySubObject = function(tpl, name, length, json) {
        try {
         var subTplStr = '';        
         var parts = tpl.split(TPL_LEFT + name + TPL_RIGHT);
         var partA = parts[0];   
         if (parts.length <= 1) { 
             return tpl;
         }
         /**
          * 把一个模板的内容分为三份：
          *   - 第1份模板开始到某个子模板的name标记处
          *   - 第2份为子模板name开始到子模板结束
          *   - 第3份为子模板结束后至整个模板后部
          *   
          * 拼接过程：
          *   1. 根据子模板名查找到子模板开始标记处，标记以前作为partA，标记后作为partLast
          *   2. 将partLast按照子模板结束标记拆分成若干份保存为临时数组partArr，
          *      根据子模板下子模板们的个数和自身得到截取长度(length+1)
          *      把partArr按照截取长度拆分，之前的为partB，之后的为partC
          *   3. 将partB作为模板去替换当前模板的全部变量，得到替换我我直接量后的内容。通过这种方式，有外往里逐级替换直接量
          *   4. 返回partA + partB(替换变量后) + partC
          */
         var partArr   = parts[1].split(TPL_END);
         var partB     = partArr.splice(0, length + 1).join(TPL_END);
         var partC     = partArr.join(TPL_END);
         subTplStr = getByContent(partB, json);
         return partA + subTplStr + partC;
        } catch (ex) {   
            alert(ex);
        }
     };

    /**
     * 
     * 根据数组得内容 数组下只包括JSON对象
     * 
     * @param {string} tpl 模板原始字符
     * @param {object} arr 含有模板键值的数组
     * @return {string} 替换了变量后的模板内容
     */ 
     var getContentByArray = function(tpl, arr) {
        var tplArr  = new Array; 
        for (var i = 0, l = arr.length; i < l; i++) {            
            tplArr.push( getContentByObject(tpl, arr[i]) );               
        }
        return tplArr.join('');
     };
    
    /**
     * 从规则数组中循环获得内容，一共分为3种情况，第3种情况一般不使用。
     * 循环必须是规则数组
     * 1) 循环直接量  
     * 2) 循环匿名对象 
     * 3) 子模板(如果循环内容仅为一个对象，且对象里面不是直接量，暂仅支持嵌套一层直接量的子模板)
     *
     * @param {string} tpl 模板内容
     * @param {string} name 模板变量键值表
     * @param {string} value 模板对应的值
     */
    var getContentByLoop = function(tpl, name, value) {
        var loop = value;
        if (_isRealValueInArray(loop)) {            
            // 如果是直接量的循环
            tpl = mergeArray(tpl, name, loop);
            
        } else { 
            if (isSubTemplateInLoop && isSubTemplateInLoop(loop)) {
                // 如果是子模板，仅支持一层子模板，子模板不再支持嵌套
               var tplObj = isSubTemplateInLoop(loop);
//               logger.log(tplObj);
               tpl = mergeSubTemplateInLoop(tpl, name, tplObj.name, tplObj.json);
            } else { 
                // 否则就当作匿名对象的循环
                var item = null;
                for (var i = 0, l = loop.length; i < l; i++) {
                    for (item in loop[i] ) {
                        tpl = mergeLoopObject(tpl, name, value);
                    }
                }
            }
        }

       return tpl;
     };
    
   /**
    * 
    * 根据JSON数据找寻当前模板的子模板数量
    * 
    * @param {string} name 当前json名称
    * @param {object} json json确信是模板对象
    * @return {number} 同级模板数量以及子模板数量
    */
    var getSubTemplateLength = function(name, json) {
        if (name && json) {
            var template = json;
            if (isSubTemplate(template[name])) {
                subTemplateLength++;
            }

            for (var item in template) {
                if (isSubTemplate(template[item])) {
                    subTemplateLength++;
                    getSubTemplateLength.call(this, item, template[item]);
                } else if (isSubTemplateInLoop(template[item])) {
                    subTemplateLength++;
                }
            }
        }
        return subTemplateLength;
    };

    /**
     * 根据循环内容判断是否循环内嵌的子模板
     * 1) 循环直接量  2) 循环匿名对象 3) 循环子模板(如果循环内容仅为一个对象，且对象里面不是直接量)
     * 
     * 根据循环内的子模板内容合并为新模板，目前仅支持一层嵌套
     * 注意：循环嵌套子模板还需要处理内嵌子模板中循环的数量，需要遍历子循环
     *       同时还需要重新计算原子模板的深度，原计算方式不含有循环里面的子模板
     *
     * @param {string} loop 循环对象
     * @param {return} 如果是子模板则返回{name : 子模板名称, json : 子模板json串}，否则返回false
     */
     var isSubTemplateInLoop = function(loop) {
        for (var item in loop) {
            var subLoop = loop[item];
            for (var subItem in subLoop) {
                if(isTemplate(subLoop[subItem])) {
                    return {
                       'name' : subItem,
                       'json' : subLoop[subItem]
                    };
                }
            }
        }
        return false;
     };

    /**
     * 根据循环内的子模板内容合并为新模板。仅支持循环嵌套一个子模板，且该子模板下所有值均为直接量
     * 注意：循环嵌套子模板还需要处理内嵌子模板中循环的数量，需要遍历子循环
     *       同时还需要重新计算原子模板的深度，原计算方式不含有循环里面的子模板
     *       暂不支持多层嵌套
     *
     * @param {string} tpl 原始模板
     * @param {string} name 循环名称
     * @param {string} teplObjName 内嵌模板名字
     * @param {object} json 内嵌模板对应json串
     * @param {return} 新模板内容
     */
    var mergeSubTemplateInLoop = function(tpl, name, tplObjName, TplObjJson) {
        logger.log(TplObjJson);
        try {
            var parts = tpl.split(LOOP_LEFT + name + LOOP_RIGHT);
            if (parts.length <= 1) {
                return tpl;
            }

            // splite loop
            var partA = parts[0];   
            var loopEndIndex = parts[1].indexOf(LOOP_END);
            var partB = parts[1].substr(0, loopEndIndex);
            var partC = parts[1].substr(loopEndIndex +  LOOP_END.length, parts[1].length);
            // split sub template
            var subTplParts = partB.split(TPL_LEFT + tplObjName + TPL_RIGHT);
            if (subTplParts.length <= 1) { 
                return tpl;
            }
            var tplEndIndex = subTplParts[1].indexOf(TPL_END);
            var tplPartA = subTplParts[0];
            var tplPartB = subTplParts[1].substr(0, tplEndIndex);
            var tplPartC = subTplParts[1].substr(tplEndIndex +  TPL_END.length, subTplParts[1].length);

            // get content like normal Template
            var str   = '';
            var tplLoop = getContentByObject(tplPartB, TplObjJson);
            str = partA + tplPartA + tplLoop + tplPartC + partC;
            
            return str;

        } catch (ex) {   
            alert(ex);
        }    
    };
    

    /**
     * 合并模板对应键值的变量
     *
     * @param {string} tpl 模板内容
     * @param {object} tplHash 模板变量键值表
     * @return {string} 组成的模板字符串  
     */
    var mergeVar = function(tpl, tplHash) {
        try{
            var str    = '';
            var reg    = new RegExp(VAR_LEFT + '([.:a-z0-9_ ]+?)' + VAR_RIGHT, 'ig');
                str    = tpl.replace(reg, function(tpl, name, index) {
                    var name = Template.com.trim(name);
                    var value  = tplHash[name]; 
                    value = (value === null)? Template.config.NULL_VALUE : value;
                    value = (value === undefined) ? '' : value;
                    value = (!value) ? '' : value;
                    // value = (value === undefined)? tpl : value;
                    return value;
              });
            return str; 
        } catch (e) {   
            alert(e);
        }
     };
         
    /**
     * 循环合并模板中的数组直接量
     * 根据循环标记把模板内容切换成三份内容
     * 将中间部分的变量循环替换，最后返回合并后的内容
     *
     * @param {string} tpl 模板内容
     * @param {string} name 模板变量
     * @param {array} arr 数组数据
     */
    var mergeArray = function(tpl, name, arr) {
        try {
            var parts = tpl.split(LOOP_LEFT + name + LOOP_RIGHT);         
            if (parts.length <= 1) { 
                return tpl;
            }
            var partA = parts[0];   
            var loopEndIndex = parts[1].indexOf(LOOP_END);
            var partB = parts[1].substr(0, loopEndIndex);
            var partC = parts[1].substr(loopEndIndex +  LOOP_END.length, parts[1].length);
            
            var str     = '';
            var arrContent = new Array();
            // name = Template.com.trim(name);
            var reg = new RegExp( VAR_LEFT + '(.?\s*)' + name + '(.?\s*)' + VAR_RIGHT, 'ig');
                for (var i = 0, l = arr.length; i < l; i++) {
                    arrContent.push(partB.replace(reg, arr[i]));
            }
            str = partA + arrContent.join('') + partC;
            return str;

        } catch (ex) {   
            alert(ex);
        }
     };       
        
    /**
     * 合并循环模板中的匿名对象里面的变量
     * 根据循环标记把模板内容切换成三份内容
     * 将中间部分的变量循环替换，最后返回合并后的内容
     *
     * @param {string} tpl 模板内容
     * @param {string} name 模板变量
     * @param {array} arr 规则数组，成员是匿名对象 [{}, {}, {}]
     */
     var mergeLoopObject = function(tpl, name, arr) {
        try {
            var parts = tpl.split(LOOP_LEFT + name + LOOP_RIGHT);
            if (parts.length <= 1) { 
                return tpl;
            }
            var partA = parts[0];   
            var loopEndIndex = parts[1].indexOf(LOOP_END);
            var partB = parts[1].substr(0, loopEndIndex);
            var partC = parts[1].substr(loopEndIndex +  LOOP_END.length, parts[1].length);
            var str   = '';
            var arrContent = [];
            var reg = new RegExp();
            var tplHash = {};
            for (var i in arr) {
                for (j in arr[i]) {
                    reg = new RegExp(VAR_LEFT + j + VAR_RIGHT, 'ig');
                    tplHash[j] = arr[i][j];
                }
                arrContent.push(mergeVar(partB, tplHash));
            }
            str = partA + arrContent.join('') + partC;
            return str;

        } catch (ex) {
            alert(ex);
        }

     };
    
    /**
     * 设置模板分割符号，包括变量、循环、模板三种
     * 
     * @param {string} type 要设置的类型，包括:var, loop, template
     * @param {array}  arr  要设置的的内容数组，顺序为左、右、结束标记(变量的无结束标记)
     */
    var setDelimiter = function(type, arr) {
        if (!type || !(arr instanceof Array)) {
            return;
        }
        switch (type) {
             case 'var' :
               VAR_LEFT  = arr[0] ? arr[0] : VAR_LEFT;
               VAR_RIGHT = arr[1] ? arr[1] : VAR_RIGHT;
               Template.config.VAR_LEFT    = VAR_LEFT;
               Template.config.VAR_RIGHT   = VAR_RIGHT;
             break;
             case 'loop' :
               LOOP_LEFT  = arr[0] ? arr[0] : LOOP_LEFT;
               LOOP_RIGHT = arr[1] ? arr[1] : LOOP_RIGHT;
               LOOP_END   = arr[2] ? arr[2] : LOOP_END;
               Template.config.LOOP_LEFT    = LOOP_LEFT;
               Template.config.LOOP_RIGHT   = LOOP_RIGHT;
               Template.config.LOOP_END     = LOOP_END;
             break;
             case 'template' :
               TPL_LEFT  = arr[0] ? arr[0] : TPL_LEFT;
               TPL_RIGHT = arr[1] ? arr[1] : TPL_RIGHT;
               TPL_END   = arr[2] ? arr[2] : TPL_END;
               Template.config.TPL_LEFT    = TPL_LEFT;
               Template.config.TPL_RIGHT   = TPL_RIGHT;
               Template.config.TPL_END     = TPL_END;
             break;
        }        
    };
     
    return {
        get          : get,
        getById      : getById,
        getByContent : getByContent,
        parse        : parse,
        setDelimiter : setDelimiter
    };
}();


// 接口说明

/**
 * 通过模板ID或DOM查找内容来替换对应JSON数据，返回合并后的内容 
 * @param {HTMLElement|string} id或dom
 * @param {object} json json对象，变量名与值对象
 * @return {string} 对应id的模板内容
*/
Template.getById = Template.main.getById;

/**
 * 通过模板内容来替换对应JSON数据，返回合并后的内容
 * 
 * @param {string} tpl 模板字符串
 * @param {object} json json对象，变量名与值对象集合
 * @return {string} 替换变量后内容
*/
Template.getByContent = Template.main.getByContent;

/**
 * 
 * 通过ID/DOM或模板内容来替换变量快捷方法
 *
 * @param {string} idOrTpl 模板内容或模板ID或DOM
 * @param {object} json json对象，变量名与值对象
 * @return {string} 模板内容
 */
Template.get = Template.main.get;

/**
 * 解析模板内容，将对象内容添加到模板字串中
 * 将解析后的直接替换原模板块的父级对象
 * 并将原模板内容保存为TemplateSource对象中
 *
 * @param {HTMLElement|string} id或dom
 * @param {string} true|'save' 是否存原模板内容
 */
Template.parse = Template.main.parse;


/**
 * 解析模板资源，当一个模板资源内有多个模板块时
 * 可根据模板块名称来获得模板内容，主要用于异步加载的模板
 *
 * @param {string} source 模板资源内容，如整个页面内容
 * @param {string} name 模板块的名称，不能重名
 * @param {return} string 返回指定名称的模板块字符串
 */
Template.parseSource = Template.com.parseSource;

/**
 * 保存原始模板内容到Template.Data
 *
 * @param {string} name 要保存的名称
 * @param {string} tpl 模板内容
 */
Template.saveData = Template.com.saveData;
Template.setData = Template.com.saveData;

/**
 * 取出保存在Template.Data下原始模板
 *
 * @param {string} name 模板名称
 * @return {string} 模板内容
 */
Template.getData = Template.com.getData;

/**
 * 设置模板分割符号，包括变量、循环、模板三种
 * 
 * @param {string} type 要设置的类型，包括:var, loop, template
 * @param {array}  arr  要设置的的内容数组，顺序为左、右、结束标记(变量的无结束标记)
 */
Template.setDelimiter = Template.main.setDelimiter;
