
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