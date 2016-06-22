(function($){
 $.widget("webui.textbox", $.webui.input, {
            options: {
                required: false,
                suggestions: null,
                name: null,
                defaultValue: null
            },
            _onCreated: function(){
                var regex = this.options.regex || this.element.data("regex");
                this._regexMessage = this.options.regexMessage || this.element.data("regexMessage");
                this._suggestions = this.options.suggestions || this.element.data("suggestions");
                
                if(this._suggestions){
                    this._createSuggestion();
                }
                if(regex){
                    this._regex = new RegExp(regex);
                }
            },
            _getSuggestionValue: function(item){
                var multipleSymbolEndRegex = /[,，、\\；;]$/,
                    multipleSymbolRegex = /[,，、\\；;]\s*/;
                var val = this.element.val();
                if (multipleSymbolEndRegex.test(val)) {
                    val = val + item.text;
                }
                else if (multipleSymbolRegex.test(val)) {
                    var splitVal = val.split(multipleSymbolRegex);
                    splitVal[splitVal.length - 1] = item.text;
                    val = splitVal.join(',');
                }
                else {
                    val = item.text;
                }

                return val;
            },
            _createSuggestion: function () {
                var thiz = this;
                this._autocomplete = this.element.autocomplete({
                    source: this._suggestions,
                    "select": function (e, item) {
                        var val = thiz._getSuggestionValue(item);
                        $(this).val(val);
                        thiz.changed();
                        return false;
                    }
                }).data("autocomplete");
            },           
            setSuggestions: function(suggestions){
                this._suggestions = suggestions;
                this._autocomplete.setSource(this._suggestions);
            }
        }
    );  
})(jQuery); 