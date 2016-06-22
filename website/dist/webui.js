$.webui = $.webui || {};
$.extend( $.webui, {
	version: "0.1.1",
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});
jQuery.fn.extend({
    inputing: function(callback, delay){
        if(!delay){
            delay = 300;
        }
        var timer = null;
        this.keyup(function(){
            if(timer !== null){
                clearTimeout(timer);
            }
            timer = setTimeout(callback, delay);
        });
        return this;
    },
    horizontalForm: function(){
        this.find(".form-group")
            .each(function(){
                var $this = $(this);
                var parentWidth = $this.parent().width();
                var labelWidth = $this.find(".control-label").outerWidth() || 0;
                $this.find(".control-input").outerWidth(parentWidth - labelWidth - 30);
            });
    },
    caret: function(begin, end) {
		var range;

		if (this.length === 0 || this.is(":hidden")) {
			return;
		}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function() {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	}    
});
jQuery.extend({
    
    resolveUrl: function(path, param){
        var query = "";
        if(param){
            query = $.param(param);
        }
        if($.baseUrl === undefined){
            $.baseUrl = "";
        }
        if(path.indexOf("?") > -1){
            return $.baseUrl + path + query;
        }
        else{
            return $.baseUrl + path + "?" + query;
        }
    },
    toJSON: function(json){
        return JSON.stringify(json);
    },
    formatDate: function(date){
        if(!date){
            return "";
        }
        else if(typeof(date) === "string"){
            return date.split("T")[0];
        }
        else if(typeof(date) === "object"){
            return fecha.format(date, "YYYY-MM-DD");
        }
        return "";
    },
    formatDateTime: function(date){
        if(!date){
            return "";
        }
        else if(typeof(date) === "string"){
            date = date.replace("T", " ");
            if(date.length > 16){
                date = date.substring(0, 16);
            }
        }
        else if(typeof(date) === "object"){
            date = fecha.format(date, "YYYY-MM-DD hh:mm");
        }
        return date;
    },
    toISODate: function(value){
        if(!value){
            return "";
        }
        else if(typeof(value) === "string"){
            return $.trim(value);
        }
        else if(typeof(value) === "object"){
            return fecha.format(value, "YYYY-MM-DD");
        }
        return "";
    },
    toISODateTime: function(value){
        if(!value){
            return "";
        }
        else if(typeof(value) === "string"){
            return $.trim(value).replace(" ", "T");
        }
        else if(typeof(value) === "object"){
            return fecha.format(value, "YYYY-MM-DDThh:mm");
        }
        return "";
    },
    download: function(url){
        if(!$(".__downloadIFrame").length){
            $("body").append("<iframe class='__downloadIFrame' style='display:none'></iframe>");
        }
        $(".__downloadIFrame").attr("src", url);
    },
    format: function(source, params) {
        if ( arguments.length == 1 )
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply( this, args );
            };
        if ( arguments.length > 2 && params.constructor != Array  ) {
            params = $.makeArray(arguments).slice(1);
        }
        if ( params.constructor != Array ) {
            params = [ params ];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    },
    getProperty: function(name, scope){
        if(!scope){
            scope = window;
        }
        for(var n in name.split(",")){
            scope = scope[n];
        }
        return scope;
    }
});

// is extend
jQuery.extend({
    isString: function(s){
        return is.string(s);
    },
    isRegex: function(r){
        return is.regexp(r);
    },
    isDateString: function(d){
        return /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/.test(d);
    },
    isDateTimeString: function(d){
        return /^[0-9]{4}[-][0-9]{2}[-][0-9]{2} [0-9]{2}:[0-9]{2}$/.test(d);
    },
    isObject: function(o){
        var type = typeof o;
        return type === 'object' && !!o;
    }
});
$.ajaxSetup ({
    cache: false
});

Array.prototype.find = function(action){
    var value;
    $.each(this, function(){
        if(action(this)){
            value = this;
            return false;   
        }
    });
    return value;
};
Array.prototype.sum = function(prop){
    var sumValue = 0, tempValue;
    $.each(this, function(){
        tempValue = prop(this);
        if($.isNumeric(tempValue)){
            sumValue += prop(this);
        }
    });
    return sumValue.toFixed(2);
};
(function($){
    $.widget("webui.mask", {
            options: {
                pattern: null,
                definitions: {'9': /[0-9]/, 'a': /[A-Za-z]/, '*': /[A-Za-z0-9]/},
                placeholder: "_"
            },
            _create: function(){
                var thiz = this, $element = this.element, input = this.element.data("input");
                this._pattern = this.options.pattern;
                this._definitions = this.options.definitions;
                this._placeholder = this.options.placeholder;
                this._patternRegexes = [];
                this._patternChars = [];
                this._patternPlaceholder = "";

                this._initPattern();
                $element.keydown(function(e){
                    var pos, deleteLength, deleteIndex;
                    if(e.which == $.webui.keyCode.BACKSPACE){
                        pos = $element.caret(); 
                        deleteLength = pos.end - pos.begin; 
                        deleteIndex = pos.begin - 1;
                        thiz._delete(deleteIndex, deleteLength);
                        return false;
                    }
                    else if(e.which == $.webui.keyCode.DELETE){
                        pos = $element.caret(); 
                        deleteLength = pos.end - pos.begin; 
                        deleteIndex = pos.begin;
                        thiz._delete(deleteIndex, deleteLength);
                        return false;
                    }
                });

                $element.keypress(function(e){
                    var char = String.fromCharCode(e.which);
                    if(thiz._validteInputChar(char)){
                        thiz._insert(char);
                    }
                    return false;
                });

                $element.blur(function(e){
                    var val = $element.val();
                    if(val === thiz._patternPlaceholder){
                        input.setValue("");
                        input.changed();
                    }
                });
            },
            _initPattern: function(){
                var definition, definitionPattern = "", splitChar;
                this._definitions[this._placeholder] = new RegExp(this._placeholder);
                for(i = 0; i < this._pattern.length; i ++){
                    definition =  this._definitions[this._pattern.charAt(i)];
                    if(definition){
                        this._patternRegexes.push(definition);
                        this._patternPlaceholder += this._placeholder;
                    }
                    else{
                        splitChar = this._pattern.charAt(i);
                        this._patternRegexes.push(new RegExp(splitChar));
                        this._patternChars.push(splitChar);
                        this._patternPlaceholder += splitChar;
                    }
                }
            },
            _delete: function(deleteIndex, deleteLength){
                var value = this.element.val(),
                    inputChars = value.split("");
                if(deleteLength <= 0){
                    deleteLength = 1;
                }
                if(deleteIndex < 0){
                    deleteIndex = 0;
                }
                inputChars.splice(deleteIndex, deleteLength);
                value = inputChars.join("");
                value = this._format(inputChars);
                this.element.val(value);
                this.element.caret(deleteIndex);
            },
            _insert: function(insertChar){
                var pos = this.element.caret(),
                    value = this.element.val(),
                    inputChars = value.split(""), deleteLength = pos.end - pos.begin, insertIndex = pos.begin;
                if(deleteLength <= 0){
                    deleteLength = 1;
                }
                //如果字符不是格式化字符
                while(insertIndex < this._pattern.length && !this._isMaskChar(insertIndex)){
                    insertIndex ++;
                }
                inputChars.splice(insertIndex, deleteLength, insertChar);
                value = this._format(inputChars);
                this.element.val(value);
                insertIndex ++;
                while(insertIndex < this._pattern.length && !this._isMaskChar(insertIndex)){
                    insertIndex ++;
                }
                this.element.caret(insertIndex);
            },
            _format: function(inputChars){
                var patternRegex, patternChar, patternChars,
                    definition, formatChars = [], formatChar, inputChar, i;
                patternChars = this._patternChars.slice(0);
                //203-00-11 203s-00-11 9999-99-99
                patternChar = patternChars.shift();
                inputChar = inputChars.shift();
                for(i = 0; i < this._patternRegexes.length; i ++){
                    patternRegex =  this._patternRegexes[i];
                    formatChar = this._placeholder;
                    if(patternRegex.test(inputChar)){
                        //匹配成功接收输入字符，并且替换输入字符
                        formatChar = inputChar;
                        inputChar = inputChars.shift();
                        //如果是分割字符，替换分割字符
                        if(patternRegex.test(patternChar)){
                            patternChar = patternChars.shift();
                        }
                    }
                    else{
                        //如果是分割字符替换分割字符并且替换分割字符，否则为设置为待输入字符
                        if(patternRegex.test(patternChar)){
                            formatChar = patternChar;
                            patternChar = patternChars.shift();
                        }
                        else{
                            formatChar = this._placeholder;
                            //如果输入不是分割字符就替换输入字符
                            if(inputChar !== patternChar){
                                inputChar = inputChars.shift();
                            }
                        }
                    }
            
                    formatChars.push(formatChar);
                }
                return formatChars.join("");
            },
            //是格式化字符
            _isMaskChar: function(index){
                return this._pattern[index] in this._definitions;
            },
            //验证输入字符
            _validteInputChar: function(char){
                for(var i = 0; i < this._patternRegexes.length; i++){
                    if(this._patternRegexes[i].test(char)){
                        return true;
                    }
                }
                return false;
            }
        }
    );    
})(jQuery);

(function($){
    var inputValidators = {
        email: function(input, value){
            var result = false;
            result = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);
            return result;
        }
    };
    $.widget("webui.input", {
            options: {

            },
            _create: function(){
                this.element.data("input", this);
                var thiz = this;
                this._changedEvents = [];
                this._initOptions();
                this._createTextElement();
                this._createMessagePopover();
                this._onCreated();
                if(this.element.is(":input")){
                    this.element.change(function(){
                        thiz._changed();
                    });
                }
                this.reset();
            },
            _initOptions: function(){
                this._name = this.options.name || this.element.attr("name");
                this._defaultValue = this.options.defaultValue || this.element.data("defaultValue");
                this._required = this.options.required || this.element.data("required");
                this._requriedMessage = this.options.requiredMessage || this.element.data("requiredMessage");
                this._readonly = this.options.readonly || this.element.data("readonly");
                this._validator = this.options.validator || this.element.data("validator");
                var render = this.options.render || this.element.data("render");
                if(typeof(render) === "string"){
                    this._render = $.webui.__renders[render];
                    if(!this._render){
                        this._render = window[render];
                    }
                }
                else if(typeof(render) === "function"){
                    this._render = render;
                }
            },
            _createTextElement: function(){
                this._textElement = $("<p style=\"display: none\" class=\"form-control-static\"></p>");
                this.element.after(this._textElement);
            },
            _createMessagePopover: function(){
                this.element.popover({"content": "", placement: "auto top", trigger: "manual", container: "body"});
            },
            _onCreated: function(){
                
            },
            reset: function(){
                this.setValue(this._defaultValue);
                this.setReadonly(this._readonly);
            },
            _onChanging: function(){
                
            },
            _changed: function(){
                this._onChanging();
                var thiz = this;
                this.validate();
                var value = this.getValue();
                $.each(this._changedEvents, function(){
                    this(thiz, value);
                });
            },
            changed: function(callback){
                if(callback){
                    this._changedEvents.push(callback);
                }
                else{
                    this._changed();
                }
            },
            inputing: function(callback, delay){
                var thiz = this;
                this.element.inputing(function(){
                    var value = thiz.getValue();
                    callback(thiz, value);
                }, delay);
            },
            getName: function(){
                return this._name;
            },
            setError: function(error){
                if(error){
                    this.element.closest(".form-group").addClass("has-error");
                }
                else{
                     this.element.closest(".form-group").removeClass("has-error");
                }
            },
            popMessage: function(message){
                this.element.attr('data-content', message).popover('show');
            },
            hidePopMessage: function(){
                this.element.popover('hide');
            },
            _validateRequired: function(value){
                if(this._required && value === null){
                    if(this._requriedMessage && !this._tryValidating){
                        $.messageBox.info(this._requriedMessage);
                    }
                    return false;
                }
                return true;
            },
            _validateValidator: function(value){
                var func;
                if($.isString(this._validator)){
                    if(this._validator in inputValidators){
                        func =  inputValidators[this._validator];
                    }
                    else{
                        func = window[this._validator];
                    }
                    if($.isFunction(func)){
                        return func(this, value);
                    }
                    else{
                        throw this._validator + " is not function!";
                    }
                }
                else if($.isFunction(this._validator)){
                    return this._validator(this, value);
                }
                else if($.isRegex(this._validator)){
                    return this._validator.test(value);
                }
                return true;
            },
            validate: function(){
                var value = this.getValue(), result = null;
                result = this._validateRequired(value);
                if(result && value !== null){
                    result = this._validateValidator(value);
                }
                if(!this._tryValidating){
                    this.setError(!result);
                }
                return result;
            },
            tryValidate: function(){
                var result = false;
                this._tryValidating = true;
                try{
                    result = this.validate();
                }
                catch(e){
                    
                }
                this._tryValidating = false;
                return result;
            },
            focus: function(){
                if(this.element.css("display") !== "none"){
                    this.element.focus();
                }
            },
            setDefaultValue: function(value){
                this._defaultValue = value;
                this.setValue(value);
            },
            getDefaultValue: function(){
                return this._defaultValue;
            },
            setValue: function(value){
                this._setValue(value);
            },
            _setValue: function(value){
                var text = this._getText(value);
                this.element.val(value);
                this._textElement.html(text);
            },
            _getText: function(value){
                var text = value;
                if(jQuery.isFunction(this._render)){
                    text = this._render(value);
                }
                return text;
            },
            getValue: function(){
                var value = this.element.val();
                value = jQuery.trim(value);
                if(value){
                    return value;
                }
                return null;
            },
            setRequired: function(required){
                this._required = required;
            },
            getRequired: function(){
                return this._required;
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
                if(this._readonly){
                    this._textElement.show();
                    this.element.hide();
                }
                else{
                    this._textElement.hide();
                    this.element.show();
                }
            },
            getReadonly: function(){
                return this._readonly;
            }
        }
    );

    $.webui.__renders = {
        int: function(value){
            if($.isNumeric(value)){
                return value.toFixed(0);
            }
            return value;
        },
        number1: function(value){
            if($.isNumeric(value)){
                return value.toFixed(1);
            }        
            return value;
        },
        number2: function(value){
            if($.isNumeric(value)){
                return value.toFixed(2);
            }
            return value;
        },
        shifou: function(value){
            return value ? "是" : "否";
        },
        name: function(value){
            if($.isArray(value)){
                value = $.map(value, function(obj){
                    return obj.name;
                });
                return value.toString();
            }
            else if(value){
                return value.name;
            }
            return "";
        },
        nameMultiRow: function(value){
            if($.isArray(value)){
                value = $.map(value, function(obj){
                    return obj.name;
                });
                return value.join("<br />");
            }
            return "";
        },
        date: function(value){
            return $.formatDate(value);
        },
        dateRange: function(value){
            if(value){
                if(value.start === null && value.end !== null){
                    return  $.formatDate(value.end) + "以前";
                }
                else if(value.start !== null && value.end === null){
                    return  $.formatDate(value.start) + "以后";
                }
                else{
                    return $.formatDate(value.start) + "到" + $.formatDate(value.end);
                }
            }
            return "";
        },
        dateTime: function(value){
            if(value){
                return  $.formatDateTime(value);
            }
            return "";
        },
        dateTimeRange: function(value){
            if(value){
                if(value.start === null && value.end !== null){
                    return  $.formatDateTime(value.end) + "以前";
                }
                else if(value.start !== null && value.end === null){
                    return  $.formatDateTime(value.start) + "以后";
                }
                else{
                    return $.formatDateTime(value.start) + "到" + $.formatDateTime(value.end);
                }
            }
            return "";
        }
    };
})(jQuery);
(function($){
    $.widget("webui.selectInput", $.webui.input, {
            _load: function(){
                var thiz = this;
                this._textField = this.options.textField || this.element.data("textField") || "text";
                this._valueField = this.options.valueField || this.element.data("valueField") || "value";
                this._source = this.options.source || this.element.data("source");
                if($.isString(this._source)){
                    this._source = eval(this._source);
                }
                
                if($.isArray(this._source)){
                    this.setSource(this._source);
                }
                else if($.isObject(this._source)){
                    this.setSource(this._source);
                }
            },
            setSource: function(source){
                var thiz = this;
                this.element.empty();
                this._items = [];
                if($.isArray(source)){
                    $.each(source, function(i, s){
                        if(s.group && s.source && s.source.length){
                            thiz._appendGroup(s.group);
                            $.each(s.source, function(_i, _s){
                                thiz._appendItem(_s);
                            });
                        }
                        else{
                            thiz._appendItem(s);
                        }
                    });
                }
                this._sourceChanged();
            },
            _sourceChanged: function(){
            
            },
            _appendGroup: function(text){
                var element = this._getGroupElement(text);
                if(element){
                    this.element.append(element);
                }
            },
            _getGroupElement: function(text){
                
            },
            _appendItem: function(item){
                var text, value;
                this._items.push(item);
                text = this._getItemText(item);
                value = this._getItemValue(item);
                
                var element = this._getSelectElement(value, text);
                this.element.append(element);
            },
            _getSelectElement: function(value, text){
                return "<div></div>";
            },
            _getText: function(value){
                var item = this._findItemByValue(value);
                var text = this._getItemText(item);
                if(!text){
                    return value;
                }
                return text;
            },
            _getItemValue: function(item){
                if($.isObject(item)){
                    return item[this._valueField];
                }
                else{
                    return item;
                }
            },
            _getItemText: function(item){
                if($.isObject(item)){
                    return item[this._textField];
                }
                else{
                    return item;
                }
            },
            _findItemByValue: function(value){
                var thiz = this, item;
                if(this._items){
                    $.each(this._items, function(i, _item){
                        if(thiz._getItemValue(_item) === value){
                            item = _item;
                            return false;
                        }
                    });
                }
                return item;
            }
        }
    );
})(jQuery);

(function($){
 $.widget("webui.hiddenInput", $.webui.input, {
            options: {
                name: null
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
            },
            getReadonly: function(){
                return this._readonly;
            }
        }
    );  
})(jQuery); 
(function($){
 $.widget("webui.textbox", $.webui.input, {
            options: {
                required: false,
                suggestions: null,
                name: null,
                defaultValue: null
            },
            _onCreated: function(){
                var regex = this.options.regex || this.element.data("regex");
                this._regexMessage = this.options.regexMessage || this.element.data("regexMessage");
                this._suggestions = this.options.suggestions || this.element.data("suggestions");
                
                if(this._suggestions){
                    this._createSuggestion();
                }
                if(regex){
                    this._regex = new RegExp(regex);
                }
            },
            _getSuggestionValue: function(item){
                var multipleSymbolEndRegex = /[,，、\\；;]$/,
                    multipleSymbolRegex = /[,，、\\；;]\s*/;
                var val = this.element.val();
                if (multipleSymbolEndRegex.test(val)) {
                    val = val + item.text;
                }
                else if (multipleSymbolRegex.test(val)) {
                    var splitVal = val.split(multipleSymbolRegex);
                    splitVal[splitVal.length - 1] = item.text;
                    val = splitVal.join(',');
                }
                else {
                    val = item.text;
                }

                return val;
            },
            _createSuggestion: function () {
                var thiz = this;
                this._autocomplete = this.element.autocomplete({
                    source: this._suggestions,
                    "select": function (e, item) {
                        var val = thiz._getSuggestionValue(item);
                        $(this).val(val);
                        thiz.changed();
                        return false;
                    }
                }).data("autocomplete");
            },           
            setSuggestions: function(suggestions){
                this._suggestions = suggestions;
                this._autocomplete.setSource(this._suggestions);
            }
        }
    );  
})(jQuery); 
(function($){
    $.widget("webui.dateInput", $.webui.input, {
            options: {
                required: false,
                name: null,
                defaultValue: null
            },
            _onCreated: function(){
                var thiz = this;
                this.element.datepicker({
                        format: "yyyy-mm-dd",
                        language: "zh-CN",
                        todayHighlight: true,
                        autoclose: true
                    })
                    .inputing(function(){
                        thiz._changed();
                    }, 0)
                    .mask({pattern: "9999-99-99"});
                this._validator = function(input, value){
                    return $.isDateString(thiz.element.val());
                };
            },
            getValue: function(){
                var value = this.element.val();
                if(value){
                    return $.toISODate(value);
                }
                return null;
            },
            setValue: function(value){
                var dateFormat = $.formatDate(value);
                this.element.val(dateFormat);
                this._textElement.html(dateFormat);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.checkboxList", $.webui.selectInput, {
            _onCreated: function(){
                var thiz = this;
                this.element.find("input").click(function(){
                    thiz._changed();
                });
                this._load();
            },
            getValue: function(){
                var value = this.element.find(":checked")
                    .map(function(){
                        return $(this).val();
                    })
                    .get();
                if(value.length){
                    return value;
                }
                else{
                    return null;
                }
            },
            setValue: function(value){
                if(value){
                    this.element.find("input").each(function(){
                        var index = $.inArray($(this).val(), value);
                        $(this).prop("checked", index > -1);
                    });

                    this._textElement.html(value.toString());
                }
                else{
                    this.element.find("input").each(function(){
                        $(this).prop("checked", false);
                    });

                    this._textElement.html("");
                }
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
                this.element.find("input").prop("disabled", readonly);
            },
            _getSelectElement: function(value, text){
                return $.format("<label class='checkbox-inline'><input type='checkbox' value='{0}'/> {1}</label>", value, text);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.dateRangeInput", $.webui.input, {
            _onCreated: function(){
                var thiz = this, inputs;
                inputs = this.element.find("input");
                this._startInput = inputs.eq(0).dateInput().data("dateInput");
                this._endInput = inputs.eq(1).dateInput().data("dateInput");
                inputs.change(function(){
                    thiz._changed();
                });
            },
            validate: function(){
                var value = this.getValue(), result = null;
                
                result = this._validateRequired(value);
                if(result && value){
                    result = this._startInput.validate() && this._endInput.validate();
                }
                if(result){
                    result = this._validateRange(value);
                }
                this.setError(!result);
                return result;
            },
            _validateRange: function(value){
                var result = true;
                if(value && value.start && value.end && new Date(value.start) > new Date(value.end)){
                    result = false;
                    this.popMessage("最小值不能大于最大值！");
                }
                else{
                    this.hidePopMessage();
                }
                return result;
            },
            focus: function(){
                this._startInput.focus();
            },
            getValue: function(){
                var start = this._startInput.getValue();
                var end = this._endInput.getValue();
                if(start || end){
                    return {start: start, end: end};
                }
                return null;
            },
            setValue: function(value){
                var start = null, end = null;
                if(value){
                    start = value.start;
                    end = value.end;
                }
                this._startInput.setValue(start);
                this._endInput.setValue(end);
                start = $.formatDate(start);
                end = $.formatDate(end);
                this._textElement.html(start + " 到 " + end);
            }
        }
    );
})(jQuery);
(function($){

    $.widget("webui.form", {
            options: {
                sections: null
            },
            _create: function(){
                var thiz = this;
                this._value = {};
                this._inputs = {};
                
                $.each($.webui.form.inputTypes, function(i, inputType){
                    var inputName = inputType.name, 
                        inputs = thiz.element.find(inputType.selector),
                        input;
                    if(inputs.length){
                        if(! inputs[inputName]){
                            throw $.format("{0} widget not found!", inputName);
                        }
                        inputs.each(function(){
                            //init jquery widget
                            input = $(this)[inputName]().data(inputName);
                            thiz._inputs[input.getName()] = input;
                        });
                    }
                });
            },
            getValue: function(){
                var inputValues = {};
                $.each(this._inputs, function(name, input){
                    inputValues[name] = input.getValue();
                });
                $.extend(this._value, inputValues);
                return this._value;
            },
            setValue: function (value) {
                this._value = value;
                for(var name in value){
                    if(name in this._inputs){
                        this._inputs[name].setValue(value[name]);
                    }
                }
            },
            setDefaultValue: function(value){
                $.extend(this._value, value);
                for(var name in value){
                    if(name in this._inputs){
                        this._inputs[name].setDefaultValue(value[name]);
                    }
                }
            },
            setReadonly: function(readonly){
                $.each(this._inputs, function(name, input){
                    input.setReadonly(readonly);
                });
            },
            reset: function(){
                this._value = {};
                $.each(this._inputs, function(name, input){
                    input.reset();
                });
            },
            validate: function(container){
                var invalidInputs = [];
                var inputs = this._inputs;
                if(container){
                    inputs = this.getInputs(container);
                }
                $.each(inputs, function(name, input){
                    if(!input.validate()){
                        invalidInputs.push(input);
                    }
                });
                if(invalidInputs.length > 0){
                    invalidInputs[0].focus();
                    return false;
                }
                return true;
            },
            getInput: function(name){
                return this._inputs[name];
            },
            setInput: function(name, input){
                this._inputs[name] = input;
            },
            getInputs: function(container){
                var inputs = [];
                $.each($.webui.form.inputTypes, function(i, inputType){
                    var inputName = inputType.name, 
                        input;
                    container.find(inputType.selector).each(function(){
                        input = $(this).data(inputName);
                        inputs.push(input);
                    });
                });
                return inputs;
            },
            changed: function(callback){
                $.each(this._inputs, function(name, input){
                    input.changed(function(_input, value){
                        callback(_input, value);
                    });
                });
            },
            inputing: function(callback, delay){
                $.each(this._inputs, function(name, input){
                    input.inputing(function(_input, value){
                        callback(_input, value);
                    }, delay);
                });
            }
        }
    );
    
    $.webui.form.inputTypes = [
        {name: "hiddenInput", selector: ".webui-hidden"},
        {name: "checkboxList", selector: ".webui-checkboxList"},
        {name: "dateInput", selector: ".webui-dateInput"},
        {name: "dateRangeInput", selector: ".webui-dateRangeInput"},
        {name: "numberInput", selector: ".webui-numberInput"},
        {name: "numberRangeInput", selector: ".webui-numberRangeInput"},
        {name: "radioList", selector: ".webui-radioList"},
        {name: "simpleSelect", selector: ".webui-simpleSelect"},
        {name: "textarea", selector: ".webui-textarea"},
        {name: "textbox", selector: ".webui-textbox"},
        {name: "complexSelect", selector: ".webui-complexSelect"},
        {name: "datagrid", selector: ".webui-datagrid"},
        {name: "boolRadio", selector: ".webui-boolRadio"},
        {name: "boolCheckbox", selector: ".webui-boolCheckbox"},
        {name: "label", selector: ".webui-label"},
        {name: "dateTimeInput", selector: ".webui-dateTimeInput"},
        {name: "dateTimeRangeInput", selector: ".webui-dateTimeRangeInput"},
        {name: "multiFileUpload", selector: ".webui-multiFileUpload"}
    ];

})(jQuery);

(function($){
    $.widget("webui.numberInput", $.webui.input, {
            options: {
                required: null,
                name: null,
                max: null,
                min: null,
                precision: null,
                defaultValue: null,
                zeroEqualEmpty: false
            },
            _onCreated: function(){
                this._zeroEqualEmpty = this.element.data("zeroEqualEmpty") || this.options.zeroEqualEmpty;
                this._precision = this.options.precision || this.element.data("precision");
                this._max = this.options.max || this.element.data("max");
                this._min = this.options.min || this.element.data("min");
                if(this._precision > 0){
                    this._numberRegex = new RegExp($.format("^[-,+]?[0-9]+(.[0-9]{0,{0}})?$", this._precision));
                }
                else{
                    this._numberRegex = new RegExp("(^[-,+]?[1-9][0-9]*$)|0");
                }
            },
            validate: function(){
                var value = $.trim(this.element.val()), result = null;
                result = this._validateFormat(value);
                value = this.getValue();
                if(result){
                    result = this._validateValidator(value);
                }
                if(result){
                    result = this._validateRange(value);
                }
                if(result){
                    result = this._validateRequired(value);
                }
                
                this.setError(!result);
                return result;
            },
            _validateRequired: function(value){
                var valid = true;
                if(this._required){
                    if(value === null){
                        valid = false;
                    }
                    if(this._zeroEqualEmpty && value === 0){
                        valid = false;
                    }
                }
                if(!valid && this._requriedMessage){
                    $.messageBox.info(this._requriedMessage);
                }
                return valid;
            },
            _validateFormat: function(value){
                var result = true;
                if(value){
                    if(!this._numberRegex.test(value)){
                        result = false;
                        this.popMessage("格式错误！");
                    }
                    else{
                        this.hidePopMessage();
                    }
                }
                return result;
            },
            _validateRange: function(value){
                var result = true;
                if(value){
                    value = parseFloat(value);
                    if((value > this._max) || (value < this._min)){
                        result = false;
                        this.popMessage("不能超出范围:"+ this._min + "-" + this._max);
                    }
                    else{
                        this.hidePopMessage();
                    }
                }
                return result;
            },
            getValue: function(){
                var value = this.element.val();
                value = parseFloat(value);
                if(!$.isNumeric(value)){
                    value = null;
                }
                if(this._zeroEqualEmpty && value === null){
                    value = 0;
                }
                return value;
            },
            setValue: function(value){
                var text = "";
                value = parseFloat(value);
                if($.isNumeric(value)){
                    text = value.toFixed(this._precision);
                }
                else{
                    text = "";
                }
                if(value === 0 && this._zeroEqualEmpty){
                    text = "";
                }
                this.element.val(text);
                this._textElement.html(text);
            }
        }
    );
})(jQuery);

(function($){
    $.widget("webui.numberRangeInput", $.webui.input, {
            options: {
                required: null,
                name: null,
                defaultValue: null
            },
            _onCreated: function(){
                var thiz = this, inputs;
                inputs = this.element.find("input");
                this._minInput = inputs.eq(0);
                this._maxInput = inputs.eq(1);
                inputs.change(function(){
                    thiz._changed();
                });
            },
            validate: function(){
                var value = this.getValue(), result = null;
                result = this._validateRequired(value);
                if(result){
                    result = this._validateValidator(value);
                }
                if(result){
                    result = this._validateRange(value);
                }
                this.setError(!result);
                return result;
            },
            _validateRange: function(value){
                var result = true;
                if(value && value.min !== null && value.max !== null && value.min > value.max){
                    result = false;
                    this.popMessage("最小值不能大于最大值！");
                }
                return result;
            },
            focus: function(){
                if(this._minInput.css("display") !== "none"){
                    this._minInput.focus();
                }
            },
            getValue: function(){
                var min = this._minInput.val(),
                    max = this._maxInput.val();

                min = this._parseFloat(min);
                max = this._parseFloat(max);
                if($.isNumeric(min) || $.isNumeric(max)){
                    return {min: min, max: max};
                }
                return null;
            },
            setValue: function(value){
                var min = "", max = "";
                if(value){
                    min = $.isNumeric(value.min) ? value.min : "";
                    max = $.isNumeric(value.max) ? value.max : "";
                }

                this._minInput.val(min);
                this._maxInput.val(max);
                this._textElement.html(min.toString() + " - " + max.toString());
            },
            _parseFloat: function(value){
                value = parseFloat(value);
                if($.isNumeric(value)){
                    return value;
                }
                else{
                    return null;
                }
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.radioList", $.webui.selectInput, {
            _onCreated: function(){
                var thiz = this;
                this.element.find("input").click(function(){
                    thiz._changed();
                });
                this._load();
            },
            getValue: function(){
                var checkedRadios = this.element.find(":checked");
                if(checkedRadios.length){
                    return checkedRadios.eq(0).val();
                }
                return null;
            },
            setValue: function(value){
                if(value !== null && typeof(value) !== 'undefined'){
                    value = value.toString();
                    this.element.find("input").each(function(){
                        if($(this).val() === value){
                            $(this).prop("checked", true);
                        }
                    });

                    this._textElement.html(value);
                }
                else{
                    this.element.find("input").each(function(){
                        $(this).prop("checked", false);
                    });

                    this._textElement.html("");
                }
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
                this.element.find("input").prop("disabled", readonly);
            },
            _getSelectElement: function(value, text){
                return $.format("<label class='radio-inline'><input type='radio' name='{0}' value='{1}'/> {2}</label>", this._name, value, text);
            }
        }
    );
})(jQuery);


(function($){
    $.widget("webui.textarea", $.webui.textbox, {
            setValue: function(value){
                if(value !== null && value !== undefined){
                    value = value.toString();
                    this.element.val(value);
                    value = value.replace(/\n/g, "</br>");
                    this._textElement.html(value);
                }
                else{
                    this.element.val("");
                    this._textElement.html("");
                }
            }
        }
    );
})(jQuery);
(function( $, undefined ) {
var dagaridRenders = {
    numberEditor: function (value, datarow, cell, column, precision){
        if($.isNumeric(value)){
            value = value.toFixed(precision);
        }
        else{
            value = "";
        }
        var cellWidth = column.width;
        var inputElement = $("<input style='border: none;'/>")
            .outerWidth(cellWidth)
            .val(value)
            .change(function(){
                var changeValue = parseFloat(inputElement.val());
                if(!$.isNumeric(changeValue)){
                    changeValue = 0;
                }
                var rowValue = datarow.getValue();
                rowValue[column.field] = changeValue;
                datarow.setValue(rowValue);
            });
        return inputElement;
    },
    intEditor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 0);
    },
    number1Editor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 1);
    },
    number2Editor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 2);
    }
};
$.extend(dagaridRenders, $.webui.__renders);
var cloumnDefaultWidth = 100;

$.widget( "webui.datagrid", $.webui.input, {
    _headerCells: null,
    _rows: null,
    options: {
        columns: null,
        singleSelect: false,
        width: null,
        height: null,
        data: null,
        showNumberColumn: false,
        name: null,
        defaultValue: null,
        required: false,
        readonly: false,
        hideHeader: false,
        bordered: true,
        textWrap: false
    },
    _onCreated: function() {
        this._defaultValue = this.options.data;
        this._footer = this.options.footer;
        var self = this, header, headerContent, body, bodyContent;
        this._headerCells = [];
        this._rows = [];
        this.element.addClass("ui-datagrid");
        
        if(this.options.columns === null || !this.options.columns.length){
            return;
        }
        header = this._header = $("<div class='ui-datagrid-header'><div class='ui-datagrid-header-content'><table class='table table-bordered'><thead><tr></tr></thead></table></div></div>");

        this.element.append(header);
        headerContent = this._headerContent = header.children(".ui-datagrid-header-content");
        
        body = this._body = $("<div class='ui-datagrid-body'><div class='ui-datagrid-body-content'><table class='table table-bordered table-hover'></table></div></div>");
        bodyContent = this._bodyContent = body.find("table");
        body.scroll(function(){
            header.scrollLeft($(this).scrollLeft());
        });
        this.element.append(body);
        if(!this.options.bordered){
            this.element.find("table").removeClass("table-bordered");
        }
        if(this.options.textWrap){
            this.element.addClass("wrap");
        }else{
            this.element.addClass("ellipsis");
        }

        if(!this.options.hideHeader){
            this._renderHeader();
        }
        this.refreshSize();
        $(window).resize(function() {
            self.refreshSize();
        });
    },
    _renderHeader: function(){
        this._renderHeaderNumberCell();
        this._renderHeaderCheckboxCell();
        this._renderHeaderCells();
    },
    _renderHeaderNumberCell: function(){
        this._header.find(".ui-datagrid-header-numbercell").remove();
        if(this.options.showNumberColumn){
            var th = $("<th class='ui-datagrid-header-numbercell' ><div class='ui-datagrid-header-cell'></div></th>");
            this._header.find("tr").append(th);
        }
    },
    _renderHeaderCheckboxCell: function(){
        var self = this, th;
        this._header.find(".ui-datagrid-header-checkbox-cell").remove();
        if(!this.options.singleSelect){
            th = $("<th class='ui-datagrid-header-checkbox-cell' ><div class='ui-datagrid-header-cell'><input type='checkbox'/></div></th>");
            th.click(function(ev){
                self._onHeaderCheckboxCell_click($(this));
                ev.stopPropagation();
            });
            this._header.find("tr").append(th);
        }
    },
    _renderHeaderCells: function(){
        var self = this, datagridHeight;
        if(this._headerCells && this._headerCells.length){
            $.each(this._headerCells, function () {
                $(this.element).remove();
            });
        }
        datagridHeight = self._getHeight();
        this._headerCells = [];
        $.each(this.options.columns, function(i, column){
            var cellElement, th, index, cellHeight, cell;
            cellElement = $("<div class='ui-datagrid-header-cell'></div>");
            if(column.sortDirection === "desc"){
                cellElement.append("<span class='ui-datagrid-header-sort-icon'>▼</span>");
            }
            else if(column.sortDirection === "asc"){
                cellElement.append("<span class='ui-datagrid-header-sort-icon'>▲</span>");
            }
            cellElement.append("<span class='ui-datagrid-header-title'>" + column.title + "</span>");
            th = $("<th></th>").append(cellElement);
            self._header.find("tr").append(th);
            index = self._header.find("th").index(th);
            cellHeight = cellElement.outerHeight();
            cellElement.resizable({
                handles: "e",
                helper: "ui-datagrid-resize-helper",
                resize: function (event, ui) {
                    ui.helper.css("height", datagridHeight);
                },
                start: function(){
                    datagridHeight = self._getHeight();
                },
                stop: function(event, ui){
                    ui.originalElement.css("height", "auto");
                    self._header.find("colgroup").find("col").eq(index).css("width", ui.size.width);
                    self._body.find("colgroup").find("col").eq(index).css("width", ui.size.width);
                    cellElement.css("width", ui.size.width);
                    
                }
            });
            cell = {element: th, column: column};
            self._headerCells.push(cell);
            cellElement.click(function(){
                if(self.options.canSort && column.orderBy){
                    self._sortBy(cell, self._toggleDirection(column.sortDirection));
                }
            });
        });
    },
    _toggleDirection: function(direction){
        if(direction === "desc"){
            return "asc";
        }else{
            return "desc";
        }
    },
    sortBy: function(columnName, direction){
        var cells, cell;
        cells = $.grep(this._headerCells, function(cell){
            return cell.column.name === columnName;
        });
        if(cells && cells.length){
            cell = cells[0];
            this._sortBy(cell, direction);
        }
    },
    _sortBy: function(cell, direction){
        this._header.find(".ui-datagrid-header-sort-icon").remove();
        cell.column.sortDirection = direction;
        if(direction === "desc"){
            cell.element.find(".ui-datagrid-header-cell").prepend("<span class='ui-datagrid-header-sort-icon'>▼</span>");
        }
        else if(direction === "asc"){
            cell.element.find(".ui-datagrid-header-cell").prepend("<span class='ui-datagrid-header-sort-icon'>▲</span>");
        }
        this._trigger("sort", null, {orderBy: cell.column.orderBy, descending: direction === "desc"});
    },
    refreshSize: function(){
        this._renderWidth();
        this._renderHeight();
    },
    _renderHeight: function(){
        var height = this._getHeight(), headerHeight;
        if(height){
            this.element.outerHeight(height);
            headerHeight = this._header.outerHeight();
            if(height >= headerHeight){
                this._body.outerHeight(height - headerHeight);
            }
        }
    },
    _getHeight: function () {
        var height;
        if(this.options.height === "auto"){
            height = $(window).height() - $(document.body).outerHeight() + this.element.outerHeight();
        }
        else if(this.options.height){
            height = this.options.height;
        }
        return height;
    },
    _renderWidth: function(){
        if(this.options.width){
            this._header.css("width", this.options.width);
            this._body.css("width", this.options.width);
            this._headerContent.css("width", this.options.width);
            var headerTableWidth = this._headerContent.find("table").width();
            if(this._headerContent.width() < headerTableWidth + 30){
                this._headerContent.width(headerTableWidth + 30);
            }
        }
        
        var colgroup = this._getColgroup();
        this._header.find("colgroup").remove();
        this._body.find("colgroup").remove();
        this._header.find("table").prepend(colgroup);
        this._body.find("table").prepend(colgroup);
    },
    _getColgroup: function(){
        var colsHtml = "", width, knownWidth = 0, usableWidth = 0;
        $.each(this.options.columns, function(i, column){
            if($.isNumeric(column.width)){
                knownWidth += column.width;
            }
            else if(!column.width){
                knownWidth += cloumnDefaultWidth;
            }
        });
        if(this.options.showNumberColumn){
            colsHtml += "<col style='width: 30px'>";
            knownWidth += 30;
        }
        if(!this.options.singleSelect){
            colsHtml += "<col style='width: 30px'>";
            knownWidth += 30;
        }
        var headerWidth = this._header.width();
        usableWidth = headerWidth - knownWidth - 30;
        if(usableWidth < 0){
            usableWidth = 80;
        }
        $.each(this.options.columns, function(i, column){
            if($.isNumeric(column.width)){
                width = column.width;
            }
            else if(/%$/.test(column.width)){
                width = Math.floor(parseInt(column.width) * 0.01 * usableWidth) - 1;
            }
            else{
                width = cloumnDefaultWidth;
            }
            colsHtml += "<col style='width: "+ width +"px'>";
        });
        return "<colgroup>"+ colsHtml +"</colgroup>";
    },
    _renderBody: function(){
        var self = this;
        $.each(this._rows, function(i, row){
            self.deleteRow(row);
        });
        this._rows = [];
        if(this.options.data && this.options.data.length){
            $.each(this.options.data, function(i, data){
                self._renderRow(data);
            });
        }
        this._renderFooter();
    },
    _getRowTemplate: function(){
        var tr = $("<tr></tr>");
        if(this.options.showNumberColumn){
            $("<td></td>").attr("column-name", "number").appendTo(tr);
        }
        if(!this.options.singleSelect){
            $("<td></td>").attr("column-name", "checkbox").appendTo(tr);
        }
        $.each(this.options.columns, function(i, column){
            $("<td></td>").attr("column-name", column.name).appendTo(tr);
        });
        return tr;
    },
    _renderFooter: function(){
        var footerCell, footerCellValue, td, colspan, column, tr, gridValue,
            thiz = this;
        if(this._footerElement){
            this._footerElement.remove();
        }
        gridValue = this.getValue();
        if(gridValue.length && this._footer && this._footer.length){
            tr = this._getRowTemplate();
            this._footerElement = $("<tfoot></tfoot>").append(tr).appendTo(this._bodyContent);
            $.each(this._footer, function(){
                footerCell = this;
                //cell value
                switch(footerCell.valueType){
                    case "sum":
                        column = thiz.options.columns.find(function(col){return col.name == footerCell.columnName;});
                        footerCellValue = gridValue.sum(function(value){return value[column.field];});
                        break;
                    case "fixed":
                        footerCellValue = footerCell.value;
                        break;
                }
                //colspan
                td = tr.find("td[column-name='"+footerCell.columnName+"']")
                    .text(footerCellValue);
                if(footerCell.colspan){
                    colspan = footerCell.colspan;
                    while(colspan > 1){
                        td.next().eq(0).remove();
                        colspan -= 1;
                    }
                    td.attr("colspan", footerCell.colspan);
                }
            });
        }
    },
    setFooter: function(footer){
        this._footer = footer;
        this._renderFooter();
    },
    _renderRow: function (data, index) {
        var self = this, datarow;
        datarow = $("<tr></tr>");
        if(index >= 0 && this._rows.length > index){
            var insertDataRow = this._rows[index];
            insertDataRow.before(datarow);
            this._rows.splice(index, 0, datarow);
        }
        else{
            datarow.appendTo(this._bodyContent);
            this._rows.push(datarow);
        }
        
        datarow.datarow({
                columns: this.options.columns,
                showNumberCell: this.options.showNumberColumn,
                showCheckboxCell: !this.options.singleSelect,
                data: data
            })
            .bind("datarowselected", function(evt, row){self._onDatarow_selected(row);})
            .bind("datarowunselected", function(evt, row){self._onDatarow_unselected(row);})
            .bind("datarowchanged", function(){self._changed();})
            .click(function(){self._onDatarow_click($(this));})
            .dblclick(function(){self._onDatarow_dblclick($(this));});
        this._refreshNumberRow();
        return datarow;
    },
    appendRow: function(data){
        var datarow = this._renderRow(data);
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    prependRow: function(data){
        var datarow = this._renderRow(data, 0);
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    afterRow: function(data, datarow1){
        var self = this, datarow;
        datarow = $("<tr></tr>");
        datarow1.after(datarow);
        datarow.datarow({
            columns: this.options.columns,
            showNumberCell: this.options.showNumberColumn,
            showCheckboxCell: !this.options.singleSelect,
            data: data
        })
        .bind("datarowselected", function(evt, row){self._onDatarow_selected(row);})
        .bind("datarowunselected", function(evt, row){self._onDatarow_unselected(row);})
        .bind("datarowchanged", function(){self._changed();})
        .click(function(){self._onDatarow_click($(this));})
        .dblclick(function(){self._onDatarow_dblclick($(this));});

        this._rows.push(datarow);
        this._refreshNumberRow();
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    _onChanging: function(){
        this._renderFooter();
    },
    _onDatarow_selected: function(row){
        if(this._bodyContent.find(".active").length === this._rows.length){
            this._header.find(".ui-datagrid-header-checkbox-cell input").attr("checked", "checked");
        }
        this._trigger("selectedRow", null, row);
    },
    _onDatarow_unselected: function(row){
        this._header.find(".ui-datagrid-header-checkbox-cell input").removeAttr("checked");
        this._trigger("unselectedRow", null, row);
    },
    _onDatarow_click: function(clickRow){
        $.each(this._rows, function(i, row){
            if(!row.is(clickRow)){
                row.datarow("unselect");
            }
        });
    },
    _onDatarow_dblclick: function(row){
        this._trigger("dblclickRow", null, row);
    },
    _onHeaderCheckboxCell_click: function(cell){
        if(cell.find("input").prop("checked")){
            this.selectAllRow();
        }
        else{
            this.unselectAllRow();
        }
    },
    selectAllRow: function(){
        $.each(this._rows, function(i, row){
            row.datarow("select");
        });
    },
    unselectAllRow: function(){
        $.each(this._rows, function(i, row){
            row.datarow("unselect");
        });
    },
    _refreshNumberRow: function(){
        if(this.options.showNumberColumn){
            var numberRows = this._bodyContent.find("tr td:first-child"), i = 0;
            for(; i < numberRows.length; i++){
                numberRows.eq(i).text(i + 1);
            }
        }
    },
    getRows: function(){
        return this._rows;
    },
    getRowsData: function(){
        return $.map(this._rows, function(row){
            return row.datarow("getValue");
        });
    },
    deleteSelectedRows: function(){
        var self = this, selectRows;
        selectRows = this.getSelectedRows();
        $.each(selectRows, function(i, row){
            self.deleteRow(row);
        });
        this._changed();
    },
    getSelectedRows: function(){
        var selectRows = $.grep(this._rows, function(row){
            return row.datarow("isSelected");
        });
        return selectRows;
    },
    getSelectedRow: function(){
        var selectRows = this.getSelectedRows();
        if(selectRows && selectRows.length){
            return selectRows[0];
        }
        return null;
    },
    deleteRow: function(deletedRow){
        if(typeof deletedRow === "number"){
            deletedRow = this._rows[deletedRow];
        }
        if(!deletedRow){
            return;
        }
        var self = this, rows = [], data;
        $.each(this._rows, function(i, row){
            if(row !== deletedRow){
                rows.push(row);
            }else{
                data = row.datarow("getValue");
                row.remove();
                self._trigger("deletedRow", null, data);
            }
        });
        this._rows = rows;
        this._header.find(".ui-datagrid-header-checkbox-cell input").removeAttr("checked");
        this._refreshNumberRow();
    },
    setValue: function(value){
        this.options.data = value;
        this._renderBody();
    },
    getValue: function(){
        return this.getRowsData();
    },
    setReadonly: function(readonly){
        this._readonly = readonly;
    },
    getSelectedValue: function(mapper){
        var selectedRows = this.getSelectedRows(), selectedValue = [], rowValue;
        if(selectedRows && selectedRows.length){
            $.each(selectedRows, function(i, row){
                rowValue = row.datarow("getValue");
                selectedValue.push(rowValue);
            });
        }
        if(mapper && selectedValue){
            return $.map(selectedValue, mapper);
        }
        return selectedValue;
    },
    setColumns: function(columns){
        this.options.columns = columns;
        this._renderHeaderCells();
        this.refreshSize();
        this._renderBody();
    },
    setSize: function(size){
        if(size.width){
            this.options.width = size.width;
            this._renderWidth();
        }
        if(size.height){
            this.options.height = size.height;
            this._renderHeight();
        }
    }
});

    $.widget( "webui.datarow",{
        _cells: null,
        _selected: null,
        options: {
            columns: null,
            showNumberCell: null,
            showCheckboxCell: null,
            data: null
        },
        _create: function() {
            var self = this;
            this._value = this.options.data;
            this._cells = [];
            this._selected = false;
            this.element
                .click(function(){
                    if(self._selected){
                        self.unselect();
                    }
                    else{
                        self.select();
                    }
                });
        
            this._render();
        },
        _render: function(){
            this.element.empty();
            this._renderNumberCell();
            this._renderCheckboxCell();
            this._renderDataCells();
        },
        _renderDataCells: function(){
            var self = this, data = this.options.data, cell, td;
            this._cells = [];
            $.each(this.options.columns, function(i, column){
                cell = {};
                cell.column = column;
                td = $("<td class='ui-datagrid-cell'></td>");
                self.element.append(td);
                cell.element = td;
                self._renderCell(cell, data);
                self._cells.push(cell);
            });
        },
        _renderNumberCell: function(){
            if(this.options.showNumberCell){
                var td = $("<td class='ui-datagrid-numbercell'></td>");
                this.element.append(td);
            }
        },
        _renderCheckboxCell: function(){
            var self = this, td;
            if(this.options.showCheckboxCell){
                td = $("<td class='ui-datagrid-checkbox-cell'><input type='checkbox'/></td>");
                td.click(function(ev){
                    if(!$(ev.target).is("input")){
                        if($(this).find("input").attr("checked") === "checked"){
                            $(this).find("input").removeAttr("checked");
                        }
                        else{
                            $(this).find("input").attr("checked", "checked");
                        }
                    }
                    self._onCheckboxCell_click($(this), self.element);
                    ev.stopPropagation();
                });
                self.element.append(td);
            }
        },
        _renderCell: function(td, data){
            var self = this, cell = td.element, column = td.column, fieldValue = null, renderValue;
            cell.empty();
            if(column.field in data){
                fieldValue = data[column.field];
            }
            if(typeof(column.render) === "string"){
                renderValue = dagaridRenders[column.render](fieldValue, this, cell, column);
                if(typeof renderValue === "string"){
                    cell.html(renderValue);
                }
                else if(typeof renderValue === "object"){
                    cell.append(renderValue);
                }
            }
            else if(column.render){
                if(fieldValue){
                    renderValue = column.render(self.element, {data: data, value: fieldValue} );
                    if(typeof renderValue === "string"){
                        cell.html(renderValue);
                    }
                    else if(typeof renderValue === "object"){
                        cell.append(renderValue);
                    }
                }
            }
            else if(column.field){
                if(fieldValue !== null){
                    if($.isArray(fieldValue)){
                        fieldValue = fieldValue.toString();
                    }
                    cell.html(fieldValue).attr("title", fieldValue);
                }
            }
        },
        _onCheckboxCell_click: function(sender){
            if(sender.find("input").attr("checked") === "checked"){
                this.select();
            }
            else{
                this.unselect();
            }
        },
        select: function(){
            if(this.options.showCheckboxCell){
                this.element.find(".ui-datagrid-checkbox-cell input").prop("checked", true);
            }
            this.element.addClass("active");
            this._selected = true;
            this._trigger("selected", null, this.element);
        },
        unselect: function(){
            this.element.removeClass("active")
                .find(".ui-datagrid-checkbox-cell input")
                .prop("checked", false);
            this._selected = false;
            this._trigger("unselected", null, this.element);
        },
        setValue: function(value){
            var self = this;
            $.each(this._cells, function(i, cell){
                self._renderCell(cell, value);
            });
            this._value = value;
            this._trigger("changed", null, this.element);
        },
        getValue: function(){
            return this._value;
        },
        isSelected: function(){
            return this._selected;
        }
    });
}( jQuery ) );

//兼容保留方法
(function($){
    $.extend($.webui.datagrid.prototype, {
        updateRow: function(index, data){
            if(this._rows[index]){
                this._rows[index].datarow("setValue", data);
                this._trigger("updatedRow", null, {row: this._rows[index], data: data});
            }
        },
        selectRow: function(index){
            if(this._rows[index]){
                this._rows[index].datarow("select");
            }
        },
        unselectRow: function(index){
            if(this._rows[index]){
                this._rows[index].datarow("unselect");
            }
        },
        _setOption: function(key, value){
            var self = this;
            $.Widget.prototype._setOption.apply(self, arguments);
            switch(key){
                case "width": this._renderWidth();break;
                case "height": this._renderHeight();break;
                case "showNumberColumn":
                    this._renderHeaderNumberCell();
                    $.each(this._rows, function(i, row){
                        row.datarow("option", "showNumberCell", value);
                    });
                    break;
                case "singleSelect":
                    this._renderHeaderCheckboxCell();
                    $.each(this._rows, function(i, row){
                        row.datarow("option", "showCheckboxCell", !value);
                    });
                    break;
                case "data": this.setValue(value);break;
                case "columns": this.setColumns(value);break;
            }
        }
    });
    $.extend($.webui.datarow.prototype, {
        _setOption: function(key, value){
            var self = this;
            $.Widget.prototype._setOption.apply(self, arguments);
            switch(key){
                case "data":this.setValue(value);break;
                case "showNumberCell": this._renderNumberCell();break;
                case "showCheckboxCell": this._renderCheckboxCell();break;
            }
        }
    });
}(jQuery));
(function($){
    $.widget("webui.simpleSelect", $.webui.selectInput, {
        _onCreated: function(){
                var thiz = this;
                this._emptyMessage = this.options.emptyMessage || this.element.data("emptyMessage") || "";
                this._isObjectSelect = this.options.isObjectSelect || this.element.data("isObjectSelect") || false;
                thiz._refreshValue();
                this.element.change(function () {
                    thiz._refreshValue();
                });
                this._load();
            },
            _refreshValue: function(){
                var value = this.element.val();
                this._value = this._getValue(value);
            },
            _setValue: function (value) {
                if (this._isObjectSelect) {
                    value = this._getItemValue(value);
                    this._setElementValue(value);
                }
                else {
                    this._setElementValue(value);
                }
            },
            _setElementValue: function (value) {
                var text = this._getText(value);
                this.element.val(value);
                this._refreshValue();
                this._textElement.html(text);
            },
            getValue: function () {
                if (this._value) {
                    return this._value;
                }
                return null;
            },
            _getValue: function (value) {
                if (this._isObjectSelect) {
                    return this._findItemByValue(value);
                }
                else {
                    value = jQuery.trim(value);
                    if (value) {
                        return value;
                    }
                    return null;
                }
            },
            _getGroupElement: function(text){
                return $.format("<optgroup label='{0}'></optgroup>", text);
            },
            _getSelectElement: function(value, text){
                return $.format("<option value='{0}'>{1}</option>", value, text);
            },
            _sourceChanged: function () {
                //add empty option
                var element = this._getSelectElement("", this._emptyMessage);
                this.element.prepend(element);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.complexSelect", $.webui.input, {
            options: {
                required: null,
                name: null,
                source: null,
                single: false,
                textField: null
            },
            _onCreated: function(){
                var thiz = this;
                this._single = this.options.single || this.element.data("single");
                this._source = this.options.source || this.element.data("source") || [];
                this._textField = this.options.textField || this.element.data("textField") || "text";

                this._dropdownMenu = $("<ul style='max-height: 300px;overflow: auto; left: 0; top: 0; z-index: 10000;' class='dropdown-menu' >")
                    .appendTo("body");

                var virtualInput = this._virtualInput = $("<input class='webui-virtual-input'/>");
                this.element.append(virtualInput);
                
                var dropdownTimeout;
                virtualInput.keyup(function(e){
                    if(e.keyCode === $.ui.keyCode.ENTER){
                        return;
                    }
                    var val = virtualInput.val();
                    var width = (val.length * 1) + 2;
                    $(this).width(width.toString() + "em");

                    if(dropdownTimeout){
                        clearTimeout(dropdownTimeout);
                        dropdownTimeout = null;
                    }

                    dropdownTimeout = setTimeout(function(){
                        thiz._renderDropdownMenu(function(){
                            thiz._showDropdownMenu();
                        });
                    }, 300);
                });

                this._bindEvent();
            },
            _bindEvent: function(){
                var thiz = this;
                this.element.click(function(e){
                    thiz._virtualInput.focus();
                    thiz._renderDropdownMenu(function(){
                        thiz._showDropdownMenu();
                    });
                    thiz._showing = true;
                });
                
                $("html").click(function(){
                    if(thiz._showing !== true){
                        thiz._hideDropdownMenu();
                    }
                    thiz._showing = false;
                });

                this._dropdownMenu.click(function(e){
                    e.stopPropagation();
                });
            },
            focus: function(){
                this._virtualInput.focus();
            },
            _showDropdownMenu: function(){
                var elementOuterWidth = this.element.outerWidth();
                this._dropdownMenu.outerWidth(elementOuterWidth);
                var elementOuterHeight = this.element.outerHeight();
                var elementOffset = this.element.offset();
                var elementTop = elementOffset.top;
                var elementBottom = elementOffset.top + elementOuterHeight;
                var menuOuterHeigth = this._dropdownMenu.outerHeight();
                var windowHeight = $(window).height();
                if((windowHeight - elementBottom - menuOuterHeigth) < 0){
                    this._dropdownMenu.css({top: elementTop - menuOuterHeigth, left: elementOffset.left, display: "block"});
                }
                else{
                    this._dropdownMenu.css({top: elementBottom, left: elementOffset.left, display: "block"});
                }
            },
            _hideDropdownMenu: function(){
                this._dropdownMenu.hide();
            },
            _renderDropdownMenu: function(renderedCallback){
                var thiz = this;
                this._getSource($.trim(thiz._virtualInput.val()), function(source){
                    thiz._dropdownMenu.empty();
                    $.each(source, function(i, item){
                        var menuContent = "<span style='font-weight:bold'>" +thiz._getTagText(item) + "</span>";
                        if(this.icon){
                            menuContent = "<span class='"+this.icon+"'></span>" + menuContent;
                        }
                        if(this.summary){
                            menuContent += "<div>" + this.summary + "</div>";
                        }
                        var menu = $("<li><a style='white-space: normal' tabindex='-1' href='#'>"+menuContent+"</a></li>")
                            .data("item", this)
                            .click(function(){
                                thiz.appendTag(item);
                                thiz._virtualInput.val("").width("3em").focus();
                                thiz._hideDropdownMenu();
                                return false;
                            });
                        thiz._dropdownMenu.append(menu);
                    });
                    if(renderedCallback){
                        renderedCallback();
                    }
                });
            },
            _getSource: function(keyword, callback){
                var thiz = this;
                if(!keyword){
                    keyword = "";
                }
                keyword = keyword.toLowerCase();

                if($.isString(this._source)){
                    try{
                        this._source = eval(this._source);
                    }
                    catch(e){
                    
                    }
                }

                if($.isArray(this._source)){
                    var source = $.grep(this._source, function(item){
                        var text = thiz._getTagText(item);
                        return text.toLowerCase().indexOf(keyword) > -1;
                    });
                    callback(source);
                }
                else if($.isString(this._source)){
                    $.getJSON(this._source, {keyword: keyword, t: $.now()}, function(data){
                        callback(data);
                    });
                }
            },
            setSource: function(source){
                this._source = source;
            },
            appendTag: function(item){
                this._appendTag(item);
                this._changed();
            },
            _appendTag: function(item){
                var thiz = this;
                if(this._single){
                    this.element.find(".webui-tag").remove();
                }
                var tagHtml = 
                    "<div tabindex='-1' class='webui-tag'>"+
                        "<button tabindex='-1' type='button' class='close'>&times;</button>"+
                        "<span class='webui-tag-label'></span>"+
                    "</div>";
                var tag = $(tagHtml).data("item", item).click(function(){return false;});
                tag.find(".webui-tag-label").text(this._getTagText(item));
                tag.find(".close").click(function(e){
                    tag.remove();
                    thiz._changed();
                    e.stopPropagation();
                });
                this._virtualInput.before(tag);
            },
            clearTag: function(){
                var tagsCount = this._clearTag();
                if(tagsCount){
                    this._changed();
                }
            },
            _clearTag: function(){
                var tagsCount = this.element.find(".webui-tag").length;
                this.element.find(".webui-tag").remove();
                return tagsCount;
            },
            getValue: function(){
                var values = [];
                this.element.find(".webui-tag").each(function(){
                    var item = $(this).data("item");
                    values.push(item);
                });
                if(!values.length){
                    return null;
                }
                if(this._single){
                    return values[0];
                }
                return values;
            },
            setValue: function(value){
                var thiz = this;
                this._clearTag();
                var text = "";
                if($.isArray(value)){
                    var texts = [];
                    $.each(value, function(i, item){
                        thiz._appendTag(item);
                        texts.push(thiz._getTagText(item));
                    });
                    text = texts.toString();
                }
                else if(value){
                    thiz._appendTag(value);
                    text = thiz._getTagText(value);
                }
                this._textElement.text(text);
            },
            _getTagText: function(item){
                if(typeof(item) === "object"){
                    return item[this._textField];
                }
                return item;
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.boolRadio", $.webui.input, {
            _onCreated: function(){
                var thiz = this;
                this._trueText = this.options.trueText || this.element.data("trueText") || "是";
                this._falseText = this.options.falseText || this.element.data("falseText") || "否";
                this._trueRadio = $('<label class="radio-inline"><input type="radio"/> ' + this._trueText + '</label>')
                    .appendTo(this.element)
                    .find("input");
                this._falseRadio = $('<label class="radio-inline"><input type="radio"/> ' + this._falseText + '</label>')
                    .appendTo(this.element)
                    .find("input");
                this.element.find("input")
                    .attr("name", this._name)
                    .click(function(){
                        thiz._changed();
                    });
            },
            getValue: function(){
                if(this._trueRadio.prop("checked")){
                    return true;
                }
                if(this._falseRadio.prop("checked")){
                    return false;
                }
                return null;
            },
            setValue: function(value){
                var text = "";
                if(value === true){
                    this._trueRadio.prop("checked", true);
                    text = this._trueText;
                }
                else if(value === false){
                    this._falseRadio.prop("checked", true);
                    text = this._falseText;
                }
                this._textElement.html(text);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.boolCheckbox", $.webui.input, {
            _onCreated: function(){
                var thiz = this;
                this.element.click(function(){
                    thiz._changed();
                });
            },
            getValue: function(){
                return this.element.prop("checked");
            },
            setValue: function(value){
                this.element.prop("checked", value);
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
                this.element.prop("disabled", readonly);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.popoverTrigger", {
            options: {
                placement: "bottom",
                popover: null
            },
            _create: function(){
                var thiz = this;
                
                this._popover = this.options.popover;

                this.element.click(function(){
                    thiz.toggle();
                    return false;
                });
            },
            show: function(){
                var my, at; 
                var placement = this.options.placement;
                if(placement == 'bottom'){
                    my = "top";
                    at = "bottom";
                }
                else if(placement == 'top'){
                    my = "bottom";
                    at = "top";
                }
                else if(placement == 'left'){
                    my = "right";
                    at = "left";
                }
                else{
                    my = "left";
                    at = "right";
                }
                this._popover.show().position({my: my, at: at, of: this.element});
            },
            hide: function(){
                this._popover.hide();
            },
            toggle: function(){
                if(this._popover.is( ":hidden" )){
                    this.show();
                }
                else{
                    this.hide();
                }
            }
        }
    );
})(jQuery);
(function($){
    $.widget("ui.messageBox", {
        options: {
            
        },
        _create: function () {
            var thiz = this;
            var template =
             '<div class="modal">'+
                '<div class="modal-dialog" style="width: 400px; margin: 200px auto;">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">提示</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<span class="glyphicon" style="vertical-align:middle; font-size:34px;"></span>'+
                            '<span class="message-box-content" style="display: inline-block; margin-left: 2em;">sdfsdfsd</span>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<input type="button" class="btn btn-ok btn-default" data-dismiss="modal" value="确定" />'+
                            '<input type="button" class="btn btn-cancel btn-default" data-dismiss="modal" value="取消" />'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
            var $template = $(template);
            this._messageContent = $template.find(".message-box-content");
            this._messageIcon = $template.find(".glyphicon");
            this._btnOk = $template.find(".btn-ok").click(function(){
                if(thiz._okCallback){
                    var callback = thiz._okCallback;
                    thiz._okCallback = null;
                    callback();
                }
            });
            this._btnCancel = $template.find(".btn-cancel").click(function(){
                if(thiz._cancelCallback){
                    var callback = thiz._cancelCallback;
                    thiz._cancelCallback = null;
                    callback();
                }
            });
            this._modal = $template.modal({ show: false, backdrop: "static" }).appendTo("body").data("bs.modal");
            $("body").append(template);
        },
        info: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-info-sign text-primary");
        },
        warning: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-info-sign text-warning");
        },
        confirm: function(msg, okCallback, cancelCallback){
            this._okCallback = okCallback;
            this._cancelCallback = cancelCallback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.show();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-question-sign text-primary");
        },
        success: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-ok-sign text-success");
        },
        error: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-remove-sign text-error");
        }
    });
})(jQuery); 

$(function(){
    $.messageBox = $("body").messageBox().data("messageBox");
});
(function($){
    var template = 
        '<ul class="webui-pagination-nav" >' +
            '<li class="webui-pagination-first"><a href="#"><span title="第一页" class="glyphicon glyphicon-step-backward"></span></a></li>' +
            '<li class="webui-pagination-previous"><a href="#"><span title="上一页" class="glyphicon glyphicon-backward"></span></a></li>' +
        '</ul>' +
        '<ul class="webui-pagination-nav webui-pagination-number" style="margin-left: 10px;"></ul>' +
        '<div class="webui-pagination-input"><input class="form-control webui-pagination-page-index"/><span class="webui-pagination-page-count"></span></div>' +
        '<ul class="webui-pagination-nav" >' +
            '<li class="webui-pagination-next"><a href="#"><span title="下一页" class="glyphicon glyphicon-forward"></span></a></li>' +
            '<li class="webui-pagination-last"><a href="#"><span title="最后一页" class="glyphicon glyphicon-step-forward"></span></a></li>' +
        '</ul>' +
        '<div class="webui-pagination-input" ><select class="form-control webui-pagination-page-size" style="width: 80px;"></select></div>' +
        '<div class="webui-pagination-summary"></div>';
    $.widget("webui.pagination", {
            options: {
                start: 0, 
                count: 1,
                visiblePages: 10,
                showPageNumber: true,
                sizeOptions: [20, 50, 100],
                size: 20
            },
            _create: function(){
                this._start = this.options.start;
                this._count = this.options.count;
                this._sizeOptions = this.options.sizeOptions;
                this._size = this.options.size;
                this._showPageNumber = this.options.showPageNumber;
                this._visiblePages = this.options.visiblePages;

                this.element.addClass("webui-pagination clearfix").append(template);
                this._lnkFirst = this.element.find(".webui-pagination-first");
                this._lnkPrevious = this.element.find(".webui-pagination-previous");
                this._lnkNext = this.element.find(".webui-pagination-next");
                this._lnkLast = this.element.find(".webui-pagination-last");
                this._txtPageIndex = this.element.find(".webui-pagination-page-index");
                this._txtPageSize = this.element.find(".webui-pagination-page-size");
                this._paginationNumber = this.element.find(".webui-pagination-number");
                this._lblPageCount = this.element.find(".webui-pagination-page-count");
                this._lblSummary = this.element.find(".webui-pagination-summary");
                this._init();
                this._render();
                this._bindEvent();
            },
            _init: function(){
                this._renderSizeOptions();
            },
            _bindEvent: function(){
                var thiz = this;
                this._lnkFirst.click(function(){
                    thiz._change(1);
                    return false;
                });
                this._lnkPrevious.click(function(){
                    thiz._change(thiz._pageIndex - 1);
                    return false;
                });
                this._lnkNext.click(function(){
                    thiz._change(thiz._pageIndex + 1);
                    return false;
                });
                this._lnkLast.click(function(){
                    thiz._change(thiz._pageCount);
                    return false;
                });
                this._txtPageIndex.keyup(function(event){
                    if(event.which == 13){
                        var index = parseInt($(this).val());
                        thiz._change(index);
                    }
                });
                this._txtPageSize.change(function(){
                    thiz._calculate();
                    thiz._change(thiz._pageIndex);
                });
            },
            _change: function(pageIndex){
                if(!pageIndex){
                    pageIndex = 1;
                }
                var start = (pageIndex - 1) * this._size;
                if(start < 0){
                    start = 0;
                }
                if(start >= this._count){
                    start = (this._pageCount - 1) * this._size;
                }
                this._trigger("change", null, {start: start, size: this._size});
            },
            _render: function(){
                this._calculate();
                this._renderSummary();
                this._renderPageIndex();
                this._renderPageCount();
                this._renderNavigation();
                this._renderPagiationNumber();
            },
            _renderSummary: function(){
                var _end = this._start + this._size;
                if(this._count < _end){
                    _end = this._count;
                }
                var _start = this._start + 1;
                if(this._count <= 0){
                    _start = 0;
                }
                this._lblSummary.text($.format("{0} - {1} / {2}", _start, _end, this._count));
            },
            _renderPageIndex: function(){
                this._txtPageIndex.val(this._pageIndex);
            },
            _renderPageCount: function(){
                this._lblPageCount.text(" / " + this._pageCount);
            },
            _renderNavigation: function(){
                if(this._pageIndex <= 1){
                    this._lnkPrevious.addClass("disabled");
                    this._lnkFirst.addClass("disabled");
                }
                else{
                    this._lnkPrevious.removeClass("disabled");
                    this._lnkFirst.removeClass("disabled");
                }

                if(this._pageIndex >= this._pageCount){
                    this._lnkNext.addClass("disabled");
                    this._lnkLast.addClass("disabled");
                }
                else{
                    this._lnkNext.removeClass("disabled");
                    this._lnkLast.removeClass("disabled");
                }
            },
            _renderPagiationNumber: function(){
                if(!this._showPageNumber){
                    return;
                }
                this._paginationNumber.empty();
                var thiz = this, i = 0,
                    halfVisiblePages = Math.floor(this._visiblePages / 2);
                //所有页码大于显示页码
                if(this._pageCount > this._visiblePages){
                    if(this._pageIndex >= (this._pageCount - halfVisiblePages)){
                        i = this._pageCount - this._visiblePages;
                    }
                    else if(this._pageIndex > halfVisiblePages){
                        i = this._pageIndex - halfVisiblePages;
                    }
                }
                
                var visiblePages = i + this._visiblePages;
                for(; i < visiblePages && i < thiz._pageCount; i++){
                    this._appendNumberLink(i + 1);
                }
            },
            _renderSizeOptions: function(){
                if(this._sizeOptions){
                    var optionsHtml = "";
                    $.each(this._sizeOptions, function(i, size){
                        optionsHtml += $.format("<option>{0}</option>", size);
                    });
                    this._txtPageSize.html(optionsHtml);
                }
                this._txtPageSize.val(this._size);
            },
            _appendNumberLink: function(pageIndex){
                var thiz = this;
                var numberLink = $($.format('<li><a href="#">{0}</a></li>', pageIndex)).appendTo(this._paginationNumber);
                if(this._pageIndex == pageIndex){
                    numberLink.addClass("active");
                }
                numberLink.click(function(){
                    thiz._change(pageIndex);
                    return false;
                });
            },
            _calculate: function(){
                this._calculatePageSize();
                this._calculatePageIndex();
                this._calculatePageCount();
            },
            _calculatePageSize: function(){
                var size = parseInt(this._txtPageSize.val());
                if(!size){
                    size = this._sizeOptions[0];
                }
                this._size = size;
            },
            _calculatePageCount: function(){
                if(this._size <= 0){
                    return 0;
                }
                var pageCount = parseInt(this._count / this._size);
                if((this._count % this._size) > 0){
                    pageCount = pageCount + 1;
                }
                this._pageCount = pageCount;
            },
            _calculatePageIndex: function(){
                this._pageIndex = parseInt(this._start / this._size) + 1;
            },
            setPageInfo: function(pageInfo){
                this._start = pageInfo.start;
                this._count = pageInfo.count;

                this._render();
            },
            getPageSize: function(){
                return this._size;
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.label", $.webui.input, {
            options: {

            },
            _create: function(){
                var thiz = this;
                this._initOptions();
            },
            reset: function(){
                this.setValue("");
            },
            changed: function(callback){
                
            },
            inputing: function(callback, delay){
                
            },
            getName: function(){
                return this._name;
            },
            setError: function(error){
                
            },
            popMessage: function(message){
                
            },
            hidePopMessage: function(){
                
            },
            validate: function(){
                return true;
            },
            focus: function(){
                
            },
            setDefaultValue: function(value){
                
            },
            getDefaultValue: function(){
                return "";
            },
            setValue: function(value){
                var text = this._getText(value);
                this.element.html(text);
                this._value = value;
            },
            getValue: function(){
                return this._value;
            },
            setRequired: function(required){
                this._required = required;
            },
            getRequired: function(){
                return this._required;
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
            },
            getReadonly: function(){
                return this._readonly;
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.formModal", {
            options: {
                
            },
            _create: function(){
                var thiz = this;
                this._modal = this.element.modal({ show: false, backdrop: "static" }).data("bs.modal");
                this._form = this.element.find("form").form().data("form");
                this.element.find(".btnOkAndContinue").click(function(){
                    if(thiz._form.validate()){
                        var value = thiz._form.getValue();
                        thiz._callback(value);
                        thiz._form.reset();
                    }
                    return false;
                });
                this.element.find(".btnOk").click(function(){
                    if(thiz._form.validate()){
                        var value = thiz._form.getValue();
                        thiz._callback(value);
                        thiz._form.reset();
                        thiz._modal.hide();
                    }
                    return false;
                });
                this._onCreated();
            },
            _onCreated: function(){
            
            },
            show: function(callback, value){
                var thiz = this;
                this._modal.show();
                setTimeout(function(){
                    thiz.element.horizontalForm();
                }, 500);
                this._callback = callback;
                if(value){
                    this.setValue(value);
                }
            },
            setValue: function(value){
                this._form.setValue(value);
                this._onSettedValue(value);
            },
            setDefaultValue: function(value){
                this._form.setDefaultValue(value);
                this._onSettedValue(value);
            },
            reset: function(){
                this._form.reset();
            },
            _onSettedValue: function(value){
                   
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.dateTimeInput", $.webui.input, {
            options: {
                required: false,
                name: null,
                defaultValue: null,
                defaultTime: "08:00"
            },
            _onCreated: function(){
                var thiz = this;
                this._defaultTime = this.element.data("defaultTime") || this.options.defaultTime;
                this.element.datepicker({
                    format: "yyyy-mm-dd",
                    language: "zh-CN",
                    autoclose: true,
                    todayHighlight: true,
                    forceParse: false
                })
                .on("changeDate", function (e) {
                    var date = $.formatDate(e.date);
                    thiz.setValue(date + " " + thiz._defaultTime);
                    thiz._changed();
                })
                .inputing(function(){
                    thiz._changed();
                }, 0)
                .mask({pattern: "9999-99-99 99:99"});

                this._validator = function(input, value){
                    return $.isDateTimeString(thiz.element.val());
                };
            },
            getValue: function(){
                var value = this.element.val();
                if(value){
                    return $.toISODateTime(value);
                }
                return null;
            },
            setValue: function(value){
                var dateTimeFormat = $.formatDateTime(value);
                this.element.val(dateTimeFormat);
                this._textElement.html(dateTimeFormat);
            }
        }
    );
})(jQuery);
(function($){
    $.widget("webui.dateTimeRangeInput", $.webui.input, {
            _onCreated: function(){
                var thiz = this, inputs;
                inputs = this.element.find("input");
                this._startInput = inputs.eq(0).dateTimeInput().data("dateTimeInput");
                this._endInput = inputs.eq(1).dateTimeInput().data("dateTimeInput");
                this._startInput.changed(function(){
                    thiz._changed();
                });
                this._endInput.changed(function(){
                    thiz._changed();
                });
            },
            validate: function(){
                var value = this.getValue(), result = null;
                
                result = this._validateRequired(value);
                if(result && value){
                    result = this._startInput.validate() && this._endInput.validate();
                }
                if(result){
                    result = this._validateRange(value);
                }
                this.setError(!result);
                return result;
            },
            _validateRange: function(value){
                var result = true;
                if(value && value.start && value.end && new Date(value.start) > new Date(value.end)){
                    result = false;
                    this.popMessage("最小值不能大于最大值！");
                }
                else{
                    this.hidePopMessage();
                }
                return result;
            },
            focus: function(){
                this._startInput.focus();
            },
            getValue: function(){
                var start = this._startInput.getValue();
                var end = this._endInput.getValue();
                if(start || end){
                    return {start: start, end: end};
                }
                return null;
            },
            setValue: function(value){
                var start = null, end = null;
                if(value){
                    start = value.start;
                    end = value.end;
                }
                this._startInput.setValue(start);
                this._endInput.setValue(end);
                start = $.formatDateTime(start);
                end = $.formatDateTime(end);
                this._textElement.html(start + " 到 " + end);
            }
        }
    );
})(jQuery);
(function($){
    function __fileActionRender(data, actionRender){
        if(actionRender && (data.fileId > 0)){
            return actionRender(data);
        }
        else if(data.error){
            return data.error;
        }
        else if(data.scale){
            var progressHtml = '<div class="progress">' +
                  '<div class="progress-bar" role="progressbar" style="min-width: 2em; width: 2%;">' +
                  '</div>' +
                  '</div>';
            var scale = data.scale + "%";
            return $(progressHtml).find(".progress-bar").text(scale).width(scale);
        }
        else{
            return '<div class="progress progress-striped"><div class="progress-bar progress-bar-info" style="width: 100%"></div></div>';
        }
    }
    $.widget("webui.multiFileUpload", $.webui.input, {
            options: {
                required: false,
                name: null,
                actionRender: null,
                deleteUrl: null,
            },
            _onCreated: function(){
                var thiz = this;
                this._actionRender = this.options.actionRender || this.element.data("actionRender");
                this._deleteUrl = this.options.deleteUrl || this.element.data("deleteUrl");
                var innerHtml = 
                    "<div class='btn-group'>" + 
                        '<span class="btn btn-default webui-file-button btnAdd"><i class="icon-plus icon-white"></i><span>添加</span><input type="file" multiple data-sequential-uploads="true"/> </span>' +
                        "<button type='button' class='btn btn-default btnDelete'>删除</button>" +
                    "</div>" +
                    "<div class='datagrid'></div>";
                this.element.append(innerHtml);

                this._btnAdd = this.element.find(".btnAdd");
                this._btnDelete = this.element.find(".btnDelete").click(function(){
                    $.messageBox.confirm("确实要删除吗?", function(){
                        var rows = thiz._datagrid.getSelectedRows();
                        $.each(rows, function(){
                            var row = this;
                            var rowValue = row.datarow("getValue");
                            thiz._deleteFile(rowValue.fileId, function(){
                                thiz._datagrid.deleteRow(row);
                            });
                        });
                    });
                    
                });
                this._datagrid = this.element.find(".datagrid").datagrid({
                    columns: [
                        { title: "文件名", width: 250, field: "fileName" },
                        { title: "", width: 100, field: "fileName", render: function(datarow, args){return __fileActionRender(args.data, thiz._actionRender);}},
                    ],
                    singleSelect: false
                }).data("datagrid");

                this._initFileUpload();
            },
            _initFileUpload: function(){
                var thiz = this;
                var datarows = [];
                this.element.fileupload({
                    add: function (e, data) {
                        thiz._uploading = true;
                        var repeatNameFileIndexes = [];
                        $.each(data.files, function (index, file) {
                            if(thiz._containsFile(file.name)){
                                repeatNameFileIndexes.push(index);
                                $.messageBox.warning("已经包含了文件:" + file.name);
                            }
                            else{
                                var datarow = thiz._datagrid.appendRow({ fileName: file.name });
                                datarows.push(datarow.data("datarow"));
                            }
                        });
                        $.each(repeatNameFileIndexes, function(index, fileIndex){
                            data.files.splice(fileIndex, 1);
                        });
                        if(!data.files.length){
                            return;
                        }
                        var jqXHR = data.submit()
                            .success(function (result, textStatus, jqXHR) {
                                if(result.text){
                                    result = $.parseJSON(result.text());
                                }
                                else{
                                    result = $.parseJSON(result);
                                }
                                var datarow = datarows.shift();
                                var value = datarow.getValue();
                                if(result.result){
                                    value.fileId = result.fileId;
                                    datarow.setValue(value);
                                }
                                else{
                                    $.messageBox.error(value.message);
                                    thiz._datagrid.deleteRow(datarow);
                                }
                                if(datarows.length === 0){
                                    thiz._uploading = false;
                                }
                            })
                            .error(function (jqXHR, textStatus, errorThrown) {
                                $.messageBox.error(textStatus);
                                var datarow = datarows.shift();
                                thiz._datagrid.deleteRow(datarow);
                            });
                    },
                    progress: function(e, data){
                        var value = datarows[0].getValue();
                        value.scale = Math.floor((data.loaded / data.total) * 100) ;
                        datarows[0].setValue(value);
                    }
                });
            },
            _containsFile: function(fileName){
                var files = this._datagrid.getValue();
                var contains = false;
                $.each(files, function(index, file){
                    if(file.fileName == fileName){
                        contains = true;
                        return false;
                    }
                });
                return contains;
            },
            _deleteFile: function(fileId, cb){
                $.post(this._deleteUrl, { fileId: fileId }, function (model) {
                    cb();
                });
            },
            getValue: function(){
                var value = this._datagrid.getValue();
                return value;
            },
            setValue: function(value){
                this._datagrid.setValue(value);
            },
            getActionRender: function(){
                return this._actionRender;
            },
            setActionRender: function(value){
                this._actionRender = value;
            },
            setReadonly: function(readonly){
                if(readonly){
                    this._btnDelete.hide();
                    this._btnAdd.hide();
                }
                else{
                    this._btnDelete.show();
                    this._btnAdd.show();
                }
                this._datagrid.setReadonly(readonly);
            },
            validate: function(){
                var valid = this._datagrid.validate();
                if(valid){
                    if(this._uploading){
                        $.messageBox.info("正在上传文件.");
                        valid = false;
                    }
                }
                return valid;
            }
        }
    );
})(jQuery);

/*
 * jQuery Iframe Transport Plugin 1.3
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint unparam: true, nomen: true */
/*global define, window, document */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Helper variable to create unique names for the transport iframes:
    var counter = 0;

    // The iframe transport accepts three additional options:
    // options.fileInput: a jQuery collection of file input fields
    // options.paramName: the parameter name for the file form data,
    //  overrides the name property of the file input field(s)
    // options.formData: an array of objects with name and value properties,
    //  equivalent to the return data of .serializeArray(), e.g.:
    //  [{name: 'a', value: 1}, {name: 'b', value: 2}]
    $.ajaxTransport('iframe', function (options) {
        if (options.async && (options.type === 'POST' || options.type === 'GET')) {
            var form,
                iframe;
            return {
                send: function (_, completeCallback) {
                    form = $('<form style="display:none;"></form>');
                    // javascript:false as initial iframe src
                    // prevents warning popups on HTTPS in IE6.
                    // IE versions below IE8 cannot set the name property of
                    // elements that have already been added to the DOM,
                    // so we set the name along with the iframe HTML markup:
                    iframe = $(
                        '<iframe src="javascript:false;" name="iframe-transport-' +
                            (counter += 1) + '"></iframe>'
                    ).bind('load', function () {
                        var fileInputClones;
                        iframe
                            .unbind('load')
                            .bind('load', function () {
                                var response;
                                // Wrap in a try/catch block to catch exceptions thrown
                                // when trying to access cross-domain iframe contents:
                                try {
                                    response = iframe.contents();
                                    // Google Chrome and Firefox do not throw an
                                    // exception when calling iframe.contents() on
                                    // cross-domain requests, so we unify the response:
                                    if (!response.length || !response[0].firstChild) {
                                        throw new Error();
                                    }
                                } catch (e) {
                                    response = undefined;
                                }
                                // The complete callback returns the
                                // iframe content document as response object:
                                completeCallback(
                                    200,
                                    'success',
                                    {'iframe': response}
                                );
                                // Fix for IE endless progress bar activity bug
                                // (happens on form submits to iframe targets):
                                $('<iframe src="javascript:false;"></iframe>')
                                    .appendTo(form);
                                form.remove();
                            });
                        form
                            .prop('target', iframe.prop('name'))
                            .prop('action', options.url)
                            .prop('method', options.type);
                        if (options.formData) {
                            $.each(options.formData, function (index, field) {
                                $('<input type="hidden"/>')
                                    .prop('name', field.name)
                                    .val(field.value)
                                    .appendTo(form);
                            });
                        }
                        if (options.fileInput && options.fileInput.length &&
                                options.type === 'POST') {
                            fileInputClones = options.fileInput.clone();
                            // Insert a clone for each file input field:
                            options.fileInput.after(function (index) {
                                return fileInputClones[index];
                            });
                            if (options.paramName) {
                                options.fileInput.each(function () {
                                    $(this).prop('name', options.paramName);
                                });
                            }
                            // Appending the file input fields to the hidden form
                            // removes them from their original location:
                            form
                                .append(options.fileInput)
                                .prop('enctype', 'multipart/form-data')
                                // enctype must be set as encoding for IE:
                                .prop('encoding', 'multipart/form-data');
                        }
                        form.submit();
                        // Insert the file input fields at their original location
                        // by replacing the clones with the originals:
                        if (fileInputClones && fileInputClones.length) {
                            options.fileInput.each(function (index, input) {
                                var clone = $(fileInputClones[index]);
                                $(input).prop('name', clone.prop('name'));
                                clone.replaceWith(input);
                            });
                        }
                    });
                    form.append(iframe).appendTo(document.body);
                },
                abort: function () {
                    if (iframe) {
                        // javascript:false as iframe src aborts the request
                        // and prevents warning popups on HTTPS in IE6.
                        // concat is used to avoid the "Script URL" JSLint error:
                        iframe
                            .unbind('load')
                            .prop('src', 'javascript'.concat(':false;'));
                    }
                    if (form) {
                        form.remove();
                    }
                }
            };
        }
    });

    // The iframe transport returns the iframe content document as response.
    // The following adds converters from iframe to text, json, html, and script:
    $.ajaxSetup({
        converters: {
            'iframe text': function (iframe) {
                return $(iframe[0].body).text();
            },
            'iframe json': function (iframe) {
                return $.parseJSON($(iframe[0].body).text());
            },
            'iframe html': function (iframe) {
                return $(iframe[0].body).html();
            },
            'iframe script': function (iframe) {
                return $.globalEval($(iframe[0].body).text());
            }
        }
    });

}));

/*
 * jQuery File Upload Plugin 5.9
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document, Blob, FormData, location */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'jquery.ui.widget'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // The FileReader API is not actually used, but works as feature detection,
    // as e.g. Safari supports XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads:
    $.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;

    // The fileupload widget listens for change events on file input fields defined
    // via fileInput setting and paste or drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files using
    // the fileupload API.
    // By default, files added via file input selection, paste, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {

        options: {
            // The namespace used for event handler binding on the dropZone and
            // fileInput collections.
            // If not set, the name of the widget ("fileupload") is used.
            namespace: undefined,
            // The drop target collection, by the default the complete document.
            // Set to null or an empty collection to disable drag & drop support:
            dropZone: $(document),
            // The file input field collection, that is listened for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null or an empty collection to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // Set the following option to the location of a redirect url on the
            // origin server, for cross-domain iframe transport uploads:
            redirect: undefined,
            // The parameter name for the redirect url, sent as part of the form
            // data and set to 'redirect' if this option is empty:
            redirectParamName: undefined,
            // Set the following option to the location of a postMessage window,
            // to enable postMessage transport uploads:
            postMessage: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uplaods, else
            // once for each file selection.
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows to override plugin options as well as define ajax settings.
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                data.submit();
            },

            // Other callbacks:
            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);
            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);
            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);
            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);
            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);
            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);
            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);
            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);
            // Callback for change events of the fileInput collection:
            // change: function (e, data) {}, // .bind('fileuploadchange', func);
            // Callback for paste events to the dropZone collection:
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);
            // Callback for drop events of the dropZone collection:
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);
            // Callback for dragover events of the dropZone collection:
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },

        // A list of options that require a refresh after assigning a new value:
        _refreshOptionsList: [
            'namespace',
            'dropZone',
            'fileInput',
            'multipart',
            'forceIframeTransport'
        ],

        _isXHRUpload: function (options) {
            return !options.forceIframeTransport &&
                ((!options.multipart && $.support.xhrFileUpload) ||
                $.support.xhrFormDataFileUpload);
        },

        _getFormData: function (options) {
            var formData;
            if (typeof options.formData === 'function') {
                return options.formData(options.form);
            } else if ($.isArray(options.formData)) {
                return options.formData;
            } else if (options.formData) {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var total = data.total || this._getTotal(data.files),
                    loaded = parseInt(
                        e.loaded / e.total * (data.chunkSize || total),
                        10
                    ) + (data.uploadedBytes || 0);
                this._loaded += loaded - (data.loaded || data.uploadedBytes || 0);
                data.lengthComputable = true;
                data.loaded = loaded;
                data.total = total;
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger('progress', e, data);
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger('progressall', e, {
                    lengthComputable: true,
                    loaded: this._loaded,
                    total: this._total
                });
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    // Make sure the progress event properties get copied over:
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options);
                });
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _initXHRData: function (options) {
            var formData,
                file = options.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = options.multipart || !$.support.xhrFileUpload;
            if (!multipart || options.blob) {
                // For non-multipart uploads and chunked uploads,
                // file meta data is not part of the request body,
                // so we transmit this data as part of the HTTP headers.
                // For cross domain requests, these headers must be allowed
                // via Access-Control-Allow-Headers or removed using
                // the beforeSend callback:
                options.headers = $.extend(options.headers, {
                    'X-File-Name': file.name,
                    'X-File-Type': file.type,
                    'X-File-Size': file.size
                });
                if (!options.blob) {
                    // Non-chunked non-multipart upload:
                    options.contentType = file.type;
                    options.data = file;
                } else if (!multipart) {
                    // Chunked non-multipart upload:
                    options.contentType = 'application/octet-stream';
                    options.data = options.blob;
                }
            }
            if (multipart && $.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    // window.postMessage does not allow sending FormData
                    // objects, so we just add the File/Blob objects to
                    // the formData array and let the postMessage window
                    // create the FormData object out of this array:
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({
                            name: options.paramName,
                            value: options.blob
                        });
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({
                                name: options.paramName,
                                value: file
                            });
                        });
                    }
                } else {
                    if (options.formData instanceof FormData) {
                        formData = options.formData;
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value);
                        });
                    }
                    if (options.blob) {
                        formData.append(options.paramName, options.blob, file.name);
                    } else {
                        $.each(options.files, function (index, file) {
                            // File objects are also Blob instances.
                            // This check allows the tests to run with
                            // dummy objects:
                            if (file instanceof Blob) {
                                formData.append(options.paramName, file, file.name);
                            }
                        });
                    }
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },

        _initIframeSettings: function (options) {
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
            // Add redirect url to form data on cross-domain uploads:
            if (options.redirect && $('<a></a>').prop('href', options.url)
                    .prop('host') !== location.host) {
                options.formData.push({
                    name: options.redirectParamName || 'redirect',
                    value: options.redirect
                });
            }
        },

        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
                if (options.postMessage) {
                    // Setting the dataType to postmessage enables the
                    // postMessage transport:
                    options.dataType = 'postmessage ' + (options.dataType || '');
                }
            } else {
                this._initIframeSettings(options, 'iframe');
            }
        },

        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
            }
            if (!options.paramName) {
                options.paramName = options.fileInput.prop('name') ||
                    'files[]';
            }
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type || options.form.prop('method') || '')
                .toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT') {
                options.type = 'POST';
            }
        },

        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes = options.uploadedBytes || 0,
                mcs = options.maxChunkSize || fs,
                // Use the Blob methods with the slice implementation
                // according to the W3C Blob API specification:
                slice = file.webkitSlice || file.mozSlice || file.slice,
                upload,
                n,
                jqXHR,
                pipe;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = 'uploadedBytes';
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // n is the number of blobs to upload,
            // calculated via filesize, uploaded bytes and max chunk size:
            n = Math.ceil((fs - ub) / mcs);
            // The chunk upload method accepting the chunk number as parameter:
            upload = function (i) {
                if (!i) {
                    return that._getXHRPromise(true, options.context);
                }
                // Upload the blobs in sequential order:
                return upload(i -= 1).pipe(function () {
                    // Clone the options object for each chunk upload:
                    var o = $.extend({}, options);
                    o.blob = slice.call(
                        file,
                        ub + i * mcs,
                        ub + (i + 1) * mcs
                    );
                    // Store the current chunk size, as the blob itself
                    // will be dereferenced after data processing:
                    o.chunkSize = o.blob.size;
                    // Process the upload data (the blob and potential form data):
                    that._initXHRData(o);
                    // Add progress listeners for this chunk upload:
                    that._initProgressListener(o);
                    jqXHR = ($.ajax(o) || that._getXHRPromise(false, o.context))
                        .done(function () {
                            // Create a progress event if upload is done and
                            // no progress event has been invoked for this chunk:
                            if (!o.loaded) {
                                that._onProgress($.Event('progress', {
                                    lengthComputable: true,
                                    loaded: o.chunkSize,
                                    total: o.chunkSize
                                }), o);
                            }
                            options.uploadedBytes = o.uploadedBytes +=
                                o.chunkSize;
                        });
                    return jqXHR;
                });
            };
            // Return the piped Promise object, enhanced with an abort method,
            // which is delegated to the jqXHR object of the current upload,
            // and jqXHR callbacks mapped to the equivalent Promise methods:
            pipe = upload(n);
            pipe.abort = function () {
                return jqXHR.abort();
            };
            return this._enhancePromise(pipe);
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
            }
            this._active += 1;
            // Initialize the global progress values:
            this._loaded += data.uploadedBytes || 0;
            this._total += this._getTotal(data.files);
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            if (!this._isXHRUpload(options)) {
                // Create a progress event for each iframe load:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: 1,
                    total: 1
                }), options);
            }
            options.result = result;
            options.textStatus = textStatus;
            options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            options.jqXHR = jqXHR;
            options.textStatus = textStatus;
            options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._loaded -= options.loaded || options.uploadedBytes || 0;
                this._total -= options.total || this._getTotal(options.files);
            }
        },

        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            this._active -= 1;
            options.textStatus = textStatus;
            if (jqXHRorError && jqXHRorError.always) {
                options.jqXHR = jqXHRorError;
                options.result = jqXHRorResult;
            } else {
                options.jqXHR = jqXHRorResult;
                options.errorThrown = jqXHRorError;
            }
            this._trigger('always', null, options);
            if (this._active === 0) {
                // The stop callback is triggered when all uploads have
                // been completed, equivalent to the global ajaxStop event:
                this._trigger('stop');
                // Reset the global progress values:
                this._loaded = this._total = 0;
            }
        },

        _onSend: function (e, data) {
            var that = this,
                jqXHR,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function (resolve, args) {
                    that._sending += 1;
                    jqXHR = jqXHR || (
                        (resolve !== false &&
                        that._trigger('send', e, options) !== false &&
                        (that._chunkedUpload(options) || $.ajax(options))) ||
                        that._getXHRPromise(false, options.context, args)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._sending -= 1;
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (!nextSlot.isRejected()) {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send);
                } else {
                    pipe = (this._sequence = this._sequence.pipe(send, send));
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    var args = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(args);
                        }
                        return send(false, args);
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },

        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data),
                limit = options.limitMultiFileUploads,
                fileSet,
                i;
            if (!(options.singleFileUploads || limit) ||
                    !this._isXHRUpload(options)) {
                fileSet = [data.files];
            } else if (!options.singleFileUploads && limit) {
                fileSet = [];
                for (i = 0; i < data.files.length; i += limit) {
                    fileSet.push(data.files.slice(i, i + limit));
                }
            }
            data.originalFiles = data.files;
            $.each(fileSet || data.files, function (index, element) {
                var files = fileSet ? element : [element],
                    newData = $.extend({}, data, {files: files});
                newData.submit = function () {
                    newData.jqXHR = this.jqXHR =
                        (that._trigger('submit', e, this) !== false) &&
                        that._onSend(e, this);
                    return this.jqXHR;
                };
                return (result = that._trigger('add', e, newData));
            });
            return result;
        },

        // File Normalization for Gecko 1.9.1 (Firefox 3.5) support:
        _normalizeFile: function (index, file) {
            if (file.name === undefined && file.size === undefined) {
                file.name = file.fileName;
                file.size = file.fileSize;
            }
        },

        _replaceFileInput: function (input) {
            var inputClone = input.clone(true);
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // Avoid memory leaks with the detached file input:
            $.cleanData(input.unbind('remove'));
            // Replace the original file input element in the fileInput
            // collection with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
            // If the widget has been initialized on the file input itself,
            // override this.element with the file input clone:
            if (input[0] === this.element[0]) {
                this.element = inputClone;
            }
        },

        _onChange: function (e) {
            var that = e.data.fileupload,
                data = {
                    files: $.each($.makeArray(e.target.files), that._normalizeFile),
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            if (!data.files.length) {
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                data.files = [{name: e.target.value.replace(/^.*\\/, '')}];
            }
            if (that.options.replaceFileInput) {
                that._replaceFileInput(data.fileInput);
            }
            if (that._trigger('change', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
        },

        _onPaste: function (e) {
            var that = e.data.fileupload,
                cbd = e.originalEvent.clipboardData,
                items = (cbd && cbd.items) || [],
                data = {files: []};
            $.each(items, function (index, item) {
                var file = item.getAsFile && item.getAsFile();
                if (file) {
                    data.files.push(file);
                }
            });
            if (that._trigger('paste', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
        },

        _onDrop: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer,
                data = {
                    files: $.each(
                        $.makeArray(dataTransfer && dataTransfer.files),
                        that._normalizeFile
                    )
                };
            if (that._trigger('drop', e, data) === false ||
                    that._onAdd(e, data) === false) {
                return false;
            }
            e.preventDefault();
        },

        _onDragOver: function (e) {
            var that = e.data.fileupload,
                dataTransfer = e.dataTransfer = e.originalEvent.dataTransfer;
            if (that._trigger('dragover', e) === false) {
                return false;
            }
            if (dataTransfer) {
                dataTransfer.dropEffect = dataTransfer.effectAllowed = 'copy';
            }
            e.preventDefault();
        },

        _initEventHandlers: function () {
            var ns = this.options.namespace;
            if (this._isXHRUpload(this.options)) {
                this.options.dropZone
                    .bind('dragover.' + ns, {fileupload: this}, this._onDragOver)
                    .bind('drop.' + ns, {fileupload: this}, this._onDrop)
                    .bind('paste.' + ns, {fileupload: this}, this._onPaste);
            }
            this.options.fileInput
                .bind('change.' + ns, {fileupload: this}, this._onChange);
        },

        _destroyEventHandlers: function () {
            var ns = this.options.namespace;
            this.options.dropZone
                .unbind('dragover.' + ns, this._onDragOver)
                .unbind('drop.' + ns, this._onDrop)
                .unbind('paste.' + ns, this._onPaste);
            this.options.fileInput
                .unbind('change.' + ns, this._onChange);
        },

        _setOption: function (key, value) {
            var refresh = $.inArray(key, this._refreshOptionsList) !== -1;
            if (refresh) {
                this._destroyEventHandlers();
            }
            $.Widget.prototype._setOption.call(this, key, value);
            if (refresh) {
                this._initSpecialOptions();
                this._initEventHandlers();
            }
        },

        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input:file') ?
                        this.element : this.element.find('input:file');
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput);
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone);
            }
        },

        _create: function () {
            var options = this.options,
                dataOpts = $.extend({}, this.element.data());
            dataOpts[this.widgetName] = undefined;
            $.extend(options, dataOpts);
            options.namespace = options.namespace || this.widgetName;
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = this._loaded = this._total = 0;
            this._initEventHandlers();
        },

        destroy: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.destroy.call(this);
        },

        enable: function () {
            $.Widget.prototype.enable.call(this);
            this._initEventHandlers();
        },

        disable: function () {
            this._destroyEventHandlers();
            $.Widget.prototype.disable.call(this);
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            if (!data || this.options.disabled) {
                return;
            }
            data.files = $.each($.makeArray(data.files), this._normalizeFile);
            this._onAdd(null, data);
        },

        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                data.files = $.each($.makeArray(data.files), this._normalizeFile);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }

    });

}));

(function($){
    $.widget("webui.autocomplete", {
            options: {
                input: null,
                source: null
            },
            _create: function(){
                var thiz = this;
                this._source = this.options.source || this.element.data("source") || [];
                this._textField = this.options.textField || this.element.data("textField") || "text";
                if (this.options.input !== null) {
                    this._input = this.options.input;
                }
                else {
                    this._input = this.element;
                }

                this._dropdownMenu = $("<ul style='max-height: 300px;overflow: auto; left: 0; top: 0; z-index: 10000;' class='dropdown-menu' >")
                    .appendTo("body");
                this._bindEvent();
            },
            _bindEvent: function () {
                var thiz = this;

                var dropdownTimeout;
                this._input.keyup(function (e) {
                    if (e.keyCode === $.ui.keyCode.ENTER) {
                        return;
                    }

                    if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout);
                        dropdownTimeout = null;
                    }

                    dropdownTimeout = setTimeout(function () {
                        thiz._renderDropdownMenu(function () {
                            thiz._showDropdownMenu();
                        });
                    }, 300);
                });

                this._input.click(function (e) {
                    thiz._renderDropdownMenu(function () {
                        thiz._showDropdownMenu();
                    });
                    thiz._showing = true;
                });

                $("html").click(function(){
                    if(thiz._showing !== true){
                        thiz._hideDropdownMenu();
                    }
                    thiz._showing = false;
                });

                this._dropdownMenu.click(function(e){
                    e.stopPropagation();
                });
            },
            _showDropdownMenu: function(){
                var elementOuterWidth = this.element.outerWidth();
                this._dropdownMenu.outerWidth(elementOuterWidth);
                var elementOuterHeight = this.element.outerHeight();
                var elementOffset = this.element.offset();
                var elementTop = elementOffset.top;
                var elementBottom = elementOffset.top + elementOuterHeight;
                var menuOuterHeigth = this._dropdownMenu.outerHeight();
                var windowHeight = $(window).height();
                if((windowHeight - elementBottom - menuOuterHeigth) < 0){
                    this._dropdownMenu.css({top: elementTop - menuOuterHeigth, left: elementOffset.left, display: "block"});
                }
                else{
                    this._dropdownMenu.css({top: elementBottom, left: elementOffset.left, display: "block"});
                }
            },
            _hideDropdownMenu: function(){
                this._dropdownMenu.hide();
            },
            _renderDropdownMenu: function(renderedCallback){
                var thiz = this;
                this._getSource($.trim(thiz._input.val()), function(source){
                    thiz._dropdownMenu.empty();
                    $.each(source, function(i, item){
                        var menuContent = "<span style='font-weight:bold'>" +thiz._getItemText(item) + "</span>";
                        if(this.icon){
                            menuContent = "<span class='"+this.icon+"'></span>" + menuContent;
                        }
                        if(this.summary){
                            menuContent += "<div>" + this.summary + "</div>";
                        }
                        var menu = $("<li><a style='white-space: normal' tabindex='-1' href='#'>" + menuContent + "</a></li>")
                            .data("item", this)
                            .click(function () {
                                var selectArgs = {item: item};
                                selectArgs.text = thiz._getItemText(item);
                                thiz._trigger("select", null, selectArgs);
                                thiz._hideDropdownMenu();
                                return false;
                            });
                        thiz._dropdownMenu.append(menu);
                    });
                    if(renderedCallback){
                        renderedCallback();
                    }
                });
            },
            _extractKeyword: function (keyword) {
                var multipleSymbolRegex = /[,，、\\；;]\s*/;
                return keyword
                    .split(multipleSymbolRegex)
                    .pop();
            },
            _getSource: function(keyword, callback){
                var thiz = this;

                if(!keyword){
                    keyword = "";
                }
                keyword = this._extractKeyword(keyword);
                keyword = keyword.toLowerCase();

                if($.isString(this._source)){
                    try{
                        this._source = eval(this._source);
                    }
                    catch(e){
                    
                    }
                }

                if($.isArray(this._source)){
                    var source = $.grep(this._source, function(item){
                        var text = thiz._getItemText(item);
                        return text.toLowerCase().indexOf(keyword) > -1;
                    });
                    callback(source);
                }
                else if($.isString(this._source)){
                    $.getJSON(this._source, {keyword: keyword, t: $.now()}, function(data){
                        callback(data);
                    });
                }
            },
            setSource: function(source){
                this._source = source;
            },
            _getItemText: function (item) {
                if (typeof (item) === "object") {
                    return item[this._textField];
                }
                return item;
            }
        }
    );
})(jQuery);
/*!
 * Datepicker for Bootstrap v1.6.1 (https://github.com/eternicode/bootstrap-datepicker)
 *
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */(function(factory){
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($, undefined){

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}
	function isValidDate(d) {
		return d && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		$(element).data('datepicker', this);
		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInput = this.element.is('input');
		this.inputField = this.isInput ? this.element : this.element.find('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.inputField.length;
		if (this.component && this.component.length === 0)
			this.component = false;
		this.isInline = !this.component && this.element.is('div');

		this.picker = $(DPGlobal.template);

		// Checking templates and inserting
		if (this._check_template(this.o.templates.leftArrow)) {
			this.picker.find('.prev').html(this.o.templates.leftArrow);
		}
		if (this._check_template(this.o.templates.rightArrow)) {
			this.picker.find('.next').html(this.o.templates.rightArrow);
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('thead .datepicker-title, tfoot .today, tfoot .clear')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
		this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted);
		this.setDatesDisabled(this.o.datesDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view, default_value){
			if (view === 0 || view === 'days' || view === 'month') {
				return 0;
			}
			if (view === 1 || view === 'months' || view === 'year') {
				return 1;
			}
			if (view === 2 || view === 'years' || view === 'decade') {
				return 2;
			}
			if (view === 3 || view === 'decades' || view === 'century') {
				return 3;
			}
			if (view === 4 || view === 'centuries' || view === 'millennium') {
				return 4;
			}
			return default_value === undefined ? false : default_value;
		},

		_check_template: function(tmp){
			try {
				// If empty
				if (tmp === undefined || tmp === "") {
					return false;
				}
				// If no html, everything ok
				if ((tmp.match(/[<>]/g) || []).length <= 0) {
					return true;
				}
				// Checking if html is fine
				var jDom = $(tmp);
				return jDom.length > 0;
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			// Retrieve view index from any aliases
			o.startView = this._resolveViewName(o.startView, 0);
			o.minViewMode = this._resolveViewName(o.minViewMode, 0);
			o.maxViewMode = this._resolveViewName(o.maxViewMode, 4);

			// Check that the start view is between min and max
			o.startView = Math.min(o.startView, o.maxViewMode);
			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			o.daysOfWeekHighlighted = o.daysOfWeekHighlighted||[];
			if (!$.isArray(o.daysOfWeekHighlighted))
				o.daysOfWeekHighlighted = o.daysOfWeekHighlighted.split(/[,\s]*/);
			o.daysOfWeekHighlighted = $.map(o.daysOfWeekHighlighted, function(d){
				return parseInt(d, 10);
			});

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				o.datesDisabled = [
					o.datesDisabled
				];
			}
			o.datesDisabled = $.map(o.datesDisabled,function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this),
                paste: $.proxy(this.paste, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            }
            else if (this.component && this.hasInput) { // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
						this.update(e.date);
					}, this)
				}]);
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					mousedown: $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.inputField.prop('disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline || !this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (this.o.forceParse && this.inputField.val())
				this.setValue();
			this._trigger('hide');
			return this;
		},

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(evt){
			var dateString;
			if (evt.originalEvent.clipboardData && evt.originalEvent.clipboardData.types
				&& $.inArray('text/plain', evt.originalEvent.clipboardData.types) !== -1) {
				dateString = evt.originalEvent.clipboardData.getData('text/plain');
			}
			else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			}
			else {
				return;
			}
			this.setDate(dateString);
			this.update();
			evt.preventDefault();
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (typeof selected_date !== 'undefined') {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			if (this.inputField) {
				this.inputField.val('');
			}

			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},
		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this.setValue();
			this._trigger('changeDate');
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this.setValue();
			this._trigger('changeDate');
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				container = $(this.o.container),
				windowWidth = container.width(),
				scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
				appendOffset = container.offset();

			var parentsZindex = [];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && itemZIndex !== 0) parentsZindex.push(parseInt(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left,
				top = offset.top - appendOffset.top;

			if (this.o.container !== 'body') {
				top += scrollTop;
			}

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left += width - calendarWidth;
				} else {
					// Default to left
					this.picker.addClass('datepicker-orient-left');
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				yorient = top_overflow < 0 ? 'bottom' : 'top';
			}

			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));
			else
				top += height;

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					!this.dateWithinRange(date) ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);
			else
				this.viewDate = this.o.defaultViewDate;

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
			this.element.change();
			return this;
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				this.picker.find('.datepicker-days .datepicker-switch')
					.attr('colspan', function(i, val){
						return parseInt(val) + 1;
					});
				html += '<th class="cw">&#160;</th>';
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow';
        if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) > -1)
          html += ' disabled';
        html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
      var localDate = this._utc_to_local(this.viewDate);
			var html = '',
			i = 0;
			while (i < 12){
        var focused = localDate && localDate.getMonth() === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');	
			} 
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
          cls.push('range-start');
        }
        if (date.valueOf() === this.range[this.range.length-1]){
          cls.push('range-end');
        }
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, step, currentYear, startYear, endYear, callback){
			var html, view, year, steps, startStep, endStep, thisYear, i, classes, tooltip, before;

			html      = '';
			view      = this.picker.find(selector);
			year      = parseInt(currentYear / factor, 10) * factor;
			startStep = parseInt(startYear / step, 10) * step;
			endStep   = parseInt(endYear / step, 10) * step;
			steps     = $.map(this.dates, function(d){
				return parseInt(d.getUTCFullYear() / step, 10) * step;
			});

			view.find('.datepicker-switch').text(year + '-' + (year + step * 9));

			thisYear = year - step;
			for (i = -1; i < 11; i += 1) {
				classes = [cssClass];
				tooltip = null;

				if (i === -1) {
					classes.push('old');
				} else if (i === 10) {
					classes.push('new');
				}
				if ($.inArray(thisYear, steps) !== -1) {
					classes.push('active');
				}
				if (thisYear < startStep || thisYear > endStep) {
					classes.push('disabled');
				}
        if (thisYear === this.viewDate.getFullYear()) {
				  classes.push('focused');
        }

				if (callback !== $.noop) {
					before = callback(new Date(thisYear, 0, 1));
					if (before === undefined) {
						before = {};
					} else if (typeof(before) === 'boolean') {
						before = {enabled: before};
					} else if (typeof(before) === 'string') {
						before = {classes: before};
					}
					if (before.enabled === false) {
						classes.push('disabled');
					}
					if (before.classes) {
						classes = classes.concat(before.classes.split(/\s+/));
					}
					if (before.tooltip) {
						tooltip = before.tooltip;
					}
				}

				html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + thisYear + '</span>';
				thisYear += step;
			}
			view.find('td').html(html);
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
				tooltip,
				before;
			if (isNaN(year) || isNaN(month))
				return;
			this.picker.find('.datepicker-days .datepicker-switch')
						.text(DPGlobal.formatDate(d, titleFormat, this.o.language));
			this.picker.find('tfoot .today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.picker.find('thead .datepicker-title')
						.text(this.o.title)
						.toggle(this.o.title !== '');
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			if (prevMonth.getUTCFullYear() < 100){
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				tooltip = null;
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false && !$(month).hasClass('disabled'))
					    $(month).addClass('disabled');
					if (before.classes)
					    $(month).addClass(before.classes);
					if (before.tooltip)
					    $(month).prop('title', before.tooltip);
				});
			}

			// Generating decade/years picker
			this._fill_yearsView(
				'.datepicker-years',
				'year',
				10,
				1,
				year,
				startYear,
				endYear,
				this.o.beforeShowYear
			);

			// Generating century/decades picker
			this._fill_yearsView(
				'.datepicker-decades',
				'decade',
				100,
				10,
				year,
				startYear,
				endYear,
				this.o.beforeShowDecade
			);

			// Generating millennium/centuries picker
			this._fill_yearsView(
				'.datepicker-centuries',
				'century',
				1000,
				100,
				year,
				startYear,
				endYear,
				this.o.beforeShowCentury
			);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
				case 3:
				case 4:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, dir, day, year, month, monthChanged, yearChanged;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch')){
				this.showMode(1);
			}

			// Clicked on prev or next
			var navArrow = target.closest('.prev, .next');
			if (navArrow.length > 0) {
				dir = DPGlobal.modes[this.viewMode].navStep * (navArrow.hasClass('prev') ? -1 : 1);
				if (this.viewMode === 0){
					this.viewDate = this.moveMonth(this.viewDate, dir);
					this._trigger('changeMonth', this.viewDate);
				} else {
					this.viewDate = this.moveYear(this.viewDate, dir);
					if (this.viewMode === 1){
						this._trigger('changeYear', this.viewDate);
					}
				}
				this.fill();
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.showMode(-2);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a day
				if (target.hasClass('day')){
					day = parseInt(target.text(), 10) || 1;
					year = this.viewDate.getUTCFullYear();
					month = this.viewDate.getUTCMonth();

					// From last month
					if (target.hasClass('old')){
						if (month === 0) {
							month = 11;
							year = year - 1;
							monthChanged = true;
							yearChanged = true;
						} else {
							month = month - 1;
							monthChanged = true;
 						}
 					}

					// From next month
					if (target.hasClass('new')) {
						if (month === 11){
							month = 0;
							year = year + 1;
							monthChanged = true;
							yearChanged = true;
 						} else {
							month = month + 1;
							monthChanged = true;
 						}
					}
					this._setDate(UTCDate(year, month, day));
					if (yearChanged) {
						this._trigger('changeYear', this.viewDate);
					}
					if (monthChanged) {
						this._trigger('changeMonth', this.viewDate);
					}
				}

				// Clicked on a month
				if (target.hasClass('month')) {
					this.viewDate.setUTCDate(1);
					day = 1;
					month = target.parent().find('span').index(target);
					year = this.viewDate.getUTCFullYear();
					this.viewDate.setUTCMonth(month);
					this._trigger('changeMonth', this.viewDate);
					if (this.o.minViewMode === 1){
						this._setDate(UTCDate(year, month, day));
						this.showMode();
					} else {
						this.showMode(-1);
					}
					this.fill();
				}

				// Clicked on a year
				if (target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					this.viewDate.setUTCDate(1);

					day = 1;
					month = 0;
					year = parseInt(target.text(), 10)||0;
					this.viewDate.setUTCFullYear(year);

					if (target.hasClass('year')){
						this._trigger('changeYear', this.viewDate);
						if (this.o.minViewMode === 2){
							this._setDate(UTCDate(year, month, day));
						}
					}
					if (target.hasClass('decade')){
						this._trigger('changeDecade', this.viewDate);
						if (this.o.minViewMode === 3){
							this._setDate(UTCDate(year, month, day));
						}
					}
					if (target.hasClass('century')){
						this._trigger('changeCentury', this.viewDate);
						if (this.o.minViewMode === 4){
							this._setDate(UTCDate(year, month, day));
						}
					}

					this.showMode(-1);
					this.fill();
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			if (this.inputField){
				this.inputField.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		moveMonth: function(date, dir){
			if (!isValidDate(date))
				return this.o.defaultViewDate;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
        }
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
					if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
						break;
					dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
          if (this.viewMode === 0) {
  					if (e.ctrlKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

  						if (newViewDate)
  							this._trigger('changeYear', this.viewDate);
  					}
  					else if (e.shiftKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

  						if (newViewDate)
  							this._trigger('changeMonth', this.viewDate);
  					}
  					else if (e.keyCode === 37 || e.keyCode === 39){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
  					}
  					else if (!this.weekOfDateIsDisabled(focusDate)){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
  					}
          } else if (this.viewMode === 1) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
          } else if (this.viewMode === 2) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
          }
					if (newViewDate){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 13: // enter
					if (!this.o.forceParse)
						break;
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						e.stopPropagation();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				if (this.inputField){
					this.inputField.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + dir));
			}
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName)
					.show();
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		$(element).data('datepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker');

			if (typeof(dp) === "undefined") {
				return;
			}

			var new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('datepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
			}
		});

		if (
			internal_return === undefined ||
			internal_return instanceof Datepicker ||
			internal_return instanceof DateRangePicker
		)
			return this;

		if (this.length > 1)
			throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
		else
			return internal_return;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		assumeNearbyYear: false,
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		beforeShowYear: $.noop,
		beforeShowDecade: $.noop,
		beforeShowCentury: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		daysOfWeekHighlighted: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		maxViewMode: 4,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0,
		disableTouchKeyboard: false,
		enableOnReadonly: true,
		showOnFocus: true,
		zIndexOffset: 10,
		container: 'body',
		immediateUpdates: false,
		title: '',
		templates: {
			leftArrow: '&laquo;',
			rightArrow: '&raquo;'
		}
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear",
			titleFormat: "MM yyyy"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
			},
			{
				clsName: 'decades',
				navFnc: 'FullDecade',
				navStep: 100
			},
			{
				clsName: 'centuries',
				navFnc: 'FullCentury',
				navStep: 1000
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, assumeNearby){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toValue)
                return format.toValue(date, format, language);
            var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				fn_map = {
					d: 'moveDay',
					m: 'moveMonth',
					w: 'moveWeek',
					y: 'moveYear'
				},
				dateAliases = {
					yesterday: '-1d',
					today: '+0d',
					tomorrow: '+1d'
				},
				part, dir, i, fn;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					fn = fn_map[part[2]];
					date = Datepicker.prototype[fn](date, dir);
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
			}

			if (typeof dateAliases[date] !== 'undefined') {
				date = dateAliases[date];
				parts = date.match(/([\-+]\d+)([dmwy])/g);

				if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
					date = new Date();
				  	for (i=0; i < parts.length; i++){
						part = part_re.exec(parts[i]);
						dir = parseInt(part[1]);
						fn = fn_map[part[2]];
						date = Datepicker.prototype[fn](date, dir);
				  	}

			  		return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
				}
			}

			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCToday();
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
                return format.toDisplay(date, format, language);
            var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
			              '<tr>'+
			                '<th colspan="7" class="datepicker-title"></th>'+
			              '</tr>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.datepicker.version = '1.6.1';

	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}));


 !function (a) { a.fn.datepicker.dates["zh-CN"] = { days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], daysMin: ["日", "一", "二", "三", "四", "五", "六"], months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], today: "今日", clear: "清除", format: "yyyy年mm月dd日", titleFormat: "yyyy年mm月", weekStart: 1 } }(jQuery);
 !function (a) { a.fn.datepicker.dates["en-GB"] = { days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], today: "Today", monthsTitle: "Months", clear: "Clear", weekStart: 1, format: "dd/mm/yyyy" } }(jQuery);
!function(a,b){"function"==typeof define&&define.amd?define(["is"],function(c){return a.is=b(c)}):"object"==typeof exports?module.exports=b(require("is_js")):a.is=b(a.is)}(this,function(a){function b(a){return function(){return!a.apply(null,j.call(arguments))}}function c(b){return function(){var c=j.call(arguments),d=c.length;1===d&&a.array(c[0])&&(c=c[0],d=c.length);for(var e=0;d>e;e++)if(!b.call(null,c[e]))return!1;return!0}}function d(b){return function(){var c=j.call(arguments),d=c.length;1===d&&a.array(c[0])&&(c=c[0],d=c.length);for(var e=0;d>e;e++)if(b.call(null,c[e]))return!0;return!1}}function e(b,c){a[b]=function(a){return c[b].test(a)}}function f(){var e=a;for(var f in e)if(k.call(e,f)&&a["function"](e[f]))for(var g=e[f].api||["not","all","any"],h=0;h<g.length;h++)"not"===g[h]&&(a.not[f]=b(a[f])),"all"===g[h]&&(a.all[f]=c(a[f])),"any"===g[h]&&(a.any[f]=d(a[f]))}var g=this||global,h=g.is;a={},a.VERSION="0.7.3",a.not={},a.all={},a.any={};var i=Object.prototype.toString,j=Array.prototype.slice,k=Object.prototype.hasOwnProperty;a.arguments=function(b){return a.not["null"](b)&&("[object Arguments]"===i.call(b)||"object"==typeof b&&"callee"in b)},a.array=Array.isArray||function(a){return"[object Array]"===i.call(a)},a["boolean"]=function(a){return a===!0||a===!1||"[object Boolean]"===i.call(a)},a.date=function(a){return"[object Date]"===i.call(a)},a.error=function(a){return"[object Error]"===i.call(a)},a["function"]=function(a){return"[object Function]"===i.call(a)||"function"==typeof a},a.nan=function(a){return a!==a},a["null"]=function(a){return null===a||"[object Null]"===i.call(a)},a.number=function(b){return a.not.nan(b)&&"[object Number]"===i.call(b)},a.object=function(a){var b=typeof a;return"function"===b||"object"===b&&!!a},a.json=function(a){return"[object Object]"===i.call(a)},a.regexp=function(a){return"[object RegExp]"===i.call(a)},a.sameType=function(b,c){return a.nan(b)||a.nan(c)?a.nan(b)===a.nan(c):i.call(b)===i.call(c)},a.sameType.api=["not"],a.string=function(a){return"[object String]"===i.call(a)},a["char"]=function(b){return a.string(b)&&1===b.length},a.undefined=function(a){return void 0===a},a.empty=function(b){if(a.object(b)){var c=Object.getOwnPropertyNames(b).length;return 0===c||1===c&&a.array(b)||2===c&&a.arguments(b)?!0:!1}return""===b},a.existy=function(a){return null!==a&&void 0!==a},a.truthy=function(b){return a.existy(b)&&b!==!1&&a.not.nan(b)&&""!==b&&0!==b},a.falsy=b(a.truthy),a.space=function(b){if(a["char"](b)){var c=b.charCodeAt(0);return c>8&&14>c||32===c}return!1},a.equal=function(b,c){return a.all.number(b,c)?b===c&&1/b===1/c:a.all.string(b,c)||a.all.regexp(b,c)?""+b==""+c:a.all["boolean"](b,c)?b===c:!1},a.equal.api=["not"],a.even=function(b){return a.number(b)&&b%2===0},a.odd=function(b){return a.number(b)&&b%2!==0},a.positive=function(b){return a.number(b)&&b>0},a.negative=function(b){return a.number(b)&&0>b},a.above=function(b,c){return a.all.number(b,c)&&b>c},a.above.api=["not"],a.under=function(b,c){return a.all.number(b,c)&&c>b},a.under.api=["not"],a.within=function(b,c,d){return a.all.number(b,c,d)&&b>c&&d>b},a.within.api=["not"],a.decimal=function(b){return a.number(b)&&b%1!==0},a.integer=function(b){return a.number(b)&&b%1===0},a.finite=isFinite||function(b){return b!==1/0&&b!==-(1/0)&&a.not.nan(b)},a.infinite=b(a.finite);var l={url:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,creditCard:/^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,alphaNumeric:/^[A-Za-z0-9]+$/,timeString:/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,dateString:/^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,usZipCode:/^[0-9]{5}(?:-[0-9]{4})?$/,caPostalCode:/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,ukPostCode:/^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,nanpPhone:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,eppPhone:/^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,socialSecurityNumber:/^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/,affirmative:/^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,hexadecimal:/^[0-9a-fA-F]+$/,hexColor:/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,ipv4:/^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,ipv6:/^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,ip:/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/};for(var m in l)l.hasOwnProperty(m)&&e(m,l);a.include=function(a,b){return a.indexOf(b)>-1},a.include.api=["not"],a.upperCase=function(b){return a.string(b)&&b===b.toUpperCase()},a.lowerCase=function(b){return a.string(b)&&b===b.toLowerCase()},a.startWith=function(b,c){return a.string(b)&&0===b.indexOf(c)},a.startWith.api=["not"],a.endWith=function(b,c){return a.string(b)&&b.indexOf(c)>-1&&b.indexOf(c)===b.length-c.length},a.endWith.api=["not"],a.capitalized=function(b){if(a.not.string(b))return!1;for(var c=b.split(" "),d=[],e=0;e<c.length;e++)d.push(c[e][0]===c[e][0].toUpperCase());return a.all.truthy.apply(null,d)},a.palindrome=function(b){return a.string(b)&&b==b.split("").reverse().join("")};var n=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],o=["january","february","march","april","may","june","july","august","september","october","november","december"];if(a.today=function(b){var c=new Date,d=c.toDateString();return a.date(b)&&b.toDateString()===d},a.yesterday=function(b){var c=new Date,d=new Date(c.setDate(c.getDate()-1)).toDateString();return a.date(b)&&b.toDateString()===d},a.tomorrow=function(b){var c=new Date,d=new Date(c.setDate(c.getDate()+1)).toDateString();return a.date(b)&&b.toDateString()===d},a.past=function(b){var c=new Date;return a.date(b)&&b.getTime()<c.getTime()},a.future=b(a.past),a.day=function(b,c){return a.date(b)&&c.toLowerCase()===n[b.getDay()]},a.day.api=["not"],a.month=function(b,c){return a.date(b)&&c.toLowerCase()===o[b.getMonth()]},a.month.api=["not"],a.year=function(b,c){return a.date(b)&&a.number(c)&&c===b.getFullYear()},a.year.api=["not"],a.leapYear=function(b){return a.number(b)&&(b%4===0&&b%100!==0||b%400===0)},a.weekend=function(b){return a.date(b)&&(6===b.getDay()||0===b.getDay())},a.weekday=b(a.weekend),a.inDateRange=function(b,c,d){if(a.not.date(b)||a.not.date(c)||a.not.date(d))return!1;var e=b.getTime(),f=c.getTime(),g=d.getTime();return e>f&&g>e},a.inDateRange.api=["not"],a.inLastWeek=function(b){return a.inDateRange(b,new Date((new Date).setDate((new Date).getDate()-7)),new Date)},a.inLastMonth=function(b){return a.inDateRange(b,new Date((new Date).setMonth((new Date).getMonth()-1)),new Date)},a.inLastYear=function(b){return a.inDateRange(b,new Date((new Date).setFullYear((new Date).getFullYear()-1)),new Date)},a.inNextWeek=function(b){return a.inDateRange(b,new Date,new Date((new Date).setDate((new Date).getDate()+7)))},a.inNextMonth=function(b){return a.inDateRange(b,new Date,new Date((new Date).setMonth((new Date).getMonth()+1)))},a.inNextYear=function(b){return a.inDateRange(b,new Date,new Date((new Date).setFullYear((new Date).getFullYear()+1)))},a.quarterOfYear=function(b,c){return a.date(b)&&a.number(c)&&c===Math.floor((b.getMonth()+3)/3)},a.quarterOfYear.api=["not"],a.dayLightSavingTime=function(a){var b=new Date(a.getFullYear(),0,1),c=new Date(a.getFullYear(),6,1),d=Math.max(b.getTimezoneOffset(),c.getTimezoneOffset());return a.getTimezoneOffset()<d},"undefined"!=typeof window){var p="navigator"in window&&"userAgent"in navigator&&navigator.userAgent.toLowerCase()||"",q="navigator"in window&&"vendor"in navigator&&navigator.vendor.toLowerCase()||"",r="navigator"in window&&"appVersion"in navigator&&navigator.appVersion.toLowerCase()||"";a.chrome=function(){return/chrome|chromium/i.test(p)&&/google inc/.test(q)},a.chrome.api=["not"],a.firefox=function(){return/firefox/i.test(p)},a.firefox.api=["not"],a.ie=function(a){return a?a>=11?"ActiveXObject"in window:new RegExp("msie "+a).test(p):/msie/i.test(p)||"ActiveXObject"in window},a.ie.api=["not"],a.opera=function(){return/^Opera\//.test(p)||/\x20OPR\//.test(p)},a.opera.api=["not"],a.safari=function(){return/safari/i.test(p)&&/apple computer/i.test(q)},a.safari.api=["not"],a.ios=function(){return a.iphone()||a.ipad()||a.ipod()},a.ios.api=["not"],a.iphone=function(){return/iphone/i.test(p)},a.iphone.api=["not"],a.ipad=function(){return/ipad/i.test(p)},a.ipad.api=["not"],a.ipod=function(){return/ipod/i.test(p)},a.ipod.api=["not"],a.android=function(){return/android/i.test(p)},a.android.api=["not"],a.androidPhone=function(){return/android/i.test(p)&&/mobile/i.test(p)},a.androidPhone.api=["not"],a.androidTablet=function(){return/android/i.test(p)&&!/mobile/i.test(p)},a.androidTablet.api=["not"],a.blackberry=function(){return/blackberry/i.test(p)||/BB10/i.test(p)},a.blackberry.api=["not"],a.desktop=function(){return a.not.mobile()&&a.not.tablet()},a.desktop.api=["not"],a.linux=function(){return/linux/i.test(r)},a.linux.api=["not"],a.mac=function(){return/mac/i.test(r)},a.mac.api=["not"],a.windows=function(){return/win/i.test(r)},a.windows.api=["not"],a.windowsPhone=function(){return a.windows()&&/phone/i.test(p)},a.windowsPhone.api=["not"],a.windowsTablet=function(){return a.windows()&&a.not.windowsPhone()&&/touch/i.test(p)},a.windowsTablet.api=["not"],a.mobile=function(){return a.iphone()||a.ipod()||a.androidPhone()||a.blackberry()||a.windowsPhone()},a.mobile.api=["not"],a.tablet=function(){return a.ipad()||a.androidTablet()||a.windowsTablet()},a.tablet.api=["not"],a.online=function(){return navigator.onLine},a.online.api=["not"],a.offline=b(a.online),a.offline.api=["not"],a.touchDevice=function(){return"ontouchstart"in window||"DocumentTouch"in window&&document instanceof DocumentTouch},a.touchDevice.api=["not"]}return a.propertyCount=function(b,c){if(!a.object(b)||!a.number(c))return!1;if(Object.keys)return Object.keys(b).length===c;var d,e=[];for(d in b)k.call(b,d)&&e.push(d);return e.length===c},a.propertyCount.api=["not"],a.propertyDefined=function(b,c){return a.object(b)&&a.string(c)&&c in b},a.propertyDefined.api=["not"],a.windowObject=function(a){return"object"==typeof a&&"setInterval"in a},a.domNode=function(b){return a.object(b)&&b.nodeType>0},a.inArray=function(b,c){if(a.not.array(c))return!1;for(var d=0;d<c.length;d++)if(c[d]===b)return!0;return!1},a.inArray.api=["not"],a.sorted=function(b){if(a.not.array(b))return!1;for(var c=0;c<b.length;c++)if(b[c]>b[c+1])return!1;return!0},f(),a.setRegexp=function(a,b){for(var c in l)k.call(l,c)&&b===c&&(l[c]=a)},a.setNamespace=function(){return g.is=h,this},a});
(function (main) {
	'use strict';

	/**
	 * Parse or format dates
	 * @class fecha
	 */
	var fecha = {},
		token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
		dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		amPm = ['am', 'pm'],
		twoDigits = /\d\d?/, threeDigits = /\d{3}/, fourDigits = /\d{4}/,
		word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
		noop = function () {},
		dayNamesShort = [], monthNamesShort = [],
		parseFlags = {
			D: [twoDigits, function (d, v) {
				d.day = v;
			}],
			M: [twoDigits, function (d, v) {
				d.month = v - 1;
			}],
			YY: [twoDigits, function (d, v) {
				var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
				d.year = '' + (v > 68 ? cent - 1 : cent) + v;
			}],
			h: [twoDigits, function (d, v) {
				d.hour = v;
			}],
			m: [twoDigits, function (d, v) {
				d.minute = v;
			}],
			s: [twoDigits, function (d, v) {
				d.second = v;
			}],
			YYYY: [fourDigits, function (d, v) {
				d.year = v;
			}],
			S: [/\d/, function (d, v) {
				d.millisecond = v * 100;
			}],
			SS: [/\d{2}/, function (d, v) {
				d.millisecond = v * 10;
			}],
			SSS: [threeDigits, function (d, v) {
				d.millisecond = v;
			}],
			d: [twoDigits, noop],
			ddd: [word, noop],
			MMM: [word, monthUpdate('monthNamesShort')],
			MMMM: [word, monthUpdate('monthNames')],
			a: [word, function (d, v) {
				if (amPm.indexOf(v.toLowerCase())) {
					d.isPm = true;
				}
			}],
			ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
				var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

				if (parts) {
					minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
					d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
				}

			}]
		};
	parseFlags.dd = parseFlags.d;
	parseFlags.dddd = parseFlags.ddd;
	parseFlags.Do = parseFlags.DD = parseFlags.D;
	parseFlags.mm = parseFlags.m;
	parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	parseFlags.MM = parseFlags.M;
	parseFlags.ss = parseFlags.s;
	parseFlags.A = parseFlags.a;

	shorten(monthNames, monthNamesShort, 3);
	shorten(dayNames, dayNamesShort, 3);

	function monthUpdate(arrName) {
		return function (d, v) {
			var index = fecha.i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
			if (~index) {
				d.month = index;
			}
		}
	}

	function pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = '0' + val;
		}
		return val;
	}

	function shorten(arr, newArr, sLen) {
		for (var i = 0, len = arr.length; i < len; i++) {
			newArr.push(arr[i].substr(0, sLen));
		}
	}

	function DoFn(D) {
		return D + [ 'th', 'st', 'nd', 'rd' ][ D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10 ];
	}

	fecha.i18n = {
		dayNamesShort: dayNamesShort,
		dayNames: dayNames,
		monthNamesShort: monthNamesShort,
		monthNames: monthNames,
		amPm: amPm,
		DoFn: DoFn
	};

	// Some common format strings
	fecha.masks = {
		'default': 'ddd MMM DD YYYY HH:mm:ss',
		shortDate: 'M/D/YY',
		mediumDate: 'MMM D, YYYY',
		longDate: 'MMMM D, YYYY',
		fullDate: 'dddd, MMMM D, YYYY',
		shortTime: 'HH:mm',
		mediumTime: 'HH:mm:ss',
		longTime: 'HH:mm:ss.SSS'
	};

	/***
	 * Format a date
	 * @method format
	 * @param {Date|string} dateObj
	 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
	 */
	fecha.format = function (dateObj, mask) {
		// Passing date through Date applies Date.parse, if necessary
		if (typeof dateObj === 'string') {
			dateObj = fecha.parse(dateObj);
		} else if (!dateObj) {
			dateObj = new Date();
		}
		if (isNaN(dateObj)) {
			throw new SyntaxError('invalid date');
		}

		mask = fecha.masks[mask] || mask || fecha.masks['default'];

		var D = dateObj.getDate(),
			d = dateObj.getDay(),
			M = dateObj.getMonth(),
			y = dateObj.getFullYear(),
			H = dateObj.getHours(),
			m = dateObj.getMinutes(),
			s = dateObj.getSeconds(),
			S = dateObj.getMilliseconds(),
			o = dateObj.getTimezoneOffset(),
			flags = {
				D: D,
				DD: pad(D),
				Do: fecha.i18n.DoFn(D),
				d: d,
				dd: pad(d),
				ddd: fecha.i18n.dayNamesShort[d],
				dddd: fecha.i18n.dayNames[d],
				M: M + 1,
				MM: pad(M + 1),
				MMM: fecha.i18n.monthNamesShort[M],
				MMMM: fecha.i18n.monthNames[M],
				YY: String(y).slice(2),
				YYYY: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				m: m,
				mm: pad(m),
				s: s,
				ss: pad(s),
				S: Math.round(S / 100),
				SS: pad(Math.round(S / 10), 2),
				SSS: pad(S, 3),
				a: H < 12 ? fecha.i18n.amPm[0] : fecha.i18n.amPm[1],
				A: H < 12 ? fecha.i18n.amPm[0].toUpperCase() : fecha.i18n.amPm[1].toUpperCase(),
				ZZ: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};

	/**
	 * Parse a date string into an object, changes - into /
	 * @method parse
	 * @param {string} dateStr Date string
	 * @param {string} format Date parse format
	 * @returns {Date|boolean}
	 */
	fecha.parse = function (dateStr, format) {
		var time, isValid, dateInfo, today, date, info, index;

		if (!format) {
			time = Date.parse(dateStr.replace(/\-/g, '/'));
			if (!isNaN(time)) {
				return new Date(time);
			} else {
				return false;
			}

		} else {
			format = fecha.masks[format] || format;

			isValid = true;
			dateInfo = {};
			format.replace(token, function ($0) {
				if (parseFlags[$0]) {
					info = parseFlags[$0];
					index = dateStr.search(info[0]);
					if (!~index) {
						isValid = false;
					} else {
						dateStr.replace(info[0], function (result) {
							info[1](dateInfo, result);
							dateStr = dateStr.substr(index + result.length);
							return result;
						});
					}
				}

				return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
			});
		}

		if (!isValid) {
			return false;
		}

		today = new Date();
		if (dateInfo.isPm && dateInfo.hour) {
			dateInfo.hour = +dateInfo.hour + 12
		}

		if (dateInfo.timezoneOffset) {
			dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
			date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
				dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
		} else {
			date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
				dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
		}
		return date;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = fecha;
	} else if (typeof require !== 'undefined' && require.amd) {
		define(function () {
			return fecha;
		});
	} else {
		main.fecha = fecha;
	}
})(this);
