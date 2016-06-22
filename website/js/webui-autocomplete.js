(function($){
    $.widget("webui.autocomplete", {
            options: {
                input: null,
                source: null
            },
            _create: function(){
                var thiz = this;
                this._source = this.options.source || this.element.data("source") || [];
                this._textField = this.options.textField || this.element.data("textField") || "text";
                if (this.options.input !== null) {
                    this._input = this.options.input;
                }
                else {
                    this._input = this.element;
                }

                this._dropdownMenu = $("<ul style='max-height: 300px;overflow: auto; left: 0; top: 0; z-index: 10000;' class='dropdown-menu' >")
                    .appendTo("body");
                this._bindEvent();
            },
            _bindEvent: function () {
                var thiz = this;

                var dropdownTimeout;
                this._input.keyup(function (e) {
                    if (e.keyCode === $.ui.keyCode.ENTER) {
                        return;
                    }

                    if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout);
                        dropdownTimeout = null;
                    }

                    dropdownTimeout = setTimeout(function () {
                        thiz._renderDropdownMenu(function () {
                            thiz._showDropdownMenu();
                        });
                    }, 300);
                });

                this._input.click(function (e) {
                    thiz._renderDropdownMenu(function () {
                        thiz._showDropdownMenu();
                    });
                    thiz._showing = true;
                });

                $("html").click(function(){
                    if(thiz._showing !== true){
                        thiz._hideDropdownMenu();
                    }
                    thiz._showing = false;
                });

                this._dropdownMenu.click(function(e){
                    e.stopPropagation();
                });
            },
            _showDropdownMenu: function(){
                var elementOuterWidth = this.element.outerWidth();
                this._dropdownMenu.outerWidth(elementOuterWidth);
                var elementOuterHeight = this.element.outerHeight();
                var elementOffset = this.element.offset();
                var elementTop = elementOffset.top;
                var elementBottom = elementOffset.top + elementOuterHeight;
                var menuOuterHeigth = this._dropdownMenu.outerHeight();
                var windowHeight = $(window).height();
                if((windowHeight - elementBottom - menuOuterHeigth) < 0){
                    this._dropdownMenu.css({top: elementTop - menuOuterHeigth, left: elementOffset.left, display: "block"});
                }
                else{
                    this._dropdownMenu.css({top: elementBottom, left: elementOffset.left, display: "block"});
                }
            },
            _hideDropdownMenu: function(){
                this._dropdownMenu.hide();
            },
            _renderDropdownMenu: function(renderedCallback){
                var thiz = this;
                this._getSource($.trim(thiz._input.val()), function(source){
                    thiz._dropdownMenu.empty();
                    $.each(source, function(i, item){
                        var menuContent = "<span style='font-weight:bold'>" +thiz._getItemText(item) + "</span>";
                        if(this.icon){
                            menuContent = "<span class='"+this.icon+"'></span>" + menuContent;
                        }
                        if(this.summary){
                            menuContent += "<div>" + this.summary + "</div>";
                        }
                        var menu = $("<li><a style='white-space: normal' tabindex='-1' href='#'>" + menuContent + "</a></li>")
                            .data("item", this)
                            .click(function () {
                                var selectArgs = {item: item};
                                selectArgs.text = thiz._getItemText(item);
                                thiz._trigger("select", null, selectArgs);
                                thiz._hideDropdownMenu();
                                return false;
                            });
                        thiz._dropdownMenu.append(menu);
                    });
                    if(renderedCallback){
                        renderedCallback();
                    }
                });
            },
            _extractKeyword: function (keyword) {
                var multipleSymbolRegex = /[,，、\\；;]\s*/;
                return keyword
                    .split(multipleSymbolRegex)
                    .pop();
            },
            _getSource: function(keyword, callback){
                var thiz = this;

                if(!keyword){
                    keyword = "";
                }
                keyword = this._extractKeyword(keyword);
                keyword = keyword.toLowerCase();

                if($.isString(this._source)){
                    try{
                        this._source = eval(this._source);
                    }
                    catch(e){
                    
                    }
                }

                if($.isArray(this._source)){
                    var source = $.grep(this._source, function(item){
                        var text = thiz._getItemText(item);
                        return text.toLowerCase().indexOf(keyword) > -1;
                    });
                    callback(source);
                }
                else if($.isString(this._source)){
                    $.getJSON(this._source, {keyword: keyword, t: $.now()}, function(data){
                        callback(data);
                    });
                }
            },
            setSource: function(source){
                this._source = source;
            },
            _getItemText: function (item) {
                if (typeof (item) === "object") {
                    return item[this._textField];
                }
                return item;
            }
        }
    );
})(jQuery);