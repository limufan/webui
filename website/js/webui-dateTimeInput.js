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
                    onSelect: function(date){
                        thiz.setValue(date + " " + thiz._defaultTime);
                        thiz._changed();
                    }
                }).
                inputing(function(){
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