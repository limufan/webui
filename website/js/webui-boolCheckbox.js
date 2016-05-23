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