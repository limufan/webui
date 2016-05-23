(function($){

    $.widget("webui.form", {
            options: {
                sections: null
            },
            _create: function(){
                var thiz = this;
                this._value = {};
                this._inputs = {};
                
                $.each($.webui.form.inputTypes, function(i, inputType){
                    var inputName = inputType.name, 
                        inputs = thiz.element.find(inputType.selector),
                        input;
                    if(inputs.length){
                        if(! inputs[inputName]){
                            throw $.format("{0} widget not found!", inputName);
                        }
                        inputs.each(function(){
                            //init jquery widget
                            input = $(this)[inputName]().data(inputName);
                            thiz._inputs[input.getName()] = input;
                        });
                    }
                });
            },
            getValue: function(){
                var inputValues = {};
                $.each(this._inputs, function(name, input){
                    inputValues[name] = input.getValue();
                });
                $.extend(this._value, inputValues);
                return this._value;
            },
            setValue: function (value) {
                this._value = value;
                for(var name in value){
                    if(name in this._inputs){
                        this._inputs[name].setValue(value[name]);
                    }
                }
            },
            setDefaultValue: function(value){
                $.extend(this._value, value);
                for(var name in value){
                    if(name in this._inputs){
                        this._inputs[name].setDefaultValue(value[name]);
                    }
                }
            },
            setReadonly: function(readonly){
                $.each(this._inputs, function(name, input){
                    input.setReadonly(readonly);
                });
            },
            reset: function(){
                this._value = {};
                $.each(this._inputs, function(name, input){
                    input.reset();
                });
            },
            validate: function(container){
                var invalidInputs = [];
                var inputs = this._inputs;
                if(container){
                    inputs = this.getInputs(container);
                }
                $.each(inputs, function(name, input){
                    if(!input.validate()){
                        invalidInputs.push(input);
                    }
                });
                if(invalidInputs.length > 0){
                    invalidInputs[0].focus();
                    return false;
                }
                return true;
            },
            getInput: function(name){
                return this._inputs[name];
            },
            setInput: function(name, input){
                this._inputs[name] = input;
            },
            getInputs: function(container){
                var inputs = [];
                $.each($.webui.form.inputTypes, function(i, inputType){
                    var inputName = inputType.name, 
                        input;
                    container.find(inputType.selector).each(function(){
                        input = $(this).data(inputName);
                        inputs.push(input);
                    });
                });
                return inputs;
            },
            changed: function(callback){
                $.each(this._inputs, function(name, input){
                    input.changed(function(_input, value){
                        callback(_input, value);
                    });
                });
            },
            inputing: function(callback, delay){
                $.each(this._inputs, function(name, input){
                    input.inputing(function(_input, value){
                        callback(_input, value);
                    }, delay);
                });
            }
        }
    );
    
    $.webui.form.inputTypes = [
        {name: "hiddenInput", selector: ".webui-hidden"},
        {name: "checkboxList", selector: ".webui-checkboxList"},
        {name: "dateInput", selector: ".webui-dateInput"},
        {name: "dateRangeInput", selector: ".webui-dateRangeInput"},
        {name: "numberInput", selector: ".webui-numberInput"},
        {name: "numberRangeInput", selector: ".webui-numberRangeInput"},
        {name: "radioList", selector: ".webui-radioList"},
        {name: "simpleSelect", selector: ".webui-simpleSelect"},
        {name: "textarea", selector: ".webui-textarea"},
        {name: "textbox", selector: ".webui-textbox"},
        {name: "complexSelect", selector: ".webui-complexSelect"},
        {name: "datagrid", selector: ".webui-datagrid"},
        {name: "boolRadio", selector: ".webui-boolRadio"},
        {name: "boolCheckbox", selector: ".webui-boolCheckbox"},
        {name: "label", selector: ".webui-label"},
        {name: "dateTimeInput", selector: ".webui-dateTimeInput"},
        {name: "dateTimeRangeInput", selector: ".webui-dateTimeRangeInput"},
        {name: "multiFileUpload", selector: ".webui-multiFileUpload"}
    ];

})(jQuery);
