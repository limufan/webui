(function($){
    $.widget("webui.mask", {
            options: {
                pattern: null,
                definitions: {'9': /[0-9]/, 'a': /[A-Za-z]/, '*': /[A-Za-z0-9]/},
                placeholder: "_"
            },
            _create: function(){
                var thiz = this, $element = this.element, input = this.element.data("input");
                this._pattern = this.options.pattern;
                this._definitions = this.options.definitions;
                this._placeholder = this.options.placeholder;
                this._patternRegexes = [];
                this._patternChars = [];
                this._patternPlaceholder = "";

                this._initPattern();
                $element.keydown(function(e){
                    var pos, deleteLength, deleteIndex;
                    if(e.which == $.webui.keyCode.BACKSPACE){
                        pos = $element.caret(); 
                        deleteLength = pos.end - pos.begin; 
                        deleteIndex = pos.begin - 1;
                        thiz._delete(deleteIndex, deleteLength);
                        return false;
                    }
                    else if(e.which == $.webui.keyCode.DELETE){
                        pos = $element.caret(); 
                        deleteLength = pos.end - pos.begin; 
                        deleteIndex = pos.begin;
                        thiz._delete(deleteIndex, deleteLength);
                        return false;
                    }
                });

                $element.keypress(function(e){
                    var char = String.fromCharCode(e.which);
                    if(thiz._validteInputChar(char)){
                        thiz._insert(char);
                    }
                    return false;
                });

                $element.blur(function(e){
                    var val = $element.val();
                    if(val === thiz._patternPlaceholder){
                        input.setValue("");
                        input.changed();
                    }
                });
            },
            _initPattern: function(){
                var definition, definitionPattern = "", splitChar;
                this._definitions[this._placeholder] = new RegExp(this._placeholder);
                for(i = 0; i < this._pattern.length; i ++){
                    definition =  this._definitions[this._pattern.charAt(i)];
                    if(definition){
                        this._patternRegexes.push(definition);
                        this._patternPlaceholder += this._placeholder;
                    }
                    else{
                        splitChar = this._pattern.charAt(i);
                        this._patternRegexes.push(new RegExp(splitChar));
                        this._patternChars.push(splitChar);
                        this._patternPlaceholder += splitChar;
                    }
                }
            },
            _delete: function(deleteIndex, deleteLength){
                var value = this.element.val(),
                    inputChars = value.split("");
                if(deleteLength <= 0){
                    deleteLength = 1;
                }
                if(deleteIndex < 0){
                    deleteIndex = 0;
                }
                inputChars.splice(deleteIndex, deleteLength);
                value = inputChars.join("");
                value = this._format(inputChars);
                this.element.val(value);
                this.element.caret(deleteIndex);
            },
            _insert: function(insertChar){
                var pos = this.element.caret(),
                    value = this.element.val(),
                    inputChars = value.split(""), deleteLength = pos.end - pos.begin, insertIndex = pos.begin;
                if(deleteLength <= 0){
                    deleteLength = 1;
                }
                //如果字符不是格式化字符
                while(insertIndex < this._pattern.length && !this._isMaskChar(insertIndex)){
                    insertIndex ++;
                }
                inputChars.splice(insertIndex, deleteLength, insertChar);
                value = this._format(inputChars);
                this.element.val(value);
                insertIndex ++;
                while(insertIndex < this._pattern.length && !this._isMaskChar(insertIndex)){
                    insertIndex ++;
                }
                this.element.caret(insertIndex);
            },
            _format: function(inputChars){
                var patternRegex, patternChar, patternChars,
                    definition, formatChars = [], formatChar, inputChar, i;
                patternChars = this._patternChars.slice(0);
                //203-00-11 203s-00-11 9999-99-99
                patternChar = patternChars.shift();
                inputChar = inputChars.shift();
                for(i = 0; i < this._patternRegexes.length; i ++){
                    patternRegex =  this._patternRegexes[i];
                    formatChar = this._placeholder;
                    if(patternRegex.test(inputChar)){
                        //匹配成功接收输入字符，并且替换输入字符
                        formatChar = inputChar;
                        inputChar = inputChars.shift();
                        //如果是分割字符，替换分割字符
                        if(patternRegex.test(patternChar)){
                            patternChar = patternChars.shift();
                        }
                    }
                    else{
                        //如果是分割字符替换分割字符并且替换分割字符，否则为设置为待输入字符
                        if(patternRegex.test(patternChar)){
                            formatChar = patternChar;
                            patternChar = patternChars.shift();
                        }
                        else{
                            formatChar = this._placeholder;
                            //如果输入不是分割字符就替换输入字符
                            if(inputChar !== patternChar){
                                inputChar = inputChars.shift();
                            }
                        }
                    }
            
                    formatChars.push(formatChar);
                }
                return formatChars.join("");
            },
            //是格式化字符
            _isMaskChar: function(index){
                return this._pattern[index] in this._definitions;
            },
            //验证输入字符
            _validteInputChar: function(char){
                for(var i = 0; i < this._patternRegexes.length; i++){
                    if(this._patternRegexes[i].test(char)){
                        return true;
                    }
                }
                return false;
            }
        }
    );    
})(jQuery);
