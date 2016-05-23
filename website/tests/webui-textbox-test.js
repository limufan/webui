
$(function(){
  test('should be defined on jquery object', function () {
        ok($(document.body).textbox, 'control method is defined')
    })

  var input = $("<input name='foo' data-required='true' data-default-value='foo' />")
    .appendTo(document.body)
    .textbox()
    .data("textbox");

    test('textbox default value test', function () {
        equal(input.getValue(), "foo");
    })

    test('textbox setValue test', function () {
        input.setValue("foo1");
        equal(input.getValue(), "foo1");
    })

    test('textbox validate test', function () {
        ok(input.validate());

        input.setValue("");
        equal(input.validate(), false);
        
        input.setRequired(false);
        ok(input.validate());
    })

    test('textbox setValue test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
    })
    
    test('textbox focus test', function () {
        input.focus();
        ok(true);
    })

    test('textbox reset test', function () {
        input.reset();
        equal(input.getValue(), "foo");
    })
});