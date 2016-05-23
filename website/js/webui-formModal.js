(function($){
    $.widget("webui.formModal", {
            options: {
                
            },
            _create: function(){
                var thiz = this;
                this._modal = this.element.modal({ show: false, backdrop: "static" }).data("bs.modal");
                this._form = this.element.find("form").form().data("form");
                this.element.find(".btnOkAndContinue").click(function(){
                    if(thiz._form.validate()){
                        var value = thiz._form.getValue();
                        thiz._callback(value);
                        thiz._form.reset();
                    }
                    return false;
                });
                this.element.find(".btnOk").click(function(){
                    if(thiz._form.validate()){
                        var value = thiz._form.getValue();
                        thiz._callback(value);
                        thiz._form.reset();
                        thiz._modal.hide();
                    }
                    return false;
                });
                this._onCreated();
            },
            _onCreated: function(){
            
            },
            show: function(callback, value){
                var thiz = this;
                this._modal.show();
                setTimeout(function(){
                    thiz.element.horizontalForm();
                }, 500);
                this._callback = callback;
                if(value){
                    this.setValue(value);
                }
            },
            setValue: function(value){
                this._form.setValue(value);
                this._onSettedValue(value);
            },
            setDefaultValue: function(value){
                this._form.setDefaultValue(value);
                this._onSettedValue(value);
            },
            reset: function(){
                this._form.reset();
            },
            _onSettedValue: function(value){
                   
            }
        }
    );
})(jQuery);