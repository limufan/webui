
$(function(){
  test('form should be defined on jquery object', function () {
        ok($(document.body).form, 'control method is defined')
    })
  var html = 
    "<div>"+
    "<div name='checkboxList' class='webui-checkboxList'><input type='checkbox' value='1'/></div>" +
    "<input name='dateInput' type='text' class='webui-dateInput'/>" +
    "<div name='dateRangeInput' class='webui-dateRangeInput'><input type='text'/><input type='text'/></div>" +
    "<input name='numberInput' type='text' class='webui-numberInput'/>" +
    "<div name='numberRangeInput' class='webui-numberRangeInput'><input type='text'/><input type='text'/></div>" +
    "<div name='radioList' class='webui-radioList'><input type='radio' name='test-radio' value='1'/></div>" +
    "<select name='select' class='webui-simpleSelect'><option>1</option></select>" +
    "<textarea name='textarea' class='webui-textarea'></textarea>" +
    "<input name='textbox' type='text' class='webui-textbox'/>" +
    "</div>";

    var now = new Date();
    var nowISO = $.toISODate(now);
    var form = $(html)
        .appendTo(document.body)
        .form()
        .data("form");

    test('form setValue test', function () {
        form.setValue({
            checkboxList: ["1"],
            dateInput: now,
            dateRangeInput: {start: "2014-02-08", end: now},
            numberInput: 2,
            numberRangeInput: {min: 1, max: 10},
            radioList: "1",
            select: "1",
            textarea: "foo",
            textbox: "foo",
        });

        var val = form.getValue();
        equal(val.checkboxList[0], "1");
        equal(val.dateInput, nowISO);
        equal(val.dateRangeInput.start, $.toISODate("2014-02-08"));
        equal(val.dateRangeInput.end, nowISO);
        equal(val.numberInput, 2);
        equal(val.numberRangeInput.min, 1);
        equal(val.numberRangeInput.max, 10);
        equal(val.radioList, "1");
        equal(val.select, "1");
        equal(val.textarea, "foo");
        equal(val.textbox, "foo");
    })

    test('form validate test', function () {
        ok(form.validate());

        var dateInput = form.element.find(".webui-dateInput").data("dateInput");
        dateInput.setValue(null);
        dateInput.setRequired(true);
        equal(form.validate(), false);
        dateInput.setValue(null);
        
        dateInput.setRequired(false);
        ok(form.validate());
    })

    test('form reset test', function () {
        form.reset();
        var val = form.getValue();
        equal(val.checkboxList, null);
    })
});