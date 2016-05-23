(function($){
    $.widget("webui.checkboxList", $.webui.selectInput, {
            _onCreated: function(){
                var thiz = this;
                this.element.find("input").click(function(){
                    thiz._changed();
                });
                this._load();
            },
            getValue: function(){
                var value = this.element.find(":checked")
                    .map(function(){
                        return $(this).val();
                    })
                    .get();
                if(value.length){
                    return value;
                }
                else{
                    return null;
                }
            },
            setValue: function(value){
                if(value){
                    this.element.find("input").each(function(){
                        var index = $.inArray($(this).val(), value);
                        $(this).prop("checked", index > -1);
                    });

                    this._textElement.html(value.toString());
                }
                else{
                    this.element.find("input").each(function(){
                        $(this).prop("checked", false);
                    });

                    this._textElement.html("");
                }
            },
            setReadonly: function(readonly){
                this._readonly = readonly;
                this.element.find("input").prop("disabled", readonly);
            },
            _getSelectElement: function(value, text){
                return $.format("<label class='checkbox-inline'><input type='checkbox' value='{0}'/> {1}</label>", value, text);
            }
        }
    );
})(jQuery);