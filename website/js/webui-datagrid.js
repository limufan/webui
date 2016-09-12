(function( $, undefined ) {
var dagaridRenders = {
    numberEditor: function (value, datarow, cell, column, precision){
        if($.isNumeric(value)){
            value = value.toFixed(precision);
        }
        else{
            value = "";
        }
        var cellWidth = column.width;
        var inputElement = $("<input style='border: none;'/>")
            .outerWidth(cellWidth)
            .val(value)
            .change(function(){
                var changeValue = parseFloat(inputElement.val());
                if(!$.isNumeric(changeValue)){
                    changeValue = 0;
                }
                var rowValue = datarow.getValue();
                rowValue[column.field] = changeValue;
                datarow.setValue(rowValue);
            });
        return inputElement;
    },
    intEditor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 0);
    },
    number1Editor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 1);
    },
    number2Editor: function(value, datarow, cell, column){
        return dagaridRenders.numberEditor(value, datarow, cell, column, 2);
    }
};
var cloumnDefaultWidth = 100;

$.widget( "webui.datagrid", $.webui.input, {
    _headerCells: null,
    _rows: null,
    options: {
        columns: null,
        singleSelect: false,
        width: null,
        height: null,
        data: null,
        showNumberColumn: false,
        name: null,
        defaultValue: null,
        required: false,
        readonly: false,
        hideHeader: false,
        bordered: true,
        textWrap: false
    },
    _onCreated: function() {
        this._defaultValue = this.options.data;
        this._footer = this.options.footer;
        var self = this, header, headerContent, body, bodyContent;
        this._headerCells = [];
        this._rows = [];
        this.element.addClass("ui-datagrid");
        
        if(this.options.columns === null || !this.options.columns.length){
            return;
        }
        header = this._header = $("<div class='ui-datagrid-header'><div class='ui-datagrid-header-content'><table class='table table-bordered'><thead><tr></tr></thead></table></div></div>");

        this.element.append(header);
        headerContent = this._headerContent = header.children(".ui-datagrid-header-content");
        
        body = this._body = $("<div class='ui-datagrid-body'><div class='ui-datagrid-body-content'><table class='table table-bordered table-hover'></table></div></div>");
        bodyContent = this._bodyContent = body.find("table");
        body.scroll(function(){
            header.scrollLeft($(this).scrollLeft());
        });
        this.element.append(body);
        if(!this.options.bordered){
            this.element.find("table").removeClass("table-bordered");
        }
        if(this.options.textWrap){
            this.element.addClass("wrap");
        }else{
            this.element.addClass("ellipsis");
        }

        if(!this.options.hideHeader){
            this._renderHeader();
        }
        this.refreshSize();
        $(window).resize(function() {
            self.refreshSize();
        });
    },
    _renderHeader: function(){
        this._renderHeaderNumberCell();
        this._renderHeaderCheckboxCell();
        this._renderHeaderCells();
    },
    _renderHeaderNumberCell: function(){
        this._header.find(".ui-datagrid-header-numbercell").remove();
        if(this.options.showNumberColumn){
            var th = $("<th class='ui-datagrid-header-numbercell' ><div class='ui-datagrid-header-cell'></div></th>");
            this._header.find("tr").append(th);
        }
    },
    _renderHeaderCheckboxCell: function(){
        var self = this, th;
        this._header.find(".ui-datagrid-header-checkbox-cell").remove();
        if(!this.options.singleSelect){
            th = $("<th class='ui-datagrid-header-checkbox-cell' ><div class='ui-datagrid-header-cell'><input type='checkbox'/></div></th>");
            th.click(function(ev){
                self._onHeaderCheckboxCell_click($(this));
                ev.stopPropagation();
            });
            this._header.find("tr").append(th);
        }
    },
    _renderHeaderCells: function(){
        var self = this, datagridHeight;
        if(this._headerCells && this._headerCells.length){
            $.each(this._headerCells, function () {
                $(this.element).remove();
            });
        }
        datagridHeight = self._getHeight();
        this._headerCells = [];
        $.each(this.options.columns, function(i, column){
            var cellElement, th, index, cellHeight, cell;
            cellElement = $("<div class='ui-datagrid-header-cell'></div>");
            if(column.sortDirection === "desc"){
                cellElement.append("<span class='ui-datagrid-header-sort-icon'>▼</span>");
            }
            else if(column.sortDirection === "asc"){
                cellElement.append("<span class='ui-datagrid-header-sort-icon'>▲</span>");
            }
            cellElement.append("<span class='ui-datagrid-header-title'>" + column.title + "</span>");
            th = $("<th></th>").append(cellElement);
            self._header.find("tr").append(th);
            index = self._header.find("th").index(th);
            cellHeight = cellElement.outerHeight();
            cellElement.resizable({
                handles: "e",
                helper: "ui-datagrid-resize-helper",
                resize: function (event, ui) {
                    ui.helper.css("height", datagridHeight);
                },
                start: function(){
                    datagridHeight = self._getHeight();
                    if (!datagridHeight) {
                        datagridHeight = self.element.height();
                    }
                    self._cellResizing = true;
                },
                stop: function(event, ui){
                    ui.originalElement.css("height", "auto");
                    self._header.find("colgroup").find("col").eq(index).css("width", ui.size.width);
                    self._body.find("colgroup").find("col").eq(index).css("width", ui.size.width);
                    cellElement.css("width", ui.size.width);
                    self._cellResizing = false;
                }
            });
            cell = {element: th, column: column};
            self._headerCells.push(cell);
            cellElement.click(function () {
                var orderBy = column.orderBy || column.field;
                if (self.options.canSort && orderBy) {
                    self._sortBy(cell, self._toggleDirection(column.sortDirection));
                }
            });
        });
    },
    _toggleDirection: function(direction){
        if(direction === "desc"){
            return "asc";
        }else{
            return "desc";
        }
    },
    sortBy: function(columnName, direction){
        var cells, cell;
        cells = $.grep(this._headerCells, function(cell){
            return cell.column.name === columnName;
        });
        if(cells && cells.length){
            cell = cells[0];
            this._sortBy(cell, direction);
        }
    },
    _sortBy: function(cell, direction){
        this._header.find(".ui-datagrid-header-sort-icon").remove();
        cell.column.sortDirection = direction;
        if(direction === "desc"){
            cell.element.find(".ui-datagrid-header-cell").prepend("<span class='ui-datagrid-header-sort-icon'>▼</span>");
        }
        else if(direction === "asc"){
            cell.element.find(".ui-datagrid-header-cell").prepend("<span class='ui-datagrid-header-sort-icon'>▲</span>");
        }
        var orderBy = cell.column.orderBy || cell.column.field;
        this._trigger("sort", null, { orderBy: orderBy, descending: direction === "desc" });
    },
    refreshSize: function () {
        if (this._cellResizing) {
            return;
        }
        this._renderWidth();
        this._renderHeight();
    },
    _renderHeight: function(){
        var height = this._getHeight(), headerHeight;
        if(height){
            this.element.outerHeight(height);
            headerHeight = this._header.outerHeight();
            if(height >= headerHeight){
                this._body.outerHeight(height - headerHeight);
            }
        }
    },
    _getHeight: function () {
        var height;
        if(this.options.height === "auto"){
            height = $(window).height() - $(document.body).outerHeight() + this.element.outerHeight();
        }
        else if(this.options.height){
            height = this.options.height;
        } 
        return height;
    },
    _renderWidth: function(){
        if(this.options.width){
            this._header.css("width", this.options.width);
            this._body.css("width", this.options.width);
            this._headerContent.css("width", this.options.width);
            var headerTableWidth = this._headerContent.find("table").width();
            if(this._headerContent.width() < headerTableWidth + 30){
                this._headerContent.width(headerTableWidth + 30);
            }
        }
        
        var colgroup = this._getColgroup();
        this._header.find("colgroup").remove();
        this._body.find("colgroup").remove();
        this._header.find("table").prepend(colgroup);
        this._body.find("table").prepend(colgroup);
    },
    _getColgroup: function(){
        var colsHtml = "", width, knownWidth = 0, usableWidth = 0;
        $.each(this.options.columns, function(i, column){
            if($.isNumeric(column.width)){
                knownWidth += column.width;
            }
            else if(!column.width){
                knownWidth += cloumnDefaultWidth;
            }
        });
        if(this.options.showNumberColumn){
            colsHtml += "<col style='width: 30px'>";
            knownWidth += 30;
        }
        if(!this.options.singleSelect){
            colsHtml += "<col style='width: 30px'>";
            knownWidth += 30;
        }
        var headerWidth = this._header.width();
        usableWidth = headerWidth - knownWidth - 30;
        if(usableWidth < 0){
            usableWidth = 80;
        }
        $.each(this.options.columns, function(i, column){
            if($.isNumeric(column.width)){
                width = column.width;
            }
            else if(/%$/.test(column.width)){
                width = Math.floor(parseInt(column.width) * 0.01 * usableWidth) - 1;
            }
            else{
                width = cloumnDefaultWidth;
            }
            colsHtml += "<col style='width: "+ width +"px'>";
        });
        return "<colgroup>"+ colsHtml +"</colgroup>";
    },
    _renderBody: function(){
        var self = this;
        $.each(this._rows, function(i, row){
            self.deleteRow(row);
        });
        this._rows = [];
        if(this.options.data && this.options.data.length){
            $.each(this.options.data, function(i, data){
                self._renderRow(data);
            });
        }
        this._renderFooter();
    },
    _getRowTemplate: function(){
        var tr = $("<tr></tr>");
        if(this.options.showNumberColumn){
            $("<td></td>").attr("column-name", "number").appendTo(tr);
        }
        if(!this.options.singleSelect){
            $("<td></td>").attr("column-name", "checkbox").appendTo(tr);
        }
        $.each(this.options.columns, function(i, column){
            $("<td></td>").attr("column-name", column.name).appendTo(tr);
        });
        return tr;
    },
    _renderFooter: function(){
        var footerCell, footerCellValue, td, colspan, column, tr, gridValue,
            thiz = this;
        if(this._footerElement){
            this._footerElement.remove();
        }
        gridValue = this.getValue();
        if(gridValue.length && this._footer && this._footer.length){
            tr = this._getRowTemplate();
            this._footerElement = $("<tfoot></tfoot>").append(tr).appendTo(this._bodyContent);
            $.each(this._footer, function(){
                footerCell = this;
                //cell value
                switch(footerCell.valueType){
                    case "sum":
                        column = thiz.options.columns.find(function(col){return col.name == footerCell.columnName;});
                        footerCellValue = gridValue.sum(function(value){return value[column.field];});
                        break;
                    case "fixed":
                        footerCellValue = footerCell.value;
                        break;
                }
                //colspan
                td = tr.find("td[column-name='"+footerCell.columnName+"']")
                    .text(footerCellValue);
                if(footerCell.colspan){
                    colspan = footerCell.colspan;
                    while(colspan > 1){
                        td.next().eq(0).remove();
                        colspan -= 1;
                    }
                    td.attr("colspan", footerCell.colspan);
                }
            });
        }
    },
    setFooter: function(footer){
        this._footer = footer;
        this._renderFooter();
    },
    _renderRow: function (data, index) {
        var self = this, datarow;
        datarow = $("<tr></tr>");
        if(index >= 0 && this._rows.length > index){
            var insertDataRow = this._rows[index];
            insertDataRow.before(datarow);
            this._rows.splice(index, 0, datarow);
        }
        else{
            datarow.appendTo(this._bodyContent);
            this._rows.push(datarow);
        }
        
        datarow.datarow({
                columns: this.options.columns,
                showNumberCell: this.options.showNumberColumn,
                showCheckboxCell: !this.options.singleSelect,
                data: data
            })
            .bind("datarowselected", function(evt, row){self._onDatarow_selected(row);})
            .bind("datarowunselected", function(evt, row){self._onDatarow_unselected(row);})
            .bind("datarowchanged", function(){self._changed();})
            .click(function(){self._onDatarow_click($(this));})
            .dblclick(function(){self._onDatarow_dblclick($(this));});
        this._refreshNumberRow();
        return datarow;
    },
    appendRow: function(data){
        var datarow = this._renderRow(data);
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    prependRow: function(data){
        var datarow = this._renderRow(data, 0);
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    afterRow: function(data, datarow1){
        var self = this, datarow;
        datarow = $("<tr></tr>");
        datarow1.after(datarow);
        datarow.datarow({
            columns: this.options.columns,
            showNumberCell: this.options.showNumberColumn,
            showCheckboxCell: !this.options.singleSelect,
            data: data
        })
        .bind("datarowselected", function(evt, row){self._onDatarow_selected(row);})
        .bind("datarowunselected", function(evt, row){self._onDatarow_unselected(row);})
        .bind("datarowchanged", function(){self._changed();})
        .click(function(){self._onDatarow_click($(this));})
        .dblclick(function(){self._onDatarow_dblclick($(this));});

        this._rows.push(datarow);
        this._refreshNumberRow();
        this._trigger("addedRow", null, {row: datarow, data: data});
        this._changed();
        return datarow;
    },
    _onChanging: function(){
        this._renderFooter();
    },
    _onDatarow_selected: function(row){
        if(this._bodyContent.find(".active").length === this._rows.length){
            this._header.find(".ui-datagrid-header-checkbox-cell input").attr("checked", "checked");
        }
        this._trigger("selectedRow", null, row);
    },
    _onDatarow_unselected: function(row){
        this._header.find(".ui-datagrid-header-checkbox-cell input").removeAttr("checked");
        this._trigger("unselectedRow", null, row);
    },
    _onDatarow_click: function(clickRow){
        $.each(this._rows, function(i, row){
            if(!row.is(clickRow)){
                row.datarow("unselect");
            }
        });
    },
    _onDatarow_dblclick: function(row){
        this._trigger("dblclickRow", null, row);
    },
    _onHeaderCheckboxCell_click: function(cell){
        if(cell.find("input").prop("checked")){
            this.selectAllRow();
        }
        else{
            this.unselectAllRow();
        }
    },
    selectAllRow: function(){
        $.each(this._rows, function(i, row){
            row.datarow("select");
        });
    },
    unselectAllRow: function(){
        $.each(this._rows, function(i, row){
            row.datarow("unselect");
        });
    },
    _refreshNumberRow: function(){
        if(this.options.showNumberColumn){
            var numberRows = this._bodyContent.find("tr td:first-child"), i = 0;
            for(; i < numberRows.length; i++){
                numberRows.eq(i).text(i + 1);
            }
        }
    },
    getRows: function(){
        return this._rows;
    },
    getRowsData: function(){
        return $.map(this._rows, function(row){
            return row.datarow("getValue");
        });
    },
    deleteSelectedRows: function(){
        var self = this, selectRows;
        selectRows = this.getSelectedRows();
        $.each(selectRows, function(i, row){
            self.deleteRow(row);
        });
        this._changed();
    },
    getSelectedRows: function(){
        var selectRows = $.grep(this._rows, function(row){
            return row.datarow("isSelected");
        });
        return selectRows;
    },
    getSelectedRow: function(){
        var selectRows = this.getSelectedRows();
        if(selectRows && selectRows.length){
            return selectRows[0];
        }
        return null;
    },
    deleteRow: function(deletedRow){
        if(typeof deletedRow === "number"){
            deletedRow = this._rows[deletedRow];
        }
        if(!deletedRow){
            return;
        }
        var self = this, rows = [], data;
        $.each(this._rows, function(i, row){
            if(row !== deletedRow){
                rows.push(row);
            }else{
                data = row.datarow("getValue");
                row.remove();
                self._trigger("deletedRow", null, data);
            }
        });
        this._rows = rows;
        this._header.find(".ui-datagrid-header-checkbox-cell input").removeAttr("checked");
        this._refreshNumberRow();
    },
    setValue: function(value){
        this.options.data = value;
        this._renderBody();
    },
    getValue: function(){
        return this.getRowsData();
    },
    setReadonly: function(readonly){
        this._readonly = readonly;
    },
    getSelectedValue: function(mapper){
        var selectedRows = this.getSelectedRows(), selectedValue = [], rowValue;
        if(selectedRows && selectedRows.length){
            $.each(selectedRows, function(i, row){
                rowValue = row.datarow("getValue");
                selectedValue.push(rowValue);
            });
        }
        if(mapper && selectedValue){
            return $.map(selectedValue, mapper);
        }
        return selectedValue;
    },
    setColumns: function(columns){
        this.options.columns = columns;
        this._renderHeaderCells();
        this.refreshSize();
        this._renderBody();
    },
    setSize: function(size){
        if(size.width){
            this.options.width = size.width;
            this._renderWidth();
        }
        if(size.height){
            this.options.height = size.height;
            this._renderHeight();
        }
    }
});

    $.widget( "webui.datarow",{
        _cells: null,
        _selected: null,
        options: {
            columns: null,
            showNumberCell: null,
            showCheckboxCell: null,
            data: null
        },
        _create: function() {
            var self = this;
            this._value = this.options.data;
            this._cells = [];
            this._selected = false;
            this.element
                .click(function(){
                    if(self._selected){
                        self.unselect();
                    }
                    else{
                        self.select();
                    }
                });
        
            this._render();
        },
        _render: function(){
            this.element.empty();
            this._renderNumberCell();
            this._renderCheckboxCell();
            this._renderDataCells();
        },
        _renderDataCells: function(){
            var self = this, data = this.options.data, cell, td;
            this._cells = [];
            $.each(this.options.columns, function(i, column){
                cell = {};
                cell.column = column;
                td = $("<td class='ui-datagrid-cell'></td>");
                self.element.append(td);
                cell.element = td;
                self._renderCell(cell, data);
                self._cells.push(cell);
            });
        },
        _renderNumberCell: function(){
            if(this.options.showNumberCell){
                var td = $("<td class='ui-datagrid-numbercell'></td>");
                this.element.append(td);
            }
        },
        _renderCheckboxCell: function(){
            var self = this, td;
            if(this.options.showCheckboxCell){
                td = $("<td class='ui-datagrid-checkbox-cell'><input type='checkbox'/></td>");
                td.click(function(ev){
                    if(!$(ev.target).is("input")){
                        if($(this).find("input").attr("checked") === "checked"){
                            $(this).find("input").removeAttr("checked");
                        }
                        else{
                            $(this).find("input").attr("checked", "checked");
                        }
                    }
                    self._onCheckboxCell_click($(this), self.element);
                    ev.stopPropagation();
                });
                self.element.append(td);
            }
        },
        _renderCell: function(td, data){
            var self = this, cell = td.element, column = td.column, fieldValue = null, renderValue;
            cell.empty();
            if(column.field in data){
                fieldValue = data[column.field];
            }
            if (typeof (column.render) === "string") {
                var cellRender;
                if (column.render in dagaridRenders) {
                    cellRender = dagaridRenders[column.render];
                }
                else if (column.render in $.webui.__renders) {
                    cellRender = $.webui.__renders[column.render];
                }
                else {
                    cellRender = window[column.render];
                }
                renderValue = cellRender(fieldValue, this, cell, column);
                if(typeof renderValue === "string"){
                    cell.html(renderValue).attr("title", renderValue);
                }
                else if(typeof renderValue === "object"){
                    cell.append(renderValue);
                }
            }
            else if(column.render){
                renderValue = column.render(self.element, { data: data, value: fieldValue });
                if (typeof renderValue === "string") {
                    cell.html(renderValue).attr("title", renderValue);
                }
                else if (typeof renderValue === "object") {
                    cell.append(renderValue);
                }
            }
            else if(column.field){
                if(fieldValue !== null){
                    if($.isArray(fieldValue)){
                        fieldValue = fieldValue.toString();
                    }
                    cell.html(fieldValue).attr("title", fieldValue);
                }
            }
        },
        _onCheckboxCell_click: function(sender){
            if(sender.find("input").attr("checked") === "checked"){
                this.select();
            }
            else{
                this.unselect();
            }
        },
        select: function(){
            if(this.options.showCheckboxCell){
                this.element.find(".ui-datagrid-checkbox-cell input").prop("checked", true);
            }
            this.element.addClass("active");
            this._selected = true;
            this._trigger("selected", null, this.element);
        },
        unselect: function(){
            this.element.removeClass("active")
                .find(".ui-datagrid-checkbox-cell input")
                .prop("checked", false);
            this._selected = false;
            this._trigger("unselected", null, this.element);
        },
        setValue: function(value){
            var self = this;
            $.each(this._cells, function(i, cell){
                self._renderCell(cell, value);
            });
            this._value = value;
            this._trigger("changed", null, this.element);
        },
        getValue: function(){
            return this._value;
        },
        isSelected: function(){
            return this._selected;
        }
    });
}( jQuery ) );

//兼容保留方法
(function($){
    $.extend($.webui.datagrid.prototype, {
        updateRow: function(index, data){
            if(this._rows[index]){
                this._rows[index].datarow("setValue", data);
                this._trigger("updatedRow", null, {row: this._rows[index], data: data});
            }
        },
        selectRow: function(index){
            if(this._rows[index]){
                this._rows[index].datarow("select");
            }
        },
        unselectRow: function(index){
            if(this._rows[index]){
                this._rows[index].datarow("unselect");
            }
        },
        _setOption: function(key, value){
            var self = this;
            $.Widget.prototype._setOption.apply(self, arguments);
            switch(key){
                case "width": this._renderWidth();break;
                case "height": this._renderHeight();break;
                case "showNumberColumn":
                    this._renderHeaderNumberCell();
                    $.each(this._rows, function(i, row){
                        row.datarow("option", "showNumberCell", value);
                    });
                    break;
                case "singleSelect":
                    this._renderHeaderCheckboxCell();
                    $.each(this._rows, function(i, row){
                        row.datarow("option", "showCheckboxCell", !value);
                    });
                    break;
                case "data": this.setValue(value);break;
                case "columns": this.setColumns(value);break;
            }
        }
    });
    $.extend($.webui.datarow.prototype, {
        _setOption: function(key, value){
            var self = this;
            $.Widget.prototype._setOption.apply(self, arguments);
            switch(key){
                case "data":this.setValue(value);break;
                case "showNumberCell": this._renderNumberCell();break;
                case "showCheckboxCell": this._renderCheckboxCell();break;
            }
        }
    });
}(jQuery));