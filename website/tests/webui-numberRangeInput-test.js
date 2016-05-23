
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).numberRangeInput, 'control method is defined')
  	})
  var html = 
      "<div data-required='true'>" +
      "<input type='text'/><input type='text'/>"+
      "</div>";
	var input = $(html)
    .data("defaultValue", {min: 1, max: 10})
		.appendTo(document.body)
		.numberRangeInput()
		.data("numberRangeInput");

  	test('number range input default value test', function () {
        var value = input.getValue();
        equal(value.min, 1);
        equal(value.max, 10);
  	})

    test('number range input setValue test', function () {
        input.setValue({min: 0, max: 30});
        var value = input.getValue();
        equal(value.min, 0);
        equal(value.max, 30);

        input.setValue(null);
        value = input.getValue();
        equal(value, null);

        input.setValue({min: -10, max: null});
        value = input.getValue();
        equal(value.min, -10);
        equal(value.max, null);
    })

  	test('number range input validate test', function () {
        input.setValue({min: 0, max: 30});
        equal(input.validate(), true);
        
        input.setValue({min: 0, max: null});
        equal(input.validate(), true);

        input.setValue(null);
        equal(input.validate(), false);
        
        input.setRequired(false);
        equal(input.validate(), true);

        input.setValue({min: 30, max: 0});
        equal(input.validate(), false);
  	})

  	test('number range input setReadonly test', function () {
  		  input.setReadonly(true);
        equal(input.getReadonly(), true);
        equal(input.element.css("display"), "none");
        input.setReadonly(false);
  	})

    test('number range input focus test', function () {
        input.focus();
        ok(true);
    })

  	test('number range input reset test', function () {
        input.reset();
        var value = input.getValue();
        equal(value.min, 1);
        equal(value.max, 10);
  	})
});
