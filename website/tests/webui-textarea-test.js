
$(function(){
  test('should be defined on jquery object', function () {
        ok($(document.body).textarea, 'control method is defined')
    })

  var input = $("<textarea data-required='true' data-default-value='foo' ></textarea>")
    .appendTo(document.body)
    .textarea()
    .data("textarea");

    test('textarea default value test', function () {
        equal(input.getValue(), "foo");
    })

    test('textarea setValue test', function () {
        input.setValue("foo1");
        equal(input.getValue(), "foo1");
    })

    test('textarea validate test', function () {
        ok(input.validate());

        input.setValue("");
        equal(input.validate(), false);
        
        input.setRequired(false);
        ok(input.validate());
    })

    test('textarea setValue test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
    })
    
    test('textarea focus test', function () {
        input.focus();
        ok(true);
    })

    test('textarea reset test', function () {
        input.reset();
        equal(input.getValue(), "foo");
    })
});