(function ($) {
    $.widget("webui.simpleSelect", $.webui.selectInput, {
        _onCreated: function () {
            var thiz = this;
            this._hasEmptyOption = true;
            if (this.element.data("hasEmptyOption") !== undefined) {
                this._hasEmptyOption = this.element.data("hasEmptyOption");
            }
            else if ("hasEmptyOption" in this.options) {
                this._hasEmptyOption = this.options.hasEmptyOption;
            }
            this._emptyMessage = this.options.emptyMessage || this.element.data("emptyMessage") || "";
            this._isObjectSelect = this.options.isObjectSelect || this.element.data("isObjectSelect") || false;
            thiz._refreshValue();
            this.element.change(function () {
                thiz._refreshValue();
            });
            this._load();
        },
        _refreshValue: function () {
            var value = this.element.val();
            this._value = this._getValue(value);
        },
        _setValue: function (value) {
            if (this._isObjectSelect) {
                value = this._getItemValue(value);
                this._setElementValue(value);
            }
            else {
                this._setElementValue(value);
            }
        },
        _setElementValue: function (value) {
            var text = this._getText(value);
            this.element.val(value);
            this._refreshValue();
            this._textElement.html(text);
        },
        getValue: function () {
            if (this._value) {
                return this._value;
            }
            return null;
        },
        _getValue: function (value) {
            if (this._isObjectSelect) {
                return this._findItemByValue(value);
            }
            else {
                value = jQuery.trim(value);
                if (value) {
                    return value;
                }
                return null;
            }
        },
        _getGroupElement: function (text) {
            return $.format("<optgroup label='{0}'></optgroup>", text);
        },
        _getSelectElement: function (value, text) {
            return $.format("<option value='{0}'>{1}</option>", value, text);
        },
        _sourceChanged: function () {
            //add empty option
            if (this._hasEmptyOption) {
                var element = this._getSelectElement("", this._emptyMessage);
                this.element.prepend(element);
            }
        }
    }
    );
})(jQuery);