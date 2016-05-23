
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).numberInput, 'control method is defined')
  	})

	var input = $("<input name='foo' data-required='true' data-min='0' data-max='100' data-precision='2' data-default-value='1' />")
		.appendTo(document.body)
		.numberInput()
		.data("numberInput");

  	test('number input default value test', function () {
        equal(input.getValue(), 1);
  	})

    test('number input setValue test', function () {
        input.setValue(2);
        equal(input.getValue(), 2);

        input.setValue(null);
        equal(input.getValue(), null);

        input.setValue(0);
        equal(input.getValue(), 0);

        input.setValue(-1);
        equal(input.getValue(), -1);
    })

  	test('number input validate test', function () {
        input.setValue(1);
        equal(input.validate(), true);
        
        input.setValue(-1);
        equal(input.validate(), false);
        
        input.setValue(101);
        equal(input.validate(), false);

        input.setValue(100);
        equal(input.validate(), true);

        input.setValue(null);
        equal(input.validate(), false);
        
        input.setRequired(false);
        equal(input.validate(), true);

        input.element.val(1.223);
        equal(input.validate(), false);

        input.setValue(1.22);
        equal(input.validate(), true);
  	})

  	test('number input setReadonly test', function () {
  		  input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
  	})

    test('number input focus test', function () {
        input.focus();
        ok(true);
    })

  	test('number input reset test', function () {
  		  input.reset();
        equal(input.getValue(), 1);
  	})
});