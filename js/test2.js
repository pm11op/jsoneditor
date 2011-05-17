+function($) {$(function(){

  //Using TestCase
  var T = new jqUnit.TestCase('TestCase2',function(){
      /*setup*/

    },function(){
      /*teardown*/

    });

  T.test('language', function(){
	  var lang = JSONE.Base.createLanguage('ja');
	  this.assertEquals('language', 'ja', lang._lang);

	  var lang = JSONE.Base.createLanguage('en');
	  this.assertEquals('eng', 'en', lang._lang);
      });

  setTimeout(function(){
  T.test('save2local', function(){
	  save2local.saveData('test1', 'test1');
 	  this.assertEquals('init', 'test1', save2local.loadData('test1'));
	  
	  var data = 'if data contain escaped double quortation "\\"", loadData crush... ';
	  save2local.saveData('test', data);

	  var savedData = save2local.loadData('test');
	  this.assertEquals('data contained escaped "', data, savedData);
      });
      },500);

	});
//return;
}(jQuery);
