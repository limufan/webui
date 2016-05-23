(function($){
    $.widget("webui.complexSelect", $.webui.input, {
            options: {
                required: null,
                name: null,
                source: null,
                single: false,
                textField: null
            },
            _onCreated: function(){
                var thiz = this;
                this._single = this.options.single || this.element.data("single");
                this._source = this.options.source || this.element.data("source") || [];
                this._textField = this.options.textField || this.element.data("textField") || "text";

                this._dropdownMenu = $("<ul style='max-height: 300px;overflow: auto; left: 0; top: 0; z-index: 10000;' class='dropdown-menu' >")
                    .appendTo("body");

                var virtualInput = this._virtualInput = $("<input class='webui-virtual-input'/>");
                this.element.append(virtualInput);
                
                var dropdownTimeout;
                virtualInput.keyup(function(e){
                    if(e.keyCode === $.ui.keyCode.ENTER){
                        return;
                    }
                    var val = virtualInput.val();
                    var width = (val.length * 1) + 2;
                    $(this).width(width.toString() + "em");

                    if(dropdownTimeout){
                        clearTimeout(dropdownTimeout);
                        dropdownTimeout = null;
                    }

                    dropdownTimeout = setTimeout(function(){
                        thiz._renderDropdownMenu(function(){
                            thiz._showDropdownMenu();
                        });
                    }, 300);
                });

                this._bindEvent();
            },
            _bindEvent: function(){
                var thiz = this;
                this.element.click(function(e){
                    thiz._virtualInput.focus();
                    thiz._renderDropdownMenu(function(){
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
            focus: function(){
                this._virtualInput.focus();
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
                this._getSource($.trim(thiz._virtualInput.val()), function(source){
                    thiz._dropdownMenu.empty();
                    $.each(source, function(i, item){
                        var menuContent = "<span style='font-weight:bold'>" +thiz._getTagText(item) + "</span>";
                        if(this.icon){
                            menuContent = "<span class='"+this.icon+"'></span>" + menuContent;
                        }
                        if(this.summary){
                            menuContent += "<div>" + this.summary + "</div>";
                        }
                        var menu = $("<li><a style='white-space: normal' tabindex='-1' href='#'>"+menuContent+"</a></li>")
                            .data("item", this)
                            .click(function(){
                                thiz.appendTag(item);
                                thiz._virtualInput.val("").width("3em").focus();
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
            _getSource: function(keyword, callback){
                var thiz = this;
                if(!keyword){
                    keyword = "";
                }
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
                        var text = thiz._getTagText(item);
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
            appendTag: function(item){
                this._appendTag(item);
                this._changed();
            },
            _appendTag: function(item){
                var thiz = this;
                if(this._single){
                    this.element.find(".webui-tag").remove();
                }
                var tagHtml = 
                    "<div tabindex='-1' class='webui-tag'>"+
                        "<button tabindex='-1' type='button' class='close'>&times;</button>"+
                        "<span class='webui-tag-label'></span>"+
                    "</div>";
                var tag = $(tagHtml).data("item", item).click(function(){return false;});
                tag.find(".webui-tag-label").text(this._getTagText(item));
                tag.find(".close").click(function(e){
                    tag.remove();
                    thiz._changed();
                    e.stopPropagation();
                });
                this._virtualInput.before(tag);
            },
            clearTag: function(){
                var tagsCount = this._clearTag();
                if(tagsCount){
                    this._changed();
                }
            },
            _clearTag: function(){
                var tagsCount = this.element.find(".webui-tag").length;
                this.element.find(".webui-tag").remove();
                return tagsCount;
            },
            getValue: function(){
                var values = [];
                this.element.find(".webui-tag").each(function(){
                    var item = $(this).data("item");
                    values.push(item);
                });
                if(!values.length){
                    return null;
                }
                if(this._single){
                    return values[0];
                }
                return values;
            },
            setValue: function(value){
                var thiz = this;
                this._clearTag();
                var text = "";
                if($.isArray(value)){
                    var texts = [];
                    $.each(value, function(i, item){
                        thiz._appendTag(item);
                        texts.push(thiz._getTagText(item));
                    });
                    text = texts.toString();
                }
                else if(value){
                    thiz._appendTag(value);
                    text = thiz._getTagText(value);
                }
                this._textElement.text(text);
            },
            _getTagText: function(item){
                if(typeof(item) === "object"){
                    return item[this._textField];
                }
                return item;
            }
        }
    );
})(jQuery);