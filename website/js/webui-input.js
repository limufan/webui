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
                    text = this._render(this, { value: value });
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
        int: function (sender, args) {
            var value = args.value;
            if($.isNumeric(value)){
                return value.toFixed(0);
            }
            return value;
        },
        number1: function (sender, args) {
            var value = args.value;
            if($.isNumeric(value)){
                return value.toFixed(1);
            }        
            return value;
        },
        number2: function (sender, args) {
            var value = args.value;
            if($.isNumeric(value)){
                return value.toFixed(2);
            }
            return value;
        },
        shifou: function (sender, args) {
            var value = args.value;
            return value ? "是" : "否";
        },
        name: function (sender, args) {
            var value = args.value;
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
        code: function (sender, args) {
            var value = args.value;
            if ($.isArray(value)) {
                value = $.map(value, function (obj) {
                    return obj.code;
                });
                return value.toString();
            }
            else if (value) {
                return value.code;
            }
            return "";
        },
        nameMultiRow: function (sender, args) {
            var value = args.value;
            if($.isArray(value)){
                value = $.map(value, function(obj){
                    return obj.name;
                });
                return value.join("<br />");
            }
            return "";
        },
        date: function (sender, args) {
            var value = args.value;
            return $.formatDate(value);
        },
        dateRange: function (sender, args) {
            var value = args.value;
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
        dateTime: function (sender, args) {
            var value = args.value;
            if(value){
                return  $.formatDateTime(value);
            }
            return "";
        },
        dateTimeRange: function (sender, args) {
            var value = args.value;
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