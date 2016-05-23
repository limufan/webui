
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).numberInput, 'control method is defined')
  	})

	var input = $("<input name='foo' data-required='true' data-default-value='2012-01-02' />")
		.appendTo(document.body)
		.dateInput()
		.data("dateInput");

  	test('date input default value test', function () {
        equal(input.getValue(), $.toISODate("2012-01-02"));
  	})

    test('date input setValue test', function () {
        var today = $.toISODate(new Date());
        input.setValue(new Date());
        equal(input.getValue(), today);

        input.setValue(today);
        equal(input.getValue(), today);
    })

  	test('date input validate test', function () {
        ok(input.validate());
        
        input.setValue(null);
        equal(input.validate(), false);
        
        input.setRequired(false);
        ok(input.validate());
  	})

  	test('date input setReadonly test', function () {
  		  input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
  	})

    test('date input focus test', function () {
        input.focus();
        ok(true);
    })

  	test('date input reset test', function () {
  		  input.reset();
        equal(input.getValue(), $.toISODate("2012-01-02"));
  	})
});