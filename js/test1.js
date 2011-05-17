+function($) {$(function(){
  //Using TestCase
  var T = new jqUnit.TestCase('TestCase',function(){
      /*setup*/
	  this.json = {'hoge':'1111', 'fuga':'2222', "piyo": [1,2,3], 'moge':{'key1':'value1', 'key2':'value2'}};
	  $('#text').attr('value', JSON.stringify(this.json));
	  //console.log( $('#text').attr('value'));
	  JSONE.Base.read($('#text').attr('value'));

    },function(){
      /*teardown*/

    });

  T.test('init', function(){
	  this.assertEquals('test of test', 1, true);
	  this.assertEquals('test data', 1111, T.json.hoge);
	  this.assertEquals('test data', 3, T.json.piyo.length);
      });

  T.test('publish make AIR crashing', function(){
	  //new
	  $('#text').attr('value', '');
	  JSONE.Control.create();
	  
	  //insert twice
	  JSONE.Control.insertAsChild();
	  $('.current span.key input').attr('value', 'key1');
	  $('.current span.value textarea').attr('value', 'value1');
	  JSONE.Control.edited();

	  JSONE.Control.insert();
	  $('.current span.key input').attr('value', 'key2');
	  $('.current span.value textarea').attr('value', 'value2');
	  JSONE.Control.edited();

	  JSONE.Control.publish();

	  var json = $('#text').attr('value'),
	      expected = '{"key1":"value1", "key2":"value2"}';
	  this.assertEquals('alive?', expected, json);


	      });
	  
//return;
  
  T.test('read', function(){
	  this.assertEquals('can read?', JSON.stringify(JSONE.Base.jsonObj), JSON.stringify(T.json));
	  $('#item_1 span.value').html('1234');
	  var obj = JSONE.Base.parseHtml();
	  this.assertEquals('parse html', '1234', obj.json.hoge);
      });
//return;

  T.test('number, boolean', function(){
	  var data = '{"hoge":1111,"fuga":"2222 person","moge":false,"piyo":[1,"2",{"test":true},null,"5"]}';
		JSONE.Base.read(data);
		JSONE.Control.publish();
		JSONE.Base.read($('#text').attr('value'));

//		console.log(JSONE.Base.jsonObj);
		this.assertEquals('init', 1111, JSONE.Base.jsonObj.hoge);
		this.assertEquals('is num', 'number', typeof JSONE.Base.jsonObj.hoge);
		this.assertEquals('string', '2222 person', JSONE.Base.jsonObj.fuga);
		this.assertFalse('false', JSONE.Base.jsonObj.moge);

		this.assertEquals('array cantaining object', 5, JSONE.Base.jsonObj.piyo.length);
		this.assertEquals('num in array', 1, JSONE.Base.jsonObj.piyo[0]);
		this.assertEquals('is num in array', 'number', typeof JSONE.Base.jsonObj.piyo[0]);
		this.assertTrue('bool in object in array', JSONE.Base.jsonObj.piyo[2].test);
		this.assertEquals('is bool in object in array', 'boolean', typeof JSONE.Base.jsonObj.piyo[2].test);


      });
  
    T.test('hot key', function(){
	    //next
	    JSONE.Control.next();
	    JSONE.Control.next();
	    JSONE.Control.next();
	    this.assertEquals('next action', 'item_2', $('.current').attr('id'));

	    //prev
	    JSONE.Control.prev();
	    JSONE.Control.prev();
	    JSONE.Control.next();
	    this.assertEquals('prev action', 'item_1', $('.current').attr('id'));

	    //del
	    JSONE.Control.del();
	    this.assertEquals('del action', 0, $('#item_1').size());
	    JSONE.Control.next();
	    this.assertEquals('after deleting position', 'item_3', $('.current').attr('id'));
			    
	    //edit
	    JSONE.Control.edit();
	    $('.current span.key input').attr('value', 'edited');

	    JSONE.Control.edited();
	    var obj = JSONE.Base.parseHtml();
	    this.assertEquals('edit action', 'object', typeof obj.json.edited);

	    //copy hide
	    JSONE.Control.hide();
	    JSONE.Control.next();
	    JSONE.Control.next();
	    JSONE.Control.copy();

	    JSONE.Control.edit();
	    $('.current span.key input').attr('value', 'key3');
	    JSONE.Control.edited();

	    var obj = JSONE.Base.parseHtml();
	    this.assertEquals('copy action', 'value1', obj.json.moge.key3);
			    
	    JSONE.Control.edit();

      });

      T.test('read xml', function(){
	      var xml = '<?xml version="1.0" encoding="UTF-8" ?><root><hoge>1111</hoge><fuga>2222</fuga><moge><key1>value1</key1><key2>value2</key2></moge></root>';
	      $('#text').attr('value', xml);
	      JSONE.Base.read($('#text').attr('value'));

	      $('#item_1 span.value').html('1234');
	      var obj = JSONE.Base.parseHtml();
	      this.assertEquals('read XML', '1234', obj.root.hoge);

      });

        T.test('if null data read', function(){
		var data = '{"hoge":"1111","fuga":"2222","moge":null,"piyo":["1","2",{"test":"1"},null,"5"]}';
		JSONE.Base.read(data);
			    
		this.assertEquals('init', '1111', JSONE.Base.jsonObj.hoge);
		this.assertEquals('null', '', JSONE.Base.jsonObj.moge);

		this.assertEquals('array cantaining null object', 5, JSONE.Base.jsonObj.piyo.length);
		this.assertEquals('null in array', '', JSONE.Base.jsonObj.piyo[3]);

		this.assertEquals('diplay nothing', $('#item_3 span.value').html(), ' ');

//		console.log($('#item_3 span.value').html())
		JSONE.Control.publish();
      });


	  T.test('inputing array data', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_1', $('.current').attr('id'));
		    
		  //edit
		  JSONE.Control.edit();
		  $('.current span.value textarea').attr('value', '[1,2,3]');

		  JSONE.Control.edited();
		  JSONE.Control.publish();

		  JSONE.Base.read($('#text').attr('value'));
		  this.assertEquals('edit with array', JSONE.Base.jsonObj.hoge.length, 3);
		  this.assertEquals('edit with array2', JSONE.Base.jsonObj.hoge[1], 2);


		  
      });


	  T.test('inputing object data', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_1', $('.current').attr('id'));
		    
		  //edit
		  JSONE.Control.edit();
		  $('.current span.value textarea').attr('value', '{"key1":1, "key2":2, "2":3}');

		  JSONE.Control.edited();
		  JSONE.Control.publish();

		  JSONE.Base.read($('#text').attr('value'));
		  this.assertEquals('edit with object', JSONE.Base.jsonObj.hoge.key1, 1);
		  this.assertEquals('edit with object2', JSONE.Base.jsonObj.hoge[2], 3);

      });

	  T.test('publish make Safari crashing', function(){
		  var data = {"src":"rtmp:\/\/fms-cache.stream.ne.jp\/shimano\/_definst_\/dvd\/080131_ayu2008.flv","total_time":"00:53:22","size":"640x360","chapter":[{"time":"00:00:00","title":"\u30aa\u30fc\u30d7\u30cb\u30f3\u30b0","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/01.png"},{"time":"00:02:17","title":"\u30ea\u30df\u30c6\u30c3\u30c9\u30d7\u30edMI HK","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/02.png"},{"time":"00:19:35","title":"\u30ea\u30df\u30c6\u30c3\u30c9\u30d7\u30ed\u3000\u30c8\u30e9\u30b9\u30c6\u30a3\u30fcNK","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/03.png"},{"time":"00:28:11","title":"\u30b9\u30da\u30b7\u30e3\u30eb\u7af6\u30dc\u30af\u30b5\u30fc\u3000NK","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/04.png"},{"time":"00:37:55","title":"\u30ca\u30a4\u30a2\u30fc\u30c9\u3000NK","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/05.png"},{"time":"00:42:36","title":"08 \u9b8e\u65b0\u88fd\u54c1","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/06.png"},{"time":"00:48:27","title":"\u30b9\u30da\u30b7\u30e3\u30ebRS typeH","thumbnail":"\/images\/chapters\/dvd\/2008_ayu\/07.png"}]};
		  $('#text').attr('value', JSON.stringify(data));

		  JSONE.Base.read($('#text').attr('value'));

		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_2', $('.current').attr('id'));

		    
		  //edit
		  JSONE.Control.edit();
		  $('.current span.key input').attr('value', 'total_time2');
		  JSONE.Control.edited();
		  
		  JSONE.Control.publish();

		  JSONE.Base.read($('#text').attr('value'));			    
		  this.assertEquals('alive?', JSONE.Base.jsonObj.total_time2, '00:53:22');

	      });
	  

	  T.test('null value inputed for key', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_2', $('.current').attr('id'));

		    
		  //edit
		  JSONE.Control.edit();
		  $('.current span.key input').attr('value', '');
		  JSONE.Control.edited();
		  
		  var obj = JSONE.Base.parseHtml();
	//	  console.log(obj)
		  this.assertEquals('key is null', 2222, obj.json[""]);

	      });

	  T.test('insert test', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_2', $('.current').attr('id'));

		    
		  //edit
		  JSONE.Control.insert();

		  $('.current span.key input').attr('value', 'keyName');
		  $('.current span.value textarea').attr('value', 'Value');

		  JSONE.Control.edited();
		  
		  var obj = JSONE.Base.parseHtml();
		  this.assertEquals('key and value pear are inserted', 'Value', obj.json.keyName);

	      });

	  
	  T.test('insertKey and insertValue', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_2', $('.current').attr('id'));

		    
		  // insert key
		  JSONE.Control.insertKey();
		  $('.current span.key input').attr('value', 'keyOnly');
		  JSONE.Control.edited();
		  
		  var obj = JSONE.Base.parseHtml();
//		  console.log(obj)

		  this.assertEquals('key is inserted', null, obj.json.keyOnly);

		  // insert value
		  JSONE.Control.insertValue();
		  $('.current span.value textarea').attr('value', 'valueOnly');


		  JSONE.Control.edited();
		  
		  var obj = JSONE.Base.parseHtml();
	//	  console.log(obj)
		  this.assertEquals('value is inserted', 'valueOnly', obj.json.keyOnly);
	      });


	  T.test('insert as a child test', function(){
		  //next
		  JSONE.Control.next();
		  JSONE.Control.next();
		  JSONE.Control.next();

		  this.assertEquals('init', 'item_2', $('.current').attr('id'));

		    
		  // insert key
		  JSONE.Control.insertKey();
		  $('.current span.key input').attr('value', 'keyOnly');
		  JSONE.Control.edited();
		  
		  var obj = JSONE.Base.parseHtml();
//		  console.log(obj)
		  this.assertEquals('key is inserted', null, obj.json.keyOnly);

		  // insert child  
		  JSONE.Control.insertAsChild();
		  $('.current span.key input').attr('value', 'key');
		  $('.current span.value textarea').attr('value', 'value');
		  JSONE.Control.edited();
		  
		  var obj2 = JSONE.Base.parseHtml();
//		  console.log(obj2)
		  this.assertEquals('a child pear is inserted', 'value', obj2.json.keyOnly.key);


		  // insert child key
		  JSONE.Control.insertKeyAsChild();
		  $('.current span.key input').attr('value', 'key2');
		  JSONE.Control.edited();
		  
		  var obj3 = JSONE.Base.parseHtml();

		  this.assertEquals('a child key is inserted', null, obj3.json.keyOnly.key.key2);

	      });
	  
	});
}(jQuery);
