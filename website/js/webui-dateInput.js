(function($){
    $.widget("webui.dateInput", $.webui.input, {
            options: {
                required: false,
                name: null,
                defaultValue: null
            },
            _onCreated: function(){
                var thiz = this;
                this.element.datepicker()
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