(function($){
    var template = 
        '<ul class="webui-pagination-nav" >' +
            '<li class="webui-pagination-first"><a href="#"><span title="第一页" class="glyphicon glyphicon-step-backward"></span></a></li>' +
            '<li class="webui-pagination-previous"><a href="#"><span title="上一页" class="glyphicon glyphicon-backward"></span></a></li>' +
        '</ul>' +
        '<ul class="webui-pagination-nav webui-pagination-number" style="margin-left: 10px;"></ul>' +
        '<div class="webui-pagination-input"><input class="form-control webui-pagination-page-index"/><span class="webui-pagination-page-count"></span></div>' +
        '<ul class="webui-pagination-nav" >' +
            '<li class="webui-pagination-next"><a href="#"><span title="下一页" class="glyphicon glyphicon-forward"></span></a></li>' +
            '<li class="webui-pagination-last"><a href="#"><span title="最后一页" class="glyphicon glyphicon-step-forward"></span></a></li>' +
        '</ul>' +
        '<div class="webui-pagination-input" ><select class="form-control webui-pagination-page-size" style="width: 80px;"></select></div>' +
        '<div class="webui-pagination-summary"></div>';
    $.widget("webui.pagination", {
            options: {
                start: 0, 
                count: 1,
                visiblePages: 10,
                showPageNumber: true,
                sizeOptions: [20, 50, 100],
                size: 20
            },
            _create: function(){
                this._start = this.options.start;
                this._count = this.options.count;
                this._sizeOptions = this.options.sizeOptions;
                this._size = this.options.size;
                this._showPageNumber = this.options.showPageNumber;
                this._visiblePages = this.options.visiblePages;

                this.element.addClass("webui-pagination clearfix").append(template);
                this._lnkFirst = this.element.find(".webui-pagination-first");
                this._lnkPrevious = this.element.find(".webui-pagination-previous");
                this._lnkNext = this.element.find(".webui-pagination-next");
                this._lnkLast = this.element.find(".webui-pagination-last");
                this._txtPageIndex = this.element.find(".webui-pagination-page-index");
                this._txtPageSize = this.element.find(".webui-pagination-page-size");
                this._paginationNumber = this.element.find(".webui-pagination-number");
                this._lblPageCount = this.element.find(".webui-pagination-page-count");
                this._lblSummary = this.element.find(".webui-pagination-summary");
                this._init();
                this._render();
                this._bindEvent();
            },
            _init: function(){
                this._renderSizeOptions();
            },
            _bindEvent: function(){
                var thiz = this;
                this._lnkFirst.click(function(){
                    thiz._change(1);
                    return false;
                });
                this._lnkPrevious.click(function(){
                    thiz._change(thiz._pageIndex - 1);
                    return false;
                });
                this._lnkNext.click(function(){
                    thiz._change(thiz._pageIndex + 1);
                    return false;
                });
                this._lnkLast.click(function(){
                    thiz._change(thiz._pageCount);
                    return false;
                });
                this._txtPageIndex.keyup(function(event){
                    if(event.which == 13){
                        var index = parseInt($(this).val());
                        thiz._change(index);
                    }
                });
                this._txtPageSize.change(function(){
                    thiz._calculate();
                    thiz._change(thiz._pageIndex);
                });
            },
            _change: function(pageIndex){
                if(!pageIndex){
                    pageIndex = 1;
                }
                var start = (pageIndex - 1) * this._size;
                if(start < 0){
                    start = 0;
                }
                if(start >= this._count){
                    start = (this._pageCount - 1) * this._size;
                }
                this._trigger("change", null, {start: start, size: this._size});
            },
            _render: function(){
                this._calculate();
                this._renderSummary();
                this._renderPageIndex();
                this._renderPageCount();
                this._renderNavigation();
                this._renderPagiationNumber();
            },
            _renderSummary: function(){
                var _end = this._start + this._size;
                if(this._count < _end){
                    _end = this._count;
                }
                var _start = this._start + 1;
                if(this._count <= 0){
                    _start = 0;
                }
                this._lblSummary.text($.format("{0} - {1} / {2}", _start, _end, this._count));
            },
            _renderPageIndex: function(){
                this._txtPageIndex.val(this._pageIndex);
            },
            _renderPageCount: function(){
                this._lblPageCount.text(" / " + this._pageCount);
            },
            _renderNavigation: function(){
                if(this._pageIndex <= 1){
                    this._lnkPrevious.addClass("disabled");
                    this._lnkFirst.addClass("disabled");
                }
                else{
                    this._lnkPrevious.removeClass("disabled");
                    this._lnkFirst.removeClass("disabled");
                }

                if(this._pageIndex >= this._pageCount){
                    this._lnkNext.addClass("disabled");
                    this._lnkLast.addClass("disabled");
                }
                else{
                    this._lnkNext.removeClass("disabled");
                    this._lnkLast.removeClass("disabled");
                }
            },
            _renderPagiationNumber: function(){
                if(!this._showPageNumber){
                    return;
                }
                this._paginationNumber.empty();
                var thiz = this, i = 0,
                    halfVisiblePages = Math.floor(this._visiblePages / 2);
                //所有页码大于显示页码
                if(this._pageCount > this._visiblePages){
                    if(this._pageIndex >= (this._pageCount - halfVisiblePages)){
                        i = this._pageCount - this._visiblePages;
                    }
                    else if(this._pageIndex > halfVisiblePages){
                        i = this._pageIndex - halfVisiblePages;
                    }
                }
                
                var visiblePages = i + this._visiblePages;
                for(; i < visiblePages && i < thiz._pageCount; i++){
                    this._appendNumberLink(i + 1);
                }
            },
            _renderSizeOptions: function(){
                if(this._sizeOptions){
                    var optionsHtml = "";
                    $.each(this._sizeOptions, function(i, size){
                        optionsHtml += $.format("<option>{0}</option>", size);
                    });
                    this._txtPageSize.html(optionsHtml);
                }
                this._txtPageSize.val(this._size);
            },
            _appendNumberLink: function(pageIndex){
                var thiz = this;
                var numberLink = $($.format('<li><a href="#">{0}</a></li>', pageIndex)).appendTo(this._paginationNumber);
                if(this._pageIndex == pageIndex){
                    numberLink.addClass("active");
                }
                numberLink.click(function(){
                    thiz._change(pageIndex);
                    return false;
                });
            },
            _calculate: function(){
                this._calculatePageSize();
                this._calculatePageIndex();
                this._calculatePageCount();
            },
            _calculatePageSize: function(){
                var size = parseInt(this._txtPageSize.val());
                if(!size){
                    size = this._sizeOptions[0];
                }
                this._size = size;
            },
            _calculatePageCount: function(){
                if(this._size <= 0){
                    return 0;
                }
                var pageCount = parseInt(this._count / this._size);
                if((this._count % this._size) > 0){
                    pageCount = pageCount + 1;
                }
                this._pageCount = pageCount;
            },
            _calculatePageIndex: function(){
                this._pageIndex = parseInt(this._start / this._size) + 1;
            },
            setPageInfo: function(pageInfo){
                this._start = pageInfo.start;
                this._count = pageInfo.count;

                this._render();
            },
            getPageSize: function(){
                return this._size;
            }
        }
    );
})(jQuery);