(function($){
    $.widget("webui.selectInput", $.webui.input, {
            _load: function(){
                var thiz = this;
                this._textField = this.options.textField || this.element.data("textField") || "text";
                this._valueField = this.options.valueField || this.element.data("valueField") || "value";
                this._source = this.options.source || this.element.data("source");
                if($.isString(this._source)){
                    this._source = eval(this._source);
                }
                
                if($.isArray(this._source)){
                    this.setSource(this._source);
                }
                else if($.isObject(this._source)){
                    this.setSource(this._source);
                }
            },
            setSource: function(source){
                var thiz = this;
                this.element.empty();
                this._items = [];
                if($.isArray(source)){
                    $.each(source, function(i, s){
                        if(s.group && s.source && s.source.length){
                            thiz._appendGroup(s.group);
                            $.each(s.source, function(_i, _s){
                                thiz._appendItem(_s);
                            });
                        }
                        else{
                            thiz._appendItem(s);
                        }
                    });
                }
                this._sourceChanged();
            },
            _sourceChanged: function(){
            
            },
            _appendGroup: function(text){
                var element = this._getGroupElement(text);
                if(element){
                    this.element.append(element);
                }
            },
            _getGroupElement: function(text){
                
            },
            _appendItem: function(item){
                var text, value;
                this._items.push(item);
                text = this._getItemText(item);
                value = this._getItemValue(item);
                
                var element = this._getSelectElement(value, text);
                this.element.append(element);
            },
            _getSelectElement: function(value, text){
                return "<div></div>";
            },
            _getText: function(value){
                var item = this._findItemByValue(value);
                var text = this._getItemText(item);
                if(!text){
                    return value;
                }
                return text;
            },
            _getItemValue: function(item){
                if($.isObject(item)){
                    return item[this._valueField];
                }
                else{
                    return item;
                }
            },
            _getItemText: function(item){
                if($.isObject(item)){
                    return item[this._textField];
                }
                else{
                    return item;
                }
            },
            _findItemByValue: function(value){
                var thiz = this, item;
                if(this._items){
                    $.each(this._items, function(i, _item){
                        if(thiz._getItemValue(_item) === value){
                            item = _item;
                            return false;
                        }
                    });
                }
                return item;
            }
        }
    );
})(jQuery);
