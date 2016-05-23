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
            _createSuggestion: function(){
                function split(val) {
                    return val.split(multipleSymbolRegex);
                }
                function extractLast(term) {
                    return split(term).pop();
                }
                
                var multipleSymbolRegex = /[,，、\\；;]\s*/,
                    multipleSymbolEndRegex = /[,，、\\；;]$/,
                    suggestions = this._suggestions;
                if($.isString(suggestions)){
                    try{
                        suggestions = eval(suggestions);
                    }
                    catch(e){
                        
                    }
                }
                this.element.autocomplete({
                    source: function (request, response) {
                        if($.isString(suggestions)){
                            $.getJSON( suggestions, {term: extractLast( request.term )}, response );
                        }
                        else{
                            response($.ui.autocomplete.filter(suggestions, extractLast(request.term)));
                        }
                    },
                    focus: function () {
                        return false;
                    },
                    minLength: 0,
                    select: function (event, ui) {
                        var val = $(this).val();
                        if (multipleSymbolEndRegex.test(val)) {
                            $(this).val( val + ui.item.value);
                        }
                        else {
                            $(this).val(ui.item.value);
                        }
                        return false;
                    }
                })
                .click(function () {
                    $(this).autocomplete("search", "");
                });
            },           
            setSuggestions: function(suggestions){
                this._suggestions = suggestions;
                this._createSuggestion();
            }
        }
    );  
})(jQuery); 