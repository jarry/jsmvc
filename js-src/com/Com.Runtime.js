/**
 * Copyright 2012 Young Inc. All rights reserved.
 *
 * @class   JavaScript runtime for components of page
 * @name    Com
 * @file:   Com.Runtime.js
 * @path:   js-src/com
 * @desc:   JS runtime environment for components/widgets.
 *          <ol>
 *          <li>Com.create({}, {}) for creating component, the arguments include config and source.</li>
 *          <li>The config is plain object for declaration and dependencies, the source is class of prototype</li>
 *          <li>All selector must base on the element which is the outer container</li>
 *          <li>The widget is instance of component's class, they are being one collection</li>
 *          </ol>
 * @author: jarry
 * @date:   2012-12-24
 */

///import js-src/lib/
///import js-src/com/

(function(Com, $) {
    var root = window || this;
    var console = root.console;
    Com = Com || root.Com || {};
    Com.Component = {};
    Com.Runtime = {};
    $ = $ || root.$;
    var Clazz;
    var runtime;
    var Widget;
    // WidgetArrayList<Model>()
    var WidgetList, widgetList;
    // WidgetHashMap<Widget>()
    var WidgetRuntimeMap = {
        // 'uid' : new Widget()
    };
    var CONSTANT = {
        type: null,
        componentPrefix: 'com-',
        componentCSS: 'young-component'
    };
    var _isRunning = false;

    var _log = function() {
        if (console && console.log) {
            console.log.apply(console, Array.prototype.slice.call(arguments));
        }
    };

    var _util = {
        exports: function(obj, origin) {
            for (var item in origin) {
                if (item[0] !== '_' && _validator.isFunction(origin[item])) {
                    obj[item] = origin[item];
                }
            }
        },
        createUUID: (function(uuidRegEx, uuidReplacer) {
            return function() {
                return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(uuidRegEx, uuidReplacer).toLowerCase();
            };
        })(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }),

        equalsId: function(id, ids) {
            var len;
            if (ids !== undefined) {
                if (ids == id) {
                    return true;
                } else if (_validator.isArray(ids)) {
                    len = ids.length;
                    while (len--) {
                        if (ids[len] == id) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        /**
         * get component by com-id of className. element's className must contains com-xxx
         * @param {DOM element} element
         * @returns {DOM element}
         */
        getComponentId: function(element) {
            var className = element.className;
            var prefix = CONSTANT.componentPrefix;
            var reg = new RegExp(prefix + '.*', 'g');
            // var reg = new RegExp(prefix + '\\d+', 'g');
            var classes = className.split(' ');
            var id, result;
            for (var i = 0, l = classes.length; i < l; i++) {
                result = reg.exec(classes[i]);
                if (result) {
                    id = result[0].substr(prefix.length);
                    return id;
                }
            }
            _log(the + element + ',  id has not founded. ');
        },

        getComponentById: function(id) {
            return $('.' + CONSTANT.componentCSS + '.' + CONSTANT.componentPrefix + id)[0];
        },

        getAllComponents: function() {
            return $('.' + CONSTANT.componentCSS);
        }
    };

    var _validator = {
        isString: function(source) {
            return ('[object String]' == Object.prototype.toString.call(source));
        },
        isNumber: function(source) {
            return ('[object Number]' == Object.prototype.toString.call(source));
        },
        isArray: function(source) {
            return $.isArray(source);
        },
        isObject: function(source) {
            return $.isPlainObject(source);
        },
        isFunction: function(source) {
            return ('[object Function]' == Object.prototype.toString.call(source));
        },

        /**
         * validate the method 'create'
         * @param {object} config
         * @param {object} source
         * @returns {boolean}
         */
        isValidComponent: function(config, source) {
            if (!source || !config) {
                _log(source + ' is undefined', config + ' is undefined');
                return false;
            }
            if (config.id === undefined) {
                _log('config.id is undefined');
                return false;
            }
            if (!_validator.isObject(config)) {
                _log(config + 'it is not an object');
                return false;
            }
            if (!_validator.isObject(source)) {
                _log(source + 'it is not an object');
                return false;
            }
            if (!source.run || !_validator.isFunction(source.run)) {
                _log(source + ' has not the method `run`');
                return false;
            }
            return true;
        }
    };

    // Widget Model Collection
    WidgetList = function(model, options) {
        return this.init(model, options);
    };
    // WidgetList.prototype = Array.prototype;
    WidgetList.prototype.__ = {
        model: {
            id: 123456,
            element: $('</div>'),
            clazz: function() {},
            config: {}
        }
    };
    WidgetList.prototype.init = function(model, options) {
        $.extend(true, this.__.model, model);
        this.length = 0;
        this.toArray(options);
        return this;
    };
    WidgetList.prototype.valueOf = function() {
        return Array.prototype.slice.call(this);
    };
    WidgetList.prototype.shift = [].shift;
    WidgetList.prototype.push = [].push;
    WidgetList.prototype.sort = [].sort;
    WidgetList.prototype.pop = [].pop;
    WidgetList.prototype.splice = [].splice;
    WidgetList.prototype.concat = [].concat;
    WidgetList.prototype.slice = [].slice;
    WidgetList.prototype.size = function() {
        return this.length;
    };
    WidgetList.prototype.get = function(index) {
        return this[index];
    };
    WidgetList.prototype.getById = function(id) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (id == this[i].id) {
                return this.get(i);
            }
        }
    };
    WidgetList.prototype.validModel = function(item) {
        for (var prop in this.__.model) {
            if (!item.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };
    WidgetList.prototype.add = function(item) {
        if (item === undefined) {
            return;
        }
        var list = item instanceof Array ? item : [item];
        for (var i = 0, l = list.length; i < l; i++) {
            this.push(list[i]);
        }
    };
    WidgetList.prototype.set = function(index, item) {
        var list = this;
        if (index && index < this.length && item) {
            list[index] = item;
        }
    };
    WidgetList.prototype.update = function(origin, item) {
        var index = this.indexOf(origin);
        this.set(index, item);
    };
    WidgetList.prototype.insert = function(index, item) {
        var list = item instanceof Array ? item : [item];
        for (var i = 0, l = list.length; i < l; i++) {
            this.splice(index + 1, 0, list[i]);
        }
    };
    WidgetList.prototype.contains = function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (item !== undefined && item.id == this[i].id) {
                return true;
            }
        }
        return false;
    };
    WidgetList.prototype.indexOf = function(item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (item.id == this[i].id) {
                return i;
            }
        }
        return -1;
    };
    WidgetList.prototype.remove = function(start, end) {
        end = end || start + 1;
        return this.splice(start, end - start);
    };
    WidgetList.prototype.removeItem = function(item) {
        var index = this.indexOf(item);
        return this.remove(index);
    };
    WidgetList.prototype.clear = function() {
        this.empty();
        for (var item in this) {
            delete this[item];
        }
    };
    WidgetList.prototype.empty = function() {
        return this.remove(0, this.length);
    };
    WidgetList.prototype.toString = function() {
        return 'function Array(){\n   [variant code]\n}';
    };
    WidgetList.prototype.toArray = function(options) {
        return Array.prototype.slice.call(this, options);
    };
    WidgetList.prototype.constructor = WidgetList;

    var getWidgetList = function(model) {
        // _log(arguments.callee.caller);
        widgetList = widgetList || new WidgetList(model);
        return widgetList;
    };

    // Widget Model Class
    Widget = function(model, options) {
        options = options || {};
        $.extend(true, this, {
            id: null,       // component's ID, generated by server side
            element: null,  // component's HTMLElement
            config: null,   // config defined by developer
            clazz: null,    // clazz: function() {},
            instance: null  // instance of clazz()
        }, model);
        this.init(options);
    };
    Widget.prototype = {
        '__': {
            list: null
        },
        init: function(options) {
            this.__.list = options.ArrayList || getWidgetList();
            // if (!this.__.list || !(this.__.list instanceof WidgetList) ) {
            if (!this.__.list) {
                _log('Widget Model has not the collection ArrayList.');
                return;
            }
            $.extend(true, this, {
                element: this.getElement(),
                config: this.getConfig(),
                clazz: this.getClazz(),
                instance: this.getInstance(options.fresh)
            });
        },
        set: function(widget) {
            $.extend(this, widget);
        },
        get: function() {
            return this;
        },
        getElement: function() {
            return this.element || _util.getComponentById(this.id);
        },
        getConfig: function() {
            var list = this.__.list;
            var widget = list.getById(this.id) || {};
            return widget.config;
        },
        getClazz: function() {
            var list = this.__.list;
            var widget = list.getById(this.id) || {};
            return widget.clazz;
        },
        getInstance: function(fresh) {
            var list = this.__.list;
            fresh = fresh === undefined ? false : fresh;
            var widget = list.getById(this.id);
            if (!widget) {
                return;
            }
            if (fresh === true || !(widget.instance)) {
                widget.instance = widget.clazz ? new widget.clazz({}, this.getElement()) : null;
            }
            return widget.instance;
        },
        update: function(widget) {
            var list = this.__.list;
            var origin = list.getById(this.id);
            list.update(origin, widget);
        },
        remove: function() {
            var list = this.__.list;
            list.removeItem(list.getById(this.id));
        }
    };
    Widget.prototype.constructor = Widget;

    // Com.Runtime
    runtime = {

        /**
         * create one componet，include the two arguments: config, prototype
         * id type is number, className must contains com-xxx
         * @param {object} config
         * @returns {object} source
         * @usage 
                Com.create({
                    id: '__COMID__',  // will be replaced auto by server
                    depend: {id : 123456, method: 'foo', args: [1, 2]},
                    before: [123456]
                },{
                    element: null,
                    options: {},
                    construct: function() {
                        // initialzied
                    }
                    run: function(param) {
                        // run method
                    },
                    hello: function(param1, param2, callback) {
                        if ('function' === typeof callback) {
                            console.log(this.id + 'hello callback:', callback, callback.scope);
                            callback.call(callback.scope, this);
                        }
                    }
                });
         */
        create: function(config, source) {
            if (!_validator.isValidComponent(config, source)) {
                return;
            }

            if (getWidgetList().contains(getWidgetList().getById(config.id))) {
                _log('the component ' + config.id + ' is exsited.');
                return;
            }

            config.id = config.id > 0 ? config.id : config.id.toString().replace(/\D/g, '');

            Clazz = function(options, element) {
                // defined options
                this.options = $.extend(true, {}, source.options, options);
                // component id
                this.id = config.id;
                this.__config__ = config;
                // defined container
                this.element = element;
                this.$element = $(element);
                this.$container = this.$element;
                // copy properties and constants
                $.extend(true, this, source.properties, source.CONSTANTS);
                // defined contructor function
                this.construct = source.construct || source.init || function() {};
                this.construct.call(this);
            };

            // default property and method of prototype
            Clazz.prototype.constructor = Clazz;
            Clazz.prototype.find = function(selector) {
                return this.$element.find(selector);
            };

            // copy method to  prototype
            for (var name in source) {
                if (name !== 'options' && name !== 'properties' &&
                    name !== 'CONSTANTS') {
                    Clazz.prototype[name] = source[name];
                }
            }
            // add to WidgetList
            getWidgetList().add(
                new Widget({
                    id: config.id,
                    element: source.element,
                    clazz: Clazz,
                    config: config
                    // `instance` will be declared in WidgetRuntimeMap
                })
            );
        },

        getAllComponents: function() {
            return _util.getAllComponents();
        },

        getAll: function() {
            return WidgetRuntimeMap;
        },

        // if exist multiple runtime instance(added same components) of the ID
        // return the first instance according first HTML element
        getById: function(id) {
            for (var item in WidgetRuntimeMap) {
                if (WidgetRuntimeMap[item].id == id) {
                    return WidgetRuntimeMap[item];
                }
            }
        },

        getByComponent: function(element) {
            var uid = $(element).data('uid') || $(element).attr('data-uid');
            return WidgetRuntimeMap[uid] || runtime.getById(_util.getComponentId(element));
        },

        get: function(uid, id, element) {
            return WidgetRuntimeMap[uid] || runtime.getWidget(uid, id, element);
        },

        generateWidget: function(element, fresh) {
            var id = _util.getComponentId(element);
            var uid = _util.createUUID();
            $(element).data('uid', uid);
            runtime.getWidget(uid, id, element, fresh);
        },

        generateWidgets: function() {
            var $components = _util.getAllComponents();
            for (var i = 0, l = $components.length; i < l; i++) {
                runtime.generateWidget($components[i]);
            }
        },

        /** 
         * get widget from widgetruntime by component id and element
         * @function
         * @param {number} uid, the unique ID of runtime
         * @param {number} id, com-id of component
         * @param {HTML element} element, component's DOM
         * @param {boolean} fresh, re-initialize the orgin Clazz
         * @returns {Widget} contains the instance of orign Clazz
         */
        getWidget: function(uid, id, element, fresh) {
            uid = uid || $(element).data('uid');
            if (!WidgetRuntimeMap[uid] && getWidgetList().getById(id) !== undefined) {
                WidgetRuntimeMap[uid] = new Widget({
                    id: id,
                    element: element
                }, {
                    fresh: true
                });
            } else {
                // _log('the runtime\'s uid:', uid, ' and the widget id:', id, 'has not exsit. ');
            }
            return WidgetRuntimeMap[uid];
        },

        removeWidget: function(uid) {
            WidgetRuntimeMap[uid] = null;
            delete WidgetRuntimeMap[uid];
        },

        _printAll: function() {
            var widgets = runtime.getAll();
            var $components = runtime.getAllComponents();
            for (var widget in widgets) {
                _log(widget, widgets[widget]);
            }
            for (var i = 0, l = $components.length; i < l; i++) {
                _log($components[i]);
            }
            _log(getWidgetList(), WidgetRuntimeMap);
        },

        destory: function(uid) {
            runtime.removeWidget(uid);
        },

        /**
         * executing before execute the other's 'run()' synchronous
         * @function
         * @param {array|string|number} param = [id, 'id]
         * @returns {Widget} widget
         */
        before: function(param, widget) {
            var beforeWidget;
            if (!param) {
                return;
            }

            var _isConflict = function(beforeWidget, widget) {
                beforeWidget.config = beforeWidget.config || [];
                widget.config = widget.config || {};
                var before = beforeWidget.config.before;
                var after = beforeWidget.config.after;
                if (_util.equalsId(widget.config.id, before)) {
                    return true;
                }
                if (_util.equalsId(widget.config.id, after)) {
                    return true;
                }
                return false;
            };

            try {
                if (param == widget.config.id) {
                    _log(param + ' self conflict.');
                } else if (_validator.isNumber(param) || _validator.isString(param)) {
                    beforeWidget = runtime.getById(param);
                    // prevent called by self or circular references
                    if (!beforeWidget || _isConflict(beforeWidget, widget)) {
                        _log('circular references in:', beforeWidget, widget, ' or ' + param + ' has not exsited.');
                    } else {
                        runtime.runWidget(beforeWidget);
                    }
                } else if (_validator.isArray(param)) {
                    for (var i = 0, l = param.length; i < l; i++) {
                        runtime.before(param[i], widget);
                    }
                }
            } catch (e) {
                _log(e.message);
            }
        },

        after: function(param, widget) {
            if (!param) {
                return;
            }
            runtime.before(param, widget);
        },

        /**
         * executing before execute the method of the other component
         * call the 'run()' by the callback done.
         * @param {object} param = {
         *      id :xxxxx, method: 'hello', args: [1, 2]
         *  }
         * @returns {Widget} widget
         */
        depend: function(param, widget) {
            if (!param) {
                return;
            }
            var dependWidget, callback, method;
            var depend = {
                id: param,
                method: 'run',
                args: []
            };
            if (!_validator.isObject(param)) {
                depend.id = param;
            } else {
                depend = $.extend(depend, param);
            }
            dependWidget = runtime.getById(depend.id);
            method = dependWidget.instance[depend.method];
            callback = widget.instance.run;
            callback.scope = widget.instance;
            if (dependWidget && method) {
                if (_validator.isArray(depend.args)) {
                    depend.args.push(callback);
                    // depend.args = Array.prototype.slice.call(depend.args).concat(callback);
                }
                method.apply(dependWidget.instance, depend.args);
            }
        },

        runWidget: function(widget, param) {
            if (!widget || !widget.config) {
                return;
            }
            runtime.before(widget.config.before, widget);
            if (widget.config.depend && widget.config.depend.id) {
                runtime.depend(widget.config.depend, widget);
            } else {
                widget.instance.run(param);
            }
            runtime.after(widget.config.after, widget);
        },

        init: function(options) {
            runtime.generateWidgets();
            // runtime._printAll();
        },

        runAll: function() {
            var widgets = runtime.getAll();
            for (var uid in widgets) {
                if (widgets[uid].clazz) {
                    runtime.runWidget(widgets[uid]);
                }
            }
        },

        isRunning: function () {
            return _isRunning;
        },

        /**
         * run method
         * @function
         * @param {object|string} options
         * options: {
         *      type: 'topic|home|play',  // page
         *      componentPrefix: 'com-',  // css prefix
         *      componentCSS: 'young-component' // css
         *  }
         */
        run: function(options) {
            if (!_validator.isObject(options)) {
                options = {
                    type: options
                };
            }
            $.extend(CONSTANT, options);
            $.extend(true, _util, options.util);
            // avoid repeating run
            if (runtime.isRunning()) {
                _log('runtime is running, do not repeat to run.');
            }
            if (options.forcedRun === true) {
                _log('runtime will be running forced.');
            }
            if (options.forcedRun === true || !(runtime.isRunning())) {
                $(function() {
                    runtime.init(options);
                    runtime.runAll();
                    _isRunning = true;
                });
            }
        }
    };

    // open the method from external scope
    _util.exports(Com.Runtime, runtime);
    Com.create = Com.Component.create = Com.Runtime.create;
    Com.run = Com.Component.run = Com.Runtime.run;

})(Com, jQuery);