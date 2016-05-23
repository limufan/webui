
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