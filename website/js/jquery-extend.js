$.webui = $.webui || {};
$.extend( $.webui, {
	version: "0.1.1",
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});
jQuery.fn.extend({
    inputing: function(callback, delay){
        if(!delay){
            delay = 300;
        }
        var timer = null;
        this.keyup(function(){
            if(timer !== null){
                clearTimeout(timer);
            }
            timer = setTimeout(callback, delay);
        });
        return this;
    },
    horizontalForm: function(){
        this.find(".form-group")
            .each(function(){
                var $this = $(this);
                var parentWidth = $this.parent().width();
                var labelWidth = $this.find(".control-label").outerWidth() || 0;
                $this.find(".control-input").outerWidth(parentWidth - labelWidth - 30);
            });
    },
    caret: function(begin, end) {
		var range;

		if (this.length === 0 || this.is(":hidden")) {
			return;
		}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function() {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	}    
});
jQuery.extend({
    
    resolveUrl: function(path, param){
        var query = "";
        if(param){
            query = $.param(param);
        }
        if($.baseUrl === undefined){
            $.baseUrl = "";
        }
        if(path.indexOf("?") > -1){
            return $.baseUrl + path + query;
        }
        else{
            return $.baseUrl + path + "?" + query;
        }
    },
    toJSON: function(json){
        return JSON.stringify(json);
    },
    formatDate: function(date){
        if(!date){
            return "";
        }
        else if(typeof(date) === "string"){
            return date.split("T")[0];
        }
        else if(typeof(date) === "object"){
            return fecha.format(date, "YYYY-MM-DD");
        }
        return "";
    },
    formatDateTime: function(date){
        if(!date){
            return "";
        }
        else if(typeof(date) === "string"){
            date = date.replace("T", " ");
            if(date.length > 16){
                date = date.substring(0, 16);
            }
        }
        else if(typeof(date) === "object"){
            date = fecha.format(date, "YYYY-MM-DD hh:mm");
        }
        return date;
    },
    toISODate: function(value){
        if(!value){
            return "";
        }
        else if(typeof(value) === "string"){
            return $.trim(value);
        }
        else if(typeof(value) === "object"){
            return fecha.format(value, "YYYY-MM-DD");
        }
        return "";
    },
    toISODateTime: function(value){
        if(!value){
            return "";
        }
        else if(typeof(value) === "string"){
            return $.trim(value).replace(" ", "T");
        }
        else if(typeof(value) === "object"){
            return fecha.format(value, "YYYY-MM-DDThh:mm");
        }
        return "";
    },
    download: function(url){
        if(!$(".__downloadIFrame").length){
            $("body").append("<iframe class='__downloadIFrame' style='display:none'></iframe>");
        }
        $(".__downloadIFrame").attr("src", url);
    },
    format: function(source, params) {
        if ( arguments.length == 1 )
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply( this, args );
            };
        if ( arguments.length > 2 && params.constructor != Array  ) {
            params = $.makeArray(arguments).slice(1);
        }
        if ( params.constructor != Array ) {
            params = [ params ];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    },
    getProperty: function(name, scope){
        if(!scope){
            scope = window;
        }
        for(var n in name.split(",")){
            scope = scope[n];
        }
        return scope;
    }
});

// is extend
jQuery.extend({
    isString: function(s){
        return is.string(s);
    },
    isRegex: function(r){
        return is.regexp(r);
    },
    isDateString: function(d){
        return /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/.test(d);
    },
    isDateTimeString: function(d){
        return /^[0-9]{4}[-][0-9]{2}[-][0-9]{2} [0-9]{2}:[0-9]{2}$/.test(d);
    },
    isObject: function(o){
        var type = typeof o;
        return type === 'object' && !!o;
    }
});
$.ajaxSetup ({
    cache: false
});

Array.prototype.find = function(action){
    var value;
    $.each(this, function(){
        if(action(this)){
            value = this;
            return false;   
        }
    });
    return value;
};
Array.prototype.sum = function(prop){
    var sumValue = 0, tempValue;
    $.each(this, function(){
        tempValue = prop(this);
        if($.isNumeric(tempValue)){
            sumValue += prop(this);
        }
    });
    return sumValue.toFixed(2);
};