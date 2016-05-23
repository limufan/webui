(function($){
    $.widget("webui.radioList", $.webui.selectInput, {
            _onCreated: function(){
                var thiz = this;
                this.element.find("input").click(function(){
                    thiz._changed();
                });
                this._load();
            },
            getValue: function(){
                var checkedRadios = this.element.find(":checked");
                if(checkedRadios.length){
                    return checkedRadios.eq(0).val();
                }
                return null;
            },
            setValue: function(value){
                if(value !== null && typeof(value) !== 'undefined'){
                    value = value.toString();
                    this.element.find("input").each(function(){
                        if($(this).val() === value){
                            $(this).prop("checked", true);
                        }
                    });

                    this._textElement.html(value);
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
                return $.format("<label class='radio-inline'><input type='radio' name='{0}' value='{1}'/> {2}</label>", this._name, value, text);
            }
        }
    );
})(jQuery);
