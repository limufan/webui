
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).radioList, 'control method is defined')
  	})
  var html = 
    "<div data-required='true'>" +
    "<input type='radio' name='test-radio' value='1'/><input name='test-radio' type='radio' value='2'/>"+
    "</div>";

  var input = $(html)
      .data("defaultValue", "2")
		  .appendTo(document.body)
		  .radioList()
		  .data("radioList"),
    element = input.element;

  	test('radioList default value test', function () {
        equal(input.getValue(), "2");
        ok(element.find("input").eq(1).prop("checked"));
  	})

    test('radioList setValue test', function () {
        input.setValue("1");
        equal(input.getValue(), "1");
        ok(element.find("input").eq(0).prop("checked"));
    })

  	test('radioList validate test', function () {
        ok(input.validate());
        
        input.setValue(null);
        equal(input.validate(), false);

        input.setRequired(false);
        ok(input.validate());
  	})

  	test('radioList setReadonly test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        input.setReadonly(false);
  	})
    
    test('radioList focus test', function () {
        input.focus();
        ok(true);
    })

  	test('radioList reset test', function () {
  		  input.reset();
        equal(input.getValue(), "2");
        ok(element.find("input").eq(1).prop("checked"));
  	})
});