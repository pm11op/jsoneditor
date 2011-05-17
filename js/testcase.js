+function($) {

    $(function(){
	    // new Test.Unit.Runner instance
	    new Test.Unit.Runner({
		    // optional setup function, run before each individual test case
		    setup: function() { with(this) {
			    this.json = {'hoge':'1111', 'fuga':'2222', "piyo": [1,2,3], 'moge':{'key1':'value1', 'key2':'value2'}};
			    $('#text').attr('value', JSON.stringify(this.json));
			    $.Jsone.read($('#text').attr('value'));
			}},
			// optional teardown function, run after each individual test case
			teardown: function() { with(this) {
			    // code
			}},

			// test read and write
			testRead: function() { with(this) {
			    assertEqual(JSON.stringify($.Jsone.jsonObj), JSON.stringify(this.json));

			    $('#item_1 span.value').html('1234');
			    var obj = $.Jsone.parseHtml();
			    assertEqual('1234', obj.json.hoge);

			}},


		        // test hotkey 
			testHotKey: function() { with(this) {
			    //next
			    $.Control.next();
			    $.Control.next();
			    $.Control.next();
			    assertEqual('item_2', $('.current').attr('id'));

			    //prev
			    $.Control.prev();
			    $.Control.prev();
			    $.Control.next();
			    assertEqual('item_1', $('.current').attr('id'));

			    //del
			    $.Control.del();
			    assertEqual(0, $('#item_1').size());
			    $.Control.next();
			    assertEqual('item_3', $('.current').attr('id'));
			    
			    //edit
			    $.Control.edit();
			    $('.current span.key input').attr('value', 'edited');


			    $.Control.edited();
			    var obj = $.Jsone.parseHtml();
			    assertEqual('object', typeof obj.json.edited);

			    //copy hide
			    $.Control.hide();
			    $.Control.next();
			    $.Control.next();
			    $.Control.copy();


			    $.Control.edit();
			    $('.current span.key input').attr('value', 'key3');
			    $.Control.edited();


			    var obj = $.Jsone.parseHtml();
			    assertEqual('value1', obj.json.moge.key3);
			    
			    $.Control.edit();
			}},

		        // test read and write xml  
			testReadXML: function() { with(this) {
			    var xml = '<?xml version="1.0" encoding="UTF-8" ?><root><hoge>1111</hoge><fuga>2222</fuga><moge><key1>value1</key1><key2>value2</key2></moge></root>';
			    $('#text').attr('value', xml);
			    $.Jsone.read($('#text').attr('value'));

			    $('#item_1 span.value').html('1234');
			    var obj = $.Jsone.parseHtml();
			    assertEqual('1234', obj.root.hoge);
			    
			}},

		      // test null object
			testNega: function() { with(this) {
			    var data = '{"hoge":"1111","fuga":"2222","moge":null,"piyo":["1","2",{"test":"1"},null,"5"]}';
			    $.Jsone.read(data);

			    
			    assertEqual('1111', $.Jsone.jsonObj.hoge);
			    assertEqual('', $.Jsone.jsonObj.moge);

			    assertEqual(5, $.Jsone.jsonObj.piyo.length);
			    assertEqual('', $.Jsone.jsonObj.piyo[3]);

			    assertEqual($('#item_3 span.value').html(), '');
			    $.Control.publish();


			}},
			
			// publish cause crashing safari
			testPublishBreakDown: function(){ with(this) {
			    //next
			    $.Control.next();
			    $.Control.next();

			    assertEqual('item_1', $('.current').attr('id'));

		    
			    //edit
			    $.Control.edit();
			    $('.current span.key input').attr('value', 'hoge_edited');
			    $.Control.edited();

			    $.Control.publish();

			    $.Jsone.read($('#text').attr('value'));			    
			    assertEqual($.Jsone.jsonObj.hoge_edited, '1111');
		    }},

						// 
			testMakeObject: function(){ with(this) {
			    //next
			    $.Control.next();
			    $.Control.next();

			    assertEqual('item_1', $('.current').attr('id'));

		    
			    //edit
			    $.Control.edit();
			    $('.current span.value textarea').attr('value', '[1,2,3]');

			    $.Control.edited();

			    $.Control.publish();

			    $.Jsone.read($('#text').attr('value'));			    
			    assertEqual($.Jsone.jsonObj.hoge.length, 3);
			    assertEqual($.Jsone.jsonObj.hoge[1], 2);
		    }}		  
		    
	    });
	});
}(jQuery);