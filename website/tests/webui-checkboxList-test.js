
$(function(){
	test('should be defined on jquery object', function () {
        ok($(document.body).checkboxList, 'control method is defined')
  	})
  var html = 
    "<div name='foo' data-required='true' data-default-value='[\"2\"]'>" +
    "<input type='checkbox' value='1'/><input type='checkbox' value='2'/>"+
    "</div>";

  var input = $(html)
		  .appendTo(document.body)
		  .checkboxList()
		  .data("checkboxList"),
    element = input.element;

  	test('checkboxList default value test', function () {
        equal(input.getValue()[0], "2");
        ok(element.find("input").eq(1).prop("checked"));
  	})

    test('checkboxList setValue test', function () {
        input.setValue(["1"]);
        equal(input.getValue()[0], "1");
        ok(element.find("input").eq(0).prop("checked"));
    })

  	test('checkboxList validate test', function () {
        ok(input.validate());
        
        input.setValue(null);
        equal(input.validate(), false);

        input.setRequired(false);
        ok(input.validate());
  	})

  	test('checkboxList setReadonly test', function () {
        input.setReadonly(true);
        equal(input.getReadonly(), true);
        input.setReadonly(false);
  	})
    
    test('checkboxList focus test', function () {
        input.focus();
        ok(true);
    })

  	test('checkboxList reset test', function () {
  		  input.reset();
        equal(input.getValue()[0], "2");
        ok(element.find("input").eq(1).prop("checked"));
  	})
});