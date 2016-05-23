(function($){
    $.widget("ui.messageBox", {
        options: {
            
        },
        _create: function () {
            var thiz = this;
            var template =
             '<div class="modal">'+
                '<div class="modal-dialog" style="width: 400px; margin: 200px auto;">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">提示</h4>'+
                        '</div>'+
                        '<div class="modal-body">'+
                            '<span class="glyphicon" style="vertical-align:middle; font-size:34px;"></span>'+
                            '<span class="message-box-content" style="display: inline-block; margin-left: 2em;">sdfsdfsd</span>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<input type="button" class="btn btn-ok btn-default" data-dismiss="modal" value="确定" />'+
                            '<input type="button" class="btn btn-cancel btn-default" data-dismiss="modal" value="取消" />'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
            var $template = $(template);
            this._messageContent = $template.find(".message-box-content");
            this._messageIcon = $template.find(".glyphicon");
            this._btnOk = $template.find(".btn-ok").click(function(){
                if(thiz._okCallback){
                    var callback = thiz._okCallback;
                    thiz._okCallback = null;
                    callback();
                }
            });
            this._btnCancel = $template.find(".btn-cancel").click(function(){
                if(thiz._cancelCallback){
                    var callback = thiz._cancelCallback;
                    thiz._cancelCallback = null;
                    callback();
                }
            });
            this._modal = $template.modal({ show: false, backdrop: "static" }).appendTo("body").data("bs.modal");
            $("body").append(template);
        },
        info: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-info-sign text-primary");
        },
        warning: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-info-sign text-warning");
        },
        confirm: function(msg, okCallback, cancelCallback){
            this._okCallback = okCallback;
            this._cancelCallback = cancelCallback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.show();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-question-sign text-primary");
        },
        success: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-ok-sign text-success");
        },
        error: function(msg, callback){
            this._okCallback = callback;
            this._modal.show();
            this._btnOk.focus();
            this._messageContent.text(msg);
            this._btnCancel.hide();
            this._messageIcon.attr("class", "").addClass("glyphicon glyphicon-remove-sign text-error");
        }
    });
})(jQuery); 

$(function(){
    $.messageBox = $("body").messageBox().data("messageBox");
});