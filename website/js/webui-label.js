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