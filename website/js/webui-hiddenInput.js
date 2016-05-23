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