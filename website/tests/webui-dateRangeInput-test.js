
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).dateRangeInput, 'control method is defined')
  	})
  var html = 
    "<div data-required='true' data-default-value='{\"start\": \"2014-01-22\", \"end\": \"2014-01-23\"}'>" +
    "<input type='text'/><input type='text'/>"+
    "</div>";
  var input = $(html)
		  .appendTo(document.body)
		  .dateRangeInput()
		  .data("dateRangeInput"),
    element = input.element;

  	test('dateRangeInput default value test', function () {
        var value = input.getValue();
        equal(value.start, $.toISODate('2014-01-22'));
        equal(value.end, $.toISODate('2014-01-23'));
  	})

    test('dateRangeInput setValue test', function () {
        input.setValue({start: '2014-01-21', end: '2014-01-22'});
        var value = input.getValue();
        equal(value.start, $.toISODate('2014-01-21'));
        equal(value.end, $.toISODate('2014-01-22'));
    })

  	test('dateRangeInput validate test', function () {
        ok(input.validate());
        
        input.setValue(null);
        equal(input.validate(), false);

        input.setRequired(false);
        ok(input.validate());
  	})

  	test('dateRangeInput setReadonly test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        input.setReadonly(false);
  	})
    
    test('dateRangeInput focus test', function () {
        input.focus();
        ok(true);
    })

  	test('dateRangeInput reset test', function () {
  		  input.reset();
        var value = input.getValue();
        equal(value.start, $.toISODate('2014-01-22'));
        equal(value.end, $.toISODate('2014-01-23'));
  	})
});