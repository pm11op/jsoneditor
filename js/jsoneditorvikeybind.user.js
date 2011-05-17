// ==UserScript==
// @name           JSON Editor vi keybind
// @namespace      http://jsoneditor.net/
// @description    replace keybind with one like vi
// @include        http://jsoneditor.net/*
// ==/UserScript==

+function(){
    var $ = unsafeWindow.jQuery; JSONE = unsafeWindow.JSONE;
    if (!JSONE) return 

    if (JSONE.nonVimode) return;

    JSONE.KeyBind.kb.clear();


    JSONE.KeyBind.keys = {
	':+e': 'create',
	j: 'next',
	k: 'prev',
	down: 'next',
	up: 'prev',
	'd+d': 'del', // cut
	h: 'toggle',
	l: 'toggle',
	'c+c': 'edit',
	'i+i': 'insert',
	'i+k': 'insertKey',
	'a+a': 'insertAsChild',
	'a+k': 'insertKeyAsChild',
	'i+v': 'insertValue',
	'y+y+p': 'copy', // duplicate
	':+r': 'read',
	':+w+w': 'publish',
	'p': 'paste',
	':+w+x': 'publishXML',
	'u': 'undo',
	'U': 'redo',
	'1': function(){$('#text').removeClass('close').addClass('open');},
	'2': function(){$('#text').removeClass('open').addClass('close');},
	'o+h': function(){JSONE.Control.popup('', './help/index.html', 'help')},
	'o+a': function(){JSONE.Control.popup('', './about/index.html', 'about')},
	'esc': 'cancel',
	'?': 'help'
    };
    var keyinfo = JSONE.Language.keyInfo;
    JSONE.Language.keyInfo = {
	'?': keyinfo['?'],
	':e': keyinfo.a,
	j: keyinfo.j,
	k: keyinfo.k,
//	down: keyinfo.j,
//	up: keyinfo.k,
	'dd': keyinfo.c,
	'p': keyinfo.v,
	'h/l': keyinfo.s,
	'cc': keyinfo.e,
	'ii': keyinfo.i,
	'ik': keyinfo.n,
	'iv': keyinfo.m,
	'aa': keyinfo.I.replace(/\([^\)]+\)/, ''),
	'ak': keyinfo.N.replace(/\([^\)]+\)/, ''),
	'yyp': keyinfo.d,
	':r': keyinfo.r,
	':ww': keyinfo.p,
	':wx': keyinfo.x,
	'u': keyinfo.z,
	'U': keyinfo.y,
	'1': keyinfo[1],
	'2': keyinfo[2],
	'oh': 'open help page',
	'oa': 'open about page'
    };

    if (!JSONE.Control.helpVisivility) $('#help').width('25px');
    JSONE.Control.helpWidthClose = 225;
    JSONE.KeyBind.init();
    $().xfind('id("help")//dt[text()!="?"]').attr('style', 'none').css('text-indent', '0px')
	.css('color', '#fff').css('font-weight', 'normal');
    $().xfind('id("help")//dt').css('padding-right', '15px').css('text-align', 'center');

    
    if (!$('#command').size()) {
	$('#infoarea').prepend('<div id="command"></div>');
    }
    $('#command').css({
	    position:'fixed',
		bottom: '3px',
		left: '10px',
		overflow: 'hidden',
		color: '#fff',
		width: '30px'});
    $('#message').css('padding-left', '50px');

    var logKeys = function(){
	if (!JSONE.KeyBind.kb._keylog.length) return;
	$('#command').html(JSONE.KeyBind.kb._keylog.join(''));
    };

    $(document).keypress(function(e){
	    if (JSONE.KeyBind.kb.ignore.test( (e.target || e.srcElement).tagName)) return; 
	    logKeys();
	}).keydown(function(e){
	    if (JSONE.KeyBind.kb.ignore.test( (e.target || e.srcElement).tagName)) return; 
	    logKeys();
	    });

    unsafeWindow.HotKey.prototype.callFunc = function(e, keys){
	logKeys();
	this._keyfunc[keys].call(this,e);
    }
    unsafeWindow.HotKey.prototype.timer = function(e, keys){
	$('#command').html('');
	this._keylog = [];
    }
    unsafeWindow.HotKey.prototype._interval = 1000;
}();