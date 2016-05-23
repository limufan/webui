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