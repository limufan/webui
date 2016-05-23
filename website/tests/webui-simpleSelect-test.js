
$(function(){
  test('should be defined on jquery object', function () {
        ok($(document.body).simpleSelect, 'control method is defined')
    })

  var input = $("<select data-required='true' data-default-value='1' ><option></option><option>1</option><option>2</option></select>")
    .appendTo(document.body)
    .simpleSelect()
    .data("simpleSelect");

    test('simpleSelect default value test', function () {
        equal(input.getValue(), "1");
    })

    test('simpleSelect setValue test', function () {
        input.setValue("2");
        equal(input.getValue(), "2");
    })

    test('simpleSelect validate test', function () {
        ok(input.validate());

        input.setValue("");
        equal(input.validate(), false);
        
        input.setRequired(false);
        ok(input.validate());
    })

    test('simpleSelect setValue test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
    })
    
    test('simpleSelect focus test', function () {
        input.focus();
        ok(true);
    })

    test('simpleSelect reset test', function () {
        input.reset();
        equal(input.getValue(), "1");
    })
});