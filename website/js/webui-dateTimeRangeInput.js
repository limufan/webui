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