(function($){
    $.widget("webui.popoverTrigger", {
            options: {
                placement: "bottom",
                popover: null
            },
            _create: function(){
                var thiz = this;
                
                this._popover = this.options.popover;

                this.element.click(function(){
                    thiz.toggle();
                    return false;
                });
            },
            show: function(){
                var my, at; 
                var placement = this.options.placement;
                if(placement == 'bottom'){
                    my = "top";
                    at = "bottom";
                }
                else if(placement == 'top'){
                    my = "bottom";
                    at = "top";
                }
                else if(placement == 'left'){
                    my = "right";
                    at = "left";
                }
                else{
                    my = "left";
                    at = "right";
                }
                this._popover.show().position({my: my, at: at, of: this.element});
            },
            hide: function(){
                this._popover.hide();
            },
            toggle: function(){
                if(this._popover.is( ":hidden" )){
                    this.show();
                }
                else{
                    this.hide();
                }
            }
        }
    );
})(jQuery);