(function($){
    $.widget("webui.boolRadio", $.webui.input, {
            _onCreated: function(){
                var thiz = this;
                this._trueText = this.options.trueText || this.element.data("trueText") || "是";
                this._falseText = this.options.falseText || this.element.data("falseText") || "否";
                this._trueRadio = $('<label class="radio-inline"><input type="radio"/> ' + this._trueText + '</label>')
                    .appendTo(this.element)
                    .find("input");
                this._falseRadio = $('<label class="radio-inline"><input type="radio"/> ' + this._falseText + '</label>')
                    .appendTo(this.element)
                    .find("input");
                this.element.find("input")
                    .attr("name", this._name)
                    .click(function(){
                        thiz._changed();
                    });
            },
            getValue: function(){
                if(this._trueRadio.prop("checked")){
                    return true;
                }
                if(this._falseRadio.prop("checked")){
                    return false;
                }
                return null;
            },
            setValue: function(value){
                var text = "";
                if(value === true){
                    this._trueRadio.prop("checked", true);
                    text = this._trueText;
                }
                else if(value === false){
                    this._falseRadio.prop("checked", true);
                    text = this._falseText;
                }
                this._textElement.html(text);
            }
        }
    );
})(jQuery);