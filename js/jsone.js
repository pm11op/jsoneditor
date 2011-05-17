 /**
 * todo
 * keybinding cause crashing, i think...
 */
var JSONE = JSONE || {};
JSONE.classes = {};

(function($){
    var d = document;

    $(function(){

	    JSONE.KeyBind = new JSONE.classes.KeyBind;
	    JSONE.KeyBind.init();

	    JSONE.Control = new JSONE.classes.Control;


	    /**
	     * for fixed fx2.0 bug
	     * http://blog.livedoor.jp/tzifa/archives/50799216.html
	     */
	    if ($.browser.mozilla && parseFloat($.browser.version) < 1.9) {
		$('#text').focus(function(){
			JSONE.Event.onFocusTextarea();

		    }).blur(function(){
			    JSONE.Event.onBlurTextarea();
			});
		$(d).scroll(function(e){
			if (!JSONE.Base.textareaFocused) return;
			$('#text').blur();
			JSONE.Event.onBlurTextarea();
		    });
	    } else if ($.browser.msie && parseFloat($.browser.version) < 7) {
		$('#help').css('position', 'absolute');
	    }




	    $('#read').mouseup(JSONE.Event.onRead);
	    $('#btnNew').click(JSONE.Control.create);

	    $('#text').click(function(){
		    $('#text').removeClass('close').addClass('open');
		});

	    // draw actionList
	    var html='', format = "<ul class='actionMenu'>%s</ul><div class='footer'></div>",
		formatLine = "<li class='%s actionMenu'>%s</li>";
	    $.each(JSONE.KeyBind.actionListKeys, function(key){
		    html += sprintf(formatLine, this, JSONE.Language.keyInfo[key]);
		});
	    $('#actionList').html(sprintf(format, html));


	    // 4 mouse
	    $("#display").click(function(e){
		    var target = $(e.target);


		    // Safari -> div,  Firefox -> li
		    if (target.attr('tagName') == 'LI') {
			var currentId =  Math.max(0, $().xfind("//li[contains(@class, 'open')]").index(target[0]));
			JSONE.Control._setCurrent(currentId, target);
			//console.log(JSONE.Control, target);
			JSONE.Control.toggle();

		    } else if (target.attr('tagName') == 'DIV' && target.hasClass('line')) {
			var currentId =  Math.max(0, $().xfind("//li[contains(@class, 'open')]").index(target.parent()[0]));
//			console.log([currentId, target.parent().attr('className'), target[0], target.parent()[0]]);

			JSONE.Control._setCurrent(currentId, target.parent());
			//console.log(JSONE.Control, target);
			JSONE.Control.toggle();

		    } else if (target.attr('tagName') == 'SPAN') {
			JSONE.Control.edit(target);
		    }
		});

	    // actionList, current line focus
	    $('#display').mouseover(function(e){
		    var target = $(e.target);
		    if (!target.hasClass('actionList') && target.attr('id') != 'actionList') {
			$('#actionList').hide();
		    }
		});


	    $('#actionList').mouseover(function(e){
		    var target = $(e.target);
		    if (target.attr('tagName') == 'LI') {
			target.addClass('focusedAction');
			target.one('mouseout', function(){target.removeClass('focusedAction')});
		    }
		});


	    /**
	     * onsubmit
	     */
	    $('#form').submit(function(){
		    JSONE.Control.edited.call(JSONE.Control);
		    return false;
		});



	    /**
	     *
	    $('#helpClose').click(function(){
		    JSONE.Control.help();
		});
	    */
	    $('#help').click(function(){
		    JSONE.Control.help();
		});
//	    console.log($().height());
//	    setTimeout(function(){$('#help').css('height', $().height() + 200 +'px')}, 100);


	    /**
	     * for slider
	     */
	    JSONE.Event.slideMaxValue = parseInt($().width(), 10);
	    $('div#navi').each(function () {
		    var obj = {
			handle: '#handle1',
			minValue: 0,
			maxValue: JSONE.Event.slideMaxValue,
			slide: JSONE.Event.onSlide,
			stop: JSONE.Event.onSlideStop

		    };
		    JSONE.Event.slider = $('#slider', this).slider(obj);
	    });
	    $(window).resize(function(){
		    JSONE.Event.actionMargin = 16;
		    JSONE.Event.slideMaxValue = parseInt($().width(), 10);
//		    JSONE.Event.slideMaxValue = $().width();

		    JSONE.Event.onSlideStop();
		});

	    // read config
	    JSONE.Control.readConfig();

	    // read contents or json
	    var href = window.location.hash;
	    href = href.replace(/^#/, '');

	    switch (href) {
	    case 'air':
		var url = './air/index.html';
		JSONE.Control.popup.call(JSONE.Control, href, url);
		break;

	    case 'help':
	    case 'about':
		var url = './' + href + '/index.html';
		JSONE.Control.popup.call(JSONE.Control, href, url);
		break;

	    case 'demo':
		$('#text').attr('value', JSON.stringify(demo_data)); //in js/demodata.js
		JSONE.Control.read();
		break;



	    case '':
//		window.location.hash = 'editor';

		// save2local
		setTimeout(function(){

			var prev_data = save2local.loadData('json_data');
//			console.log(JSON.parse(prev_data));

			if (prev_data) {
                prev_data = prev_data.replace(/\n/g, "\\n");
			    $('#text').attr('value', JSON.stringify(JSON.parse(prev_data)));
			} else {
			    $('#text').attr('value', JSON.stringify(demo_data)); //in js/demodata.js
			}

			JSONE.Control.read();
		    }
		, 1000);
		break;

	    default:
		if (window.location.hash.match(/^#*uri/)) {
		    JSONE.Msg.load();
		    JSONE.Control.readUri.call(JSONE.Control);
		} else {
		    JSONE.Control.read.call(JSONE.Control);
		}
		break;
	    }

	    // menu
	    $('#menu').click(JSONE.Event.onMenuClick);


	    // submit textarea
//	    $().keyup(function(e){

//	    /*
	    $().keydown(function(e){
		    if (e.keyCode != 10 && e.keyCode != 13 && e.keyCode != 77) return;
		    if (e.ctrlKey) {
			JSONE.Control.edited.call(JSONE.Control);
			return false;
		    }

		});


	    //esc
	    $().keypress(function(e){
		    if (e.keyCode == 27) JSONE.Control.cancel.call(JSONE.Control);
		});
//	    */

	    // you save?
	    window.onbeforeunload  = function(e){
		e = e || window.event;

		if (JSONE.Base._saved) {

		} else {
		    var msg = JSONE.Msg._message('MSG_NOTSAVED');
		    e.returnValue = msg;
		}
	    };

//	    $('#helpDummy').height(300);

	    // auto saving
	    setInterval(function(){
		    JSONE.Control.save();
		}, 60000);

	}); // end of onload


	JSONE.classes.JSONE  = function() {
	    this.nullValue = jQuery.browser.msie ? "" : ' ';
	    this._saved;
	    this._vimode;
	    this.textareaFocused = false;

	    this.delBtn = "<div class='btnDel'> delete </div>";
	    this.editBtn = "<div class='btnEditable' alt='edit'>edit</div>";

	    this.insertBtn = "<img src='./images/insert.gif' class='btnInsert' alt='insert' />";
	    this.copyBtn = "<img src='./images/insert.gif' class='btnCopy' alt='copy' />";


	    this.actionList = "<div class='actionList'> &nbsp; </div>";

	    this.actionDiv = "<div class='action'>" + this.editBtn + this.delBtn + this.actionList + "</div>";
	    this.actionDivKey = "<div class='action'>" + this.actionList + "</div>";

	    this.childKeyFormat = "<li id='item_%s' class='open'><div class='line'><span class='key'>%s</span><span class='value'>" + this.nullValue + "</span>" + this.actionDiv +
	    "</div></li>\n";

	    this.childFormat = "<li id='item_%s' class='open child'><div class='line'><span class='key'>%s</span><span class='value'>%s</span>" +
	    this.actionDiv + "</div></li>\n";
	};

		JSONE.classes.JSONE.prototype.read = function(text) {
          JSONE.Msg.load();
//          text = ereg_replace("\n", '', text);

		  if (this.isXML(text)) {
//            console.log(text);
            var obj = this.parseXML(text), len=0;
		    for (var key in obj) {
		      len++;
			}

			if (len == 1) {
			    this.rootNode = key;
			    this.jsonObj = obj[key];
			} else {
			    this.rootNode = 'xml';
			    this.jsonObj = obj;
			}

		    } else {
			this.rootNode = 'json';
			this.jsonObj = JSON.parse(text, function(key, value){
				if (value == null) value = '';
				return value;
			    });
		    }
		    this.id = 0;
		    this.display.call(this);
		    JSONE.Control.init();

		    JSONE.Msg.show('MSG_READ');

		};

		JSONE.classes.JSONE.prototype.isXML = function(text){
		    return text.indexOf('<?xml') > -1;
		};

		JSONE.classes.JSONE.prototype.parseXML = function(text) {
		    return new XML.ObjTree().parseXML(text);
		};

		JSONE.classes.JSONE.prototype.count = function () {
		    return this.id;
		};






		JSONE.classes.JSONE.prototype.buildHtml = function() {
		    this._html = '';
		    var self = this;
		    $.each(this.jsonObj, function(key){
			    self.id++;
			    id = self.id;
			    switch(self.findType(this)){
			    default:
				self._html += sprintf(self.childFormat, id, key, $.trim($().escape(this)) || ' ');
				//JSONE.Base._html += String(key) + ' : ' + this;
				break;
			    case Object:
			    case Array:
				self._html += "<li id='item_" + id + "' class='open'><div class='line'><span class='key'>" + String(key) + '</span>' +
//				    "<span class='value'>" + self.nullValue + "</span><div class='action'>" + self.editBtn + self.delBtn + self.insertBtn + self.copyBtn + "</div>" +
                    "<span class='value'>" + self.nullValue + "</span><div class='action'>" + self.editBtn + self.delBtn + self.actionList + "&nbsp;</div>" +
				    "</div><ul> ";
				$.each(this, arguments.callee);
				self._html += ' </ul></li>';
				break;
			    }
			});
		    return this._html;
		};

		JSONE.classes.JSONE.prototype.display = function() {
		    var parentFormat = '<div id="dummy"><span class="key">&nbsp;</span><span class="value">&nbsp;</span><div class="action">&nbsp;</div></div>'
		    parentFormat += "<ul><li id='root' class='open'><div class='line'><span class='key'>" + this.rootNode + "</span>" +
		    "<span class='value'>" + this.nullValue + "</span>" + this.actionDivKey + "</div><ul>%s</ul></li></ul>\n";

		    $('#display').html(sprintf(parentFormat, this.buildHtml()));
		    this.setBtn();

		    // slide
		    JSONE.Event.slideMaxValue = $().width();
		    JSONE.Event.onSlideStop();
		};

		JSONE.classes.JSONE.prototype.setBtn = function(){
		    // delete
		    this._makeAction('click', $('.btnDel'), function(item, e){
			    JSONE.Control.del($(e.target).parent().parent().parent());
			});

		    // edit
		    this._makeAction('click', $('.btnEditable'), function(item, e){
			    var target = $(e.target).parent().parent().parent();
			    var currentId = Math.max(0, $().xfind("//li[contains(@class, 'open')]").index(target[0]));
			    JSONE.Control._setCurrent(currentId, target);
			    JSONE.Control.edited();
			    JSONE.Control.edit();
			});

		    /**
		     * action list
		     */
		    var my = this;
		    $('.actionList').unbind('mouseover');
		    $('.actionList').mouseover(function(e){
//			    console.log(e)
			    my.makeActionList(e);
			    return;
			});

		    var actions = {
			'.actionEditable': 'edit',
			'.actionDel': 'del',
			'.actionCopy': 'copy',
			'.actionPaste': 'paste',
			'.actionInsert': 'insert',
			'.actionInsertKey': 'insertKey',
			'.actionInsertChild': 'insertAsChild',
			'.actionInsertChildKey': 'insertKeyAsChild',
			'.actionInsertValue': 'insertValue'

		    };
		    $.each(actions, function(key){
			    var self = this;
			    my._makeAction('click', $(key), function(item){
				    JSONE.Control[self].call(JSONE.Control);
				});
			});


		    /**
		     * mouse over
		     */
		    $('div.line').mouseover(JSONE.Event.onFocusLine);

		};

		JSONE.classes.JSONE.prototype._makeAction = function(event, target, action, obj){
		    var self = this;
		    target.unbind(event);
		    target[event](function(e){
   			    var item =  self._actionTarget;
                if (!item) item = $(e.target).parent().parent().parent();

			    var currentId = Math.max(0, $().xfind("//li[contains(@class, 'open')]").index(item[0]));
			    JSONE.Control._setCurrent(currentId, item);
			    JSONE.Event.hideActionList();
			    action.call(this, item, e);
			});
		};

		JSONE.classes.JSONE.prototype.alMargin = 47;
		JSONE.classes.JSONE.prototype.alMarginTop = 3;
		JSONE.classes.JSONE.prototype.alMarginBottom = 35;
		JSONE.classes.JSONE.prototype.makeActionList = function(e){
		    var target = e.target, h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight,
		    pos, self = this;

//		    console.log(e.clientX, e.clientY, h)

		    if ($(target).attr('tagName') == 'P') target = $(target).parent();
		    this._actionTarget = $(target).parent().parent().parent(),
		    pos = $(target).offset();
//		    console.log($(target), $(target).attr('tagName'))

		    var style = {position: 'absolute', left: parseInt(pos.left, 10) + this.alMargin, top: parseInt(pos.top, 10) - this.alMarginTop};
		    var actions = $('#actionList').css(style).show().children('ul').children();

		    var item = $(target).parent().parent();
		    actions.show();
		    if (JSONE.Control.isRoot(item)) {
			$('.actionDel').add('.actionInsertKey').add('.actionInsert').add('.actionInsertValue').hide();
		    } else if (this._actionTarget.children().size() != 2 && !$.trim($(item.children()[1]).text())) {
//			actions.show();
		    } else if (this._actionTarget.children().size() != 2) {
			$('.actionInsertChildKey').add('.actionInsertChild').add('.actionInsertValue').hide();
		    } else {
			$('.actionInsertValue').hide();
		    }

		    //
//		    var d = document;
		    var y = d.body.scrollTop  || d.documentElement.scrollTop;
		    var h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;

		    var alHeight = $('#actionList').height();
		    if (pos.top - y  > h - alHeight - this.alMarginBottom) {
//			console.log(pos.top, y, h, alHeight, y - h - alHeight);
			$('#actionList').css('top', y + h - alHeight - this.alMarginBottom);
		    }

		};

		JSONE.classes.JSONE.prototype.findType = function(val){
		    //console.log([typeof val, val.length, val.prototype, val.constructor]);
		    return val.constructor;
		};
		var _key = '';

		JSONE.classes.JSONE.prototype.parseHtml = function(root) {
		    var self = this;
		    root = root || $('#root')

		    // cause null publish
		    $('.focusedLine').removeClass('focusedLine');
		    $('.curLine').removeClass('curLine');

		    var _parse = function(items, obj){
			if (!obj) {
			    obj={};
			    obj.__thisObjectIsArray = 1;
			}

			var elm = $(items[0]), key;

			if (elm.attr('className') == 'line') {
			    // has children?
			    var tmp = [];
			    if (items.length > 1) {
				tmp = items[1];
			    }

			    items = $.makeArray(elm.children()).concat(tmp);

			    tmp = '';
			    elm = $(items[0]);
			}

			if (items.length > 1 && elm.attr('className') == 'key'){
			    key = $.trim(elm.text()) || '';

			    var val = $(items[1]);

			    if (items.length > 3) {
				obj[key] = arguments.callee.call(self, $(items[3]).children(), obj[key]);
				if (!key.match(/^[0-9]*$/)) obj.__thisObjectIsArray = 0;
				return obj;
			    }
			    if (val.attr('className') == 'value'){
				_key = '';
				var value = $.trim(val.text()) || null;

				if (value && value.match(/^\d+$/)) {
				    value -=0;
				} else if (value === 'false') {
				    value = false;
				} else if (value === 'true') {
				    value = true;
//				} else if (value === 'undefined') {
//				    value = null;
				}

				obj[key] = value;

				if (!key.match(/^[0-9]*$/)) obj.__thisObjectIsArray = 0;
				return obj;
			    }


			    return obj;
			}


			var length = items.length;
			for (var i=0; i<length; i++) {
			    elm = $(items[i]);
			    if (elm.attr('className') == 'key'){
				_key = elm.text();
			    }

			    if (_key) {
				obj[_key] = arguments.callee.call(self, $(items[i]).children(), obj[_key]);
			    } else {
				obj = arguments.callee.call(self, $(items[i]).children(), obj);
			    }
			}
			//                console.log(obj);
			return obj;
			};
		    var obj =  _parse(root, {});
		    obj = this._makeArray(obj);



		    return obj;
		    //            console.log(this.jsonObj);
		};

		JSONE.classes.JSONE.prototype._makeArray = function(obj) {
		    if (!obj) return obj;
		    var _array = 0, parsedObj;
		    if (obj.__thisObjectIsArray) {
			parsedObj = [];
			_array = 1;
		    } else {
			parsedObj = {};
		    }

		    delete obj.__thisObjectIsArray;
		    for (var key in obj) {
			if (typeof obj[key] == 'object') obj[key] = arguments.callee.call(this, obj[key]);
			if (_array) {
			    parsedObj.push(obj[key]);
			} else {
			    parsedObj[key] = obj[key];
			}
		    }

		    return parsedObj;
		};

		JSONE.classes.JSONE.prototype.publish = function() {
		    JSONE.Msg.load();
		    // cause null publish
		    $('.focusedLine').removeClass('focusedLine');

		    this.jsonObj = this.parseHtml.call(this);
		    var obj = JSON.stringify(this.jsonObj[this.rootNode]);


		    $('#text').attr('value', obj);
		    JSONE.Msg.show('MSG_PUBLISH');

		    // save2local
		    this._saved = true;
		    save2local.saveData('json_data', obj);

//		    console.log(obj);
//		    console.log(save2local.loadData('json_data'));

		    $.scrollTo(0, 0);
		};

// not enough
		JSONE.classes.JSONE.prototype.publishXML = function() {
		    JSONE.Msg.load();
		    this.jsonObj = this.parseHtml.call(this);
            var xml = new XML.ObjTree().writeXML(this.jsonObj);

            xml = xml.replace(/<#cdata-section>/g, '<![CDATA[');
            xml = xml.replace(/<\/#cdata-section>/g, ']]>');
          xml = StringUtility.Decode.HTML(xml);

		    $('#text').attr('value', xml);
		    JSONE.Msg.show('MSG_PUBLISHXML');

		    $.scrollTo(0, 0);
		};

		JSONE.classes.JSONE.prototype._bufferMaxlength = 5;
		JSONE.classes.JSONE.prototype._buffer = [];
		JSONE.classes.JSONE.prototype._bufferRedo = [];
		JSONE.classes.JSONE.prototype._clipboard = '';

		JSONE.classes.JSONE.prototype.createLanguage = function(defaultLanguage){
		    this._lang = defaultLanguage || 'ja';
		    var obj = new JSONE._Language[this._lang];
		    obj._lang = this._lang;
		    return obj;
		};

	     // end of Jsone
		JSONE.Base = new JSONE.classes.JSONE;

    JSONE.Language = JSONE.Base.createLanguage('en');

	JSONE.Event = new function() {
		this.slideMaxValue = '';
		this.slider = '';
		this.onRead = function(e) {
		    JSONE.Base._saved = false;
		    $('#text').addClass('close').removeClass('open');
		    var data = $('#text').attr('value');
		    if (!data) JSONE.Event.actionMargin = 16;
		    try {
			JSONE.Msg.hide();
			JSONE.Base.read(data||'{}');
		    } catch(e) {
			JSONE.Msg.show('MSG_INVALID_DATA', 'error');
			//            throw(e);
		    }
		    if (!$('.btnPublish').size()) {
			var btn = "<input type='image' src='images/bt_publishjson.png' value='publish (p)' class='btnPublish' />";
			$('#control').append(btn);
			$('.btnPublish').click(function(){
				JSONE.Control.publish();
			    });

			var btnXML = "<input type='image' src='images/bt_publishxml.png' value='publish as XML (x)' class='btnPublishXML' />";
			$('#control').append(btnXML);
			$('.btnPublishXML').click(function(){
				JSONE.Control.publishXML();
			    });
		    }


		    if (this.blur) this.blur();
		};
		this.actionMargin = 16;//$.browser.msie ? 16 : 31;
		this.handleMargin = 150;
		this.handle2Right = 140;

		this.onSlide = function(ev, ui) {
		    JSONE.Event.onSlideStop(ev, ui);
		    return;
		};

		this.onSlideStop = function(ev, ui) {
		    JSONE.Event.hideActionList();
		    var w = JSONE.Event.slideFix(ui ? ui.handle : $('#handle1'));
		    $('#handle1').css('left', w[0]);
		    $('span.value').css('left', Math.round(w[0]+1) +'px').width(w[1] - w[0] +'px');
		    return;

		    if (!ev && !ui) {  // usercall

			var handles = [{handle:$('#handle1')},{handle:$('#handle2')}];
			$.each(handles, function(){
				this.value = parseInt(this.handle.css('left'), 10);
			    });
//			console.log(handles)

			JSONE.Event.onSlideStop({}, handles[0]);
//			JSONE.Event.onSlideStop({}, handles[1]);
			return;
		    }
		    if (ui.handle.attr('id') == 'handle1') {
			var w = JSONE.Event.slideFix(ui.handle, $('#handle2'), ui.handle);
		    } else {
			var w = JSONE.Event.slideFix($('#handle1'), ui.handle, ui.handle);
		    }

		    $('#handle1').css('left', w[0]);
		    $('#handle2').css('left', w[1]);
		    $('span.value').css('left', Math.round(w[0]+1) +'px').width(w[1] - w[0] +'px');

		    var action = $('div.action');
		    action.width(JSONE.Event.slideMaxValue - w[1]-1 - parseInt(action.css('right'), 10)
				 - JSONE.Event.actionMargin  +'px');
//		    console.log(JSONE.Event.slideMaxValue,  w[1]-1,  parseInt(action.css('right'), 10), JSONE.Control.helpVisibility*JSONE.Control.helpWidth)
		};


		/**
		 * margin < handle1 < handle2 < width - margin
		 */
		this.slideFix = function(ui) {
		    var pos=[], p = function(v) {return parseInt(v, 10)};
		    pos[1] = JSONE.Event.slideMaxValue - JSONE.Event.handle2Right;
		    pos[0] = Math.min(Math.max(p(ui.css('left')), JSONE.Event.handleMargin),
				      pos[1] - JSONE.Event.handleMargin);

//		    console.log(p(ui.css('left')), JSONE.Event.handleMargin, pos[1] - JSONE.Event.handleMargin);
		    JSONE.Control.saveConfig();
		    return pos;

		    var pos=[], p = function(v) {return parseInt(v, 10)};
		    var max = p($().width()) - JSONE.Control.helpVisibility*JSONE.Control.helpWidth - JSONE.Event.handleMargin,
		    pos1 = p(main.css('left')), pos2 = p(sub.css('left'));
   		    if (max - pos2 < JSONE.Event.handleMargin) {
			pos2 = max - JSONE.Event.handleMargin;
			if (pos2 - pos1 < JSONE.Event.handleMargin) pos1 = pos2 - JSONE.Event.handleMargin;
		    }


		    pos[0] = Math.min(Math.max(pos1, JSONE.Event.handleMargin),
				      p($().width()) - JSONE.Control.helpVisibility*JSONE.Control.helpWidth - JSONE.Event.handleMargin*2);

		    pos[1] = Math.max(Math.min(pos2, max),
				      p(main.css('left')), JSONE.Event.handleMargin*2);

//		    console.log(pos2, max,
//				      p(main.css('left')), JSONE.Event.handleMargin*2);

//		    console.log(p(sub.css('left')), p($().width()) -
//					       JSONE.Control.helpVisibility*JSONE.Control.helpWidth - JSONE.Event.handleMargin,
//		    p(main.css('left')), JSONE.Event.handleMargin*2, '');

		    // handle1 <<< handle2
//		    console.log('pos1',pos);
		    if (main == self) {
			if (pos[0] + JSONE.Event.handleMargin > pos[1]) pos[1] = pos[0] + JSONE.Event.handleMargin;
		    } else {
			if (pos[0] + JSONE.Event.handleMargin > pos[1]) pos[0] = pos[1] - JSONE.Event.handleMargin;
		    }
//		    console.log(pos);

		    JSONE.Control.saveConfig();
		    return pos;
		};

		this.hideActionList = function() {
		    $('#actionList').hide();
		};

		/**
		 * line focus
		 */
		this.onFocusLine = function(e){
		    var target = $(e.target);
		    while (!target.hasClass('line')) target = target.parent();

		    target.addClass('focusedLine');
		    target.one('mouseout', function(e){
			    try{
				var targetEx = $(e.relatedTarget);
			    } catch(e) { // nativescrollbar
				target.removeClass('focusedLine');
				return;
			    }
			    var callee = arguments.callee;

			    if (targetEx.attr('id') == 'actionList' || targetEx.hasClass('actionMenu')) {
				targetEx.one('mouseout', function(e){
					callee.call({}, e);
					//						console.log(callee)
					//						target.removeClass('focusedLine');
				    });
			    } else {
				target.removeClass('focusedLine');
			    }
			});
		};

		this.onMenuClick = function(e){
		    var href = $(e.target).attr('href');
		    if (!href) return;
		    href = href.replace(/^#/, '');
		    switch(href) {
		    case 'new':
		        JSONE.Control.create.call(JSONE.Control);
 		        break;
		    case 'shortcut':
		        JSONE.Control.help.call(JSONE.Control);
 		    break;

		    case 'air':
			var url = './air/index.html';
			JSONE.Control.popup.call(JSONE.Control, href, url, href);
			break;
		    default:
			var url = './' + href + '/index.html';
			JSONE.Control.popup.call(JSONE.Control, href, url, href);
			break;

		    }
		};

		// focusTextarea
		this.onFocusTextarea = function(){
		    JSONE.Base.textareaFocused = true;
		    $('#help').css('position', 'absolute');
		    var y = d.body.scrollTop  || d.documentElement.scrollTop;
		    $('#help').css('top', y + 'px');
		};

		this.onBlurTextarea = function(){
		    JSONE.Base.textareaFocused = false;
		    $('#help').css('position', 'fixed');
		    $('#help').css('top',  '');
		};

	    }; // end of Event


	JSONE.Msg = new function(){
		this.show = function(msg, className) {
		    className = className || 'action';
		    msg = this._message(msg);

		    var type = '';
		    if (className == 'action') type = 'undo';
		    if (className == 'undo') type = 'redo';
		    this.say(msg, type);
		    $('#innerMessage').attr('className', '').addClass(className + 'Msg');
		};

		this.say = function(msg, type) {
//		    type = type || 'undo';
		    if (type && (JSONE.Base._buffer.length || JSONE.Base._bufferRedo.length)) {
			msg += '<a href="javascript: void(0);" class="' + type + 'Action" >' +
			    this._message('MSG_RE' + type.toUpperCase()) + '</a>';
		    }
		    $('#innerMessage').hide().html(msg).fadeIn(100);//, function(){setTimeout(function(){$('#innerMessage').fadeOut('slow')}, 2000)});

		    $('.' + type + 'Action').one('click', function(){
			    JSONE.Control[type].call(JSONE.Control);
			    return false;
			});
		};

		// loading
		this.load = function(stop){
		    this.say(this._message('MSG_LOADING'));
		};

		this.hide = function() {
		    $('#innerMessage').html('');
		};

		this._message = function(key){
		    //var msg = this._msg[key] || key;
		    var msg = JSONE.Language.statusMsg[key] || key;
		    return msg;
		};

//		this._msg = {		};
	    };


	JSONE.classes.Control = function() {
	    this.current = false;
	    this.currentId = 0;
	    this.target = false;
	};

	JSONE.classes.Control.prototype.init = function() {
	    this.current = false;
	    this.currentId = 0;
	    this.target = false;

//	    this.items = $().xfind("//li[contains(@class, 'open')]");
//	    this.items = $().xfind("//li[contains(@class, 'open')]", '', true);
	    this.setItems();
	};


	JSONE.classes.Control.prototype.setItems = function() {
	    this._items = $().xfind("//li[contains(@class, 'open')]", '', true);
	};

	JSONE.classes.Control.prototype.getItems = function() {
	    return this._items;
	};


		JSONE.classes.Control.prototype.formatEdit = "<input type='text' value='%s' rel='%s' style='width: %sem;' /><input type='image' src='images/bt_edit.png' value='OK' class='btnEdit' />";
		JSONE.classes.Control.prototype.formatEditValue = "<textarea class='insert' rel='%s'>%s</textarea><input type='image' src='images/bt_edit.png' value='OK' class='btnEdit' />";
		JSONE.classes.Control.prototype.formatEditValueSpan = "<span class='value'><textarea class='insert' rel='%s'>%s</textarea><input type='image' src='images/bt_edit.png' value='OK' class='btnEdit' /></span>";
//		JSONE.classes.Control.prototype.formatEditKey = "<textarea style='display: none;' class='insert'>%s</textarea><input type='button' style='display: none;' value='OK' class='btnEdit' />";

		JSONE.classes.Control.prototype.formatEditKey = '%s';

		JSONE.classes.Control.prototype.next = function() {
		    var rule = function(items){
			if (this.current) {
			    return items.length > this.currentId+1 ? this.currentId+1 : 0;
			}
			return 0;
		    }
		    this._jump.call(this, rule);
		};

		JSONE.classes.Control.prototype.prev = function() {
		    var rule = function(items){
			if (this.current) {
			    return this.currentId >0 ? this.currentId-1 : items.length-1;
			}
			return 0;
		    }
		    this._jump.call(this, rule);
		};

		JSONE.classes.Control.prototype.hide = function(){
		    targetChildren = $().xfind("//li[contains(@class, 'current')]//li");
		    if (targetChildren.parent().addClass('hideParent').end().addClass('hide').removeClass('open').size()) {
			$().xfind("//li[contains(@class, 'current')]").addClass('hideList');;
		    }
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		};

		JSONE.classes.Control.prototype.grow = function(){
		    $().xfind("//li[contains(@class, 'current')]//li").addClass('open').
		    removeClass('hide').removeClass('hideList').parent().removeClass('hideParent');

		    $().xfind("//li[contains(@class, 'current')]").removeClass('hideList');
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		};

		JSONE.classes.Control.prototype.toggle = function() {
		    this.edited(nomsg=true);
		    targetParent = $().xfind("//li[contains(@class, 'current')]");
		    if(targetParent.hasClass('hideList')) {
			this.grow();
		    } else {
			this.hide();
		    }
		};

		JSONE.classes.Control.prototype._textAreaMaxWidth = 400;
		JSONE.classes.Control.prototype._textAreaMinWidth = 100;
		JSONE.classes.Control.prototype._textAreaMargin = 50;
		JSONE.classes.Control.prototype.isDummyValue = function(target){
		    if (!target || !target.hasClass('value')) return false;
//		    console.log(target, target.parent().parent().children());
		    if (target.parent().parent().children().length > 1) {
			return true;
		    }
		    return false;

		};

		JSONE.classes.Control.prototype.getTextareaSize = function(){
		    var width = parseInt($('span.value').width(), 10) - this._textAreaMargin;
		    width = Math.max(Math.min(this._textAreaMaxWidth, width), this._textAreaMinWidth);

		    return width;
		};

		// cancel editing
		JSONE.classes.Control.prototype.cancel = function(){
		    $().xfind("//input[contains(@class, 'btnEdit')]").unbind('click').hide();

		    var children = $.makeArray($().xfind("//input[contains(@type, 'text')]")).
		    concat($.makeArray($().xfind("//textarea[contains(@class, 'insert')]")));
		    var self = this, nullCount = [0,0]; // nullCount -> insertion canceld
		    if (!children.length) return;

		    $.each(children, function(){
			    var type = $(this).parent().attr('class'), dummy;
			    var text = $.trim($(this).attr('rel'))|| '';
			    nullCount[0]++;
			    if (!text) nullCount[1]++;

			    var html = $().escape(text) || ' ';

			    // this line cause crash?
			    $(this).parent().html(html);
			});
		    this.setHeightEdit.call(this);
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();

		    // insertion canceled
		    if (nullCount[0] == nullCount[1]) {
			this.current.remove();
		    }
		    this.prev();
		};

		JSONE.classes.Control.prototype.edit = function(target){
		    if (this.isDummyValue(target)) {
			return false;
		    }
		    this.edited(true);
		    this.remember();

		    var self = this;
		    var _edit = function(){
			var elm = $(this);
			var text = elm.text();
			if (elm.hasClass('key')) {
			    elm.html(sprintf(self.formatEdit, text, text, Math.max(3, Math.min(text.length, 30))));
			    self.setHeightEdit.call(self, true, 'key');
			} else {
			    elm.html(sprintf(self.formatEditValue, text, text));

			    // size
			    $().xfind("//span[@class='value']/textarea").width(self.getTextareaSize.call(self));
			    self.setHeightEdit.call(self, true);
			}
			$('.btnEdit').click(function(){
				self.edited.call(self);
				$('.focusedLine').removeClass('focusedLine');
			    });


			/**
			 * for fixed fx2.0 bug
			 * http://blog.livedoor.jp/tzifa/archives/50799216.html
			 */
			if ($.browser.mozilla && parseFloat($.browser.version) < 1.9) {
			    $().xfind('//*[../@class="key" or ../@class="value"][@class="insert" or @rel!=""]').
				focus(function(){
					JSONE.Event.onFocusTextarea();
				    }).blur(function(){
					    JSONE.Event.onBlurTextarea();
					});
			}

		    }
		    if (target) {
			// set as current
			this._jump(function() {
				var items = self.getItems();
				return items.index($(target).parent().parent()[0]);
			    });
			_edit.call(target);
			return false;
		    }
		    var children = $().xfind("//li[contains(@class,'current')]/div/span");
		    if (!children.size()) return;


		    // if current item is key and value pair
		    if (children.size() > 1 && $(children[1]).attr('className') == 'value' && this.current.children().size()==1) {
			$.each(children, _edit);
			this._forcus();
			return false;
		    }
		    _edit.call(children[0]);



		    this._forcus();
		    JSONE.Base.setBtn();
		    return false;
		};

		/**
		 * change height for textarea in editing list
		 */
		JSONE.classes.Control.prototype.setHeightEdit = function(nowEditing, type){
		    if (!this.current) return;

		    if (nowEditing) {
			switch (type) {
			case 'key':
			    this.current.children('.line').addClass('editingKey');
			    break;
			default:
			    this.current.children('.line').addClass('editing').removeClass('editingKey');
			    break;
			}
		    } else {
			$().xfind('//div[contains(@class, "editing")]').removeClass('editing');
			$().xfind('//div[contains(@class, "editingKey")]').removeClass('editingKey');
		    }
		};

		/**
		 * var @nomsg boolean true->no message shown
		 */
		JSONE.classes.Control.prototype.edited = function(nomsg){
//		    console.log($().xfind("//li"), 'sub');

		    if (!nomsg) {
			JSONE.Msg.load();
		    }
		    $().xfind("//input[contains(@class, 'btnEdit')]").unbind('click').hide();

//		    var children = $.makeArray($().xfind("//input[contains(@type, 'text')]")).
//		    concat($.makeArray($().xfind("//textarea[contains(@class, 'insert')]")));


		    var self = this;


		    // key
		    var key = $().xfind("//input[contains(@type, 'text')]")[0];
		    var type = $(key).parent().attr('class'), dummy,
		    text = $(key).attr('value')|| '';

		    var html = $().escape($.trim(text)) || ' ';
		    $(key).parent().html(html);


		    var value = $().xfind("//textarea[contains(@class, 'insert')]")[0];
		    var type = $(value).parent().attr('class'), dummy,
		    text = $(value).attr('value')|| '';
		    if (text.match(/[\{\[]/)) {
			try {
			    JSONE.Base.jsonObj = JSON.parse(text);
			    var typeOf = JSONE.Base.jsonObj.constructor;
			    if (typeOf == Array) typeOf = 'array';
			    else if (typeOf == Object) typeOf = 'object';
			    else typeOf = '';
			    text = "<ul>" + JSONE.Base.buildHtml() + "</ul>";
			    dummy = "<span class='value'>" + JSONE.Base.nullValue + "</span>" + JSONE.Base.actionDivKey;
			    $().xfind("//li[contains(@class, 'current')]/div/div").remove();
			    $(value).parent().replaceWith(dummy);
			    self.current.append(text);
			} catch(e) {
			    JSONE.Base.jsonObj = text;
			}
			return;
		    }

		    var html = $().escape($.trim(text)) || ' ';

		    // this line cause crash? yesssssssssssssss!!!!!!!
//		    $(value).parent().html(html);

		    $().xfind("//textarea[contains(@class, 'insert')]/..").html(html);

		    this.setHeightEdit.call(this);
		    this.setItems();
		    if (!nomsg) {
			JSONE.Msg.show('MSG_CHANGED');
		    }

		    return;

		    $.each(children, function(key){
			    var type = $(this).parent().attr('class'), dummy;
			    var text = $(this).attr('value')|| '';

			    if (type == 'value' && text.match(/[\{\[]/)) {

				try {
				    JSONE.Base.jsonObj = JSON.parse(text);
				    var typeOf = JSONE.Base.jsonObj.constructor;
				    if (typeOf == Array) typeOf = 'array';
				    else if (typeOf == Object) typeOf = 'object';
				    else typeOf = '';
//				    $(this).parent().parent().attr('type', typeOf);
//				    text = JSONE.Base.actionDivKey + "<ul>" + JSONE.Base.buildHtml() + "</ul>";
				    text = "<ul>" + JSONE.Base.buildHtml() + "</ul>";

				    dummy = "<span class='value'>" + JSONE.Base.nullValue + "</span>" + JSONE.Base.actionDivKey;

				    $().xfind("//li[contains(@class, 'current')]/div/div").remove();
				    $(this).parent().replaceWith(dummy);
//				    console.log(self.current)
				    self.current.append(text);

				} catch(e) {
				    JSONE.Base.jsonObj = text;
				}
				return;
			    }

			    text = text.replace(/[\n\r]*$/, '');
			    var html = $().escape($.trim(text)) || ' ';


			    var _self = this;
			    // this line cause crash? yesssssssssssssss!!!!!!!
//			    suspend[key] = $(this).parent();
//			    alert([_self, html]);

//			    alert($(this).parent().html());
//			    $(this).parent().html(html);
			    var parent = $(this).parent();
			    $(this).remove();
//			    parent.html(html);

			});

//		    alert(children);
//		    $.each(suspend, function(key){this.html('hoge')});

		    this.setHeightEdit.call(this);
		    this.setItems();
		    if (!nomsg) {
			JSONE.Msg.show('MSG_CHANGED');
		    }

		};

		/**
		 * @var rule function would return targetId
		 * items must be cached
		 */
		JSONE.classes.Control.prototype._jump = function(rule) {
		    var targetId = 0;
		    if (!JSONE.Base.count()) this.current = false, rule = function(){return 0;}

		    //var items = $().xfind("//li[contains(@class, 'open')]");
//		    var items = this.items;
		    var items = this.getItems();

		    if (!items) return;
		    rule = rule || function(){return 0;}
		    targetId = rule.call(this, items);

		    if (!items[targetId]) return;
		    this.target = $(items[targetId]);
		    this._scroll.call(this, targetId);

//		    console.log(targetId, this.target)
		};

		JSONE.classes.Control.prototype._scrollMargin = [100, 150];
		JSONE.classes.Control.prototype._scroll = function(id) {
		    var x = d.body.scrollLeft || d.documentElement.scrollLeft;
		    var y = d.body.scrollTop  || d.documentElement.scrollTop;
		    var w = window.innerWidth || d.documentElement.clientWidth || d.body.clientWidth ;
		    var h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
		    var pos = this.target.offset();


		    //scroll
		    pos.top = parseInt(pos.top, 10);
		    if (pos.top - y > h - this._scrollMargin[1]) {
			$.scrollTo(0, pos.top - h + this._scrollMargin[1]);
		    } else if (pos.top - y < this._scrollMargin[0]) {
			$.scrollTo(0, pos.top-this._scrollMargin[0]);
		    }

		    //console.log([this.target, this.target.offset(), x, y, w, h])
		    this._setCurrent.call(this, id, this.target);
		};


		JSONE.classes.Control.prototype._setCurrent = function(id, target){
		    target.addClass('current').children('div').addClass('curLine');

		    //alert([this.current, target])
		    if (this.current && this.current[0] != target[0]) {
			this.current.removeClass('current').children('div').removeClass('curLine');
		    }
		    this.current = target;
		    this.currentId = id;
		};

		JSONE.classes.Control.prototype.publish = function(){
		    JSONE.Base.publish();
		    $('#text').removeClass('close').addClass('open');
		};

		JSONE.classes.Control.prototype.publishXML = function(){
		    JSONE.Base.publishXML();
		    $('#text').removeClass('close').addClass('open');
		};


		JSONE.classes.Control.prototype.copy = function() {
		    // id would be doubled but id not use anywhere... umm..
		    var closure = function(id, current) {
			var elm = current;


			var format  = "<li id='item_%s' class='open%s'>%s</li>";
//			console.log(current)
			var html = sprintf(format, id, current.hasClass('hideList') ? ' hideList' : '', elm.html());

			if (this.isRoot()) $().xfind('id("root")/ul').append(html);
			else elm.after(html);
		    };
		    this._insert(closure, nomsg=true);
		    var key = $().xfind('//li[contains(@class, "current")]/div/span[contains(@class, "key")]');
		    if (key.size()) {
			var _key = this.getUniqueValue(key.html());
			key.html(_key);
		    }
		    JSONE.Msg.show('MSG_COPIED', 'undo');
		};

		JSONE.classes.Control.prototype.getUniqueValue = function(key) {
		    var _key= 1, max =1000, i=0,
		    format = '%s_%s', name = (key+'').match(/^[0-9]+$/) ? key-0 : sprintf(format, key, _key);
//		    console.log(name, 0);
		    while (i < max && $().xfind('//li[contains(@class, "current")]/../li/div/span[contains(text(),"' +
						name + '") and contains(@class, "key")]').size()) {
			name = (typeof name == 'number') ? name+1 : sprintf(format, key, _key);
//			console.log(name, i);
			_key++, i++;

		    }
		    return name;
//		    console.log(name, i);
		};

		JSONE.classes.Control.prototype.insert = function(keyOnly) {
		    var closure = function(id, current) {
			var _key= current.parent().children().size(), _value='';

			var key = sprintf(this.formatEdit, _key, '', 5);
			var value = keyOnly ? sprintf(this.formatEditKey, '', '') : sprintf(this.formatEditValue, _value, '');
			var html = keyOnly ? sprintf(JSONE.Base.childKeyFormat, id, key, value) : sprintf(JSONE.Base.childFormat, id, key, value);

			if (this.isRoot()) $().xfind('id("root")/ul').append(html);
			else current.after(html);
		    };
		    this._insert(closure);

		    this.setHeightEdit.call(this, true, keyOnly ? 'key' : null);
		};

		JSONE.classes.Control.prototype.insertKey = function() {
		    this.insert(keyOnly=true);
		    return;
		};

		JSONE.classes.Control.prototype._insert = function(method, nomsg) {
		    this.edited(true);
		    this.remember();


		    JSONE.Base.id++;
		    id = JSONE.Base.id;

		    if (!this.current) this.current = $('#root'), this.currentId = 0;


		    method.call(this, id, this.current);

		    // size
		    $().xfind("//span[@class='value']/textarea").width(JSONE.Control.getTextareaSize.call(JSONE.Control));

		    // slide
//		    JSONE.Event.slideMaxValue = $().width();
//		    JSONE.Event.onSlideStop();

		    var self = this;
		    $('.btnEdit').click(function(e){
			    self.edited.call(self, nomsg);
			    $('.focusedLine').removeClass('focusedLine');
			});
//		    $('#help').css('height', $().height() +'px')

		    /**
		     * for fixed fx2.0 bug
		     * http://blog.livedoor.jp/tzifa/archives/50799216.html
		     */
		    if ($.browser.mozilla && parseFloat($.browser.version) < 1.9) {
			$().xfind('//*[../@class="key" or ../@class="value"][@class="insert" or @type="text"]').
			    focus(function(){
				    JSONE.Event.onFocusTextarea();
				}).blur(function(){
					JSONE.Event.onBlurTextarea();
				    });
		    }

		    this._forcus();

		    JSONE.Base.setBtn();
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		    var items = this.getItems();

		    // set as current
		    var self = this;
		    this._jump(function() {
//			    console.log(items, $('#item_' + id), items.index($('#item_' + id)[0]), id);
			    return items.index($('#item_' + id)[0]);
			});
		};


		JSONE.classes.Control.prototype.insertAsChild = function(keyOnly) {

		    // if current has value already, nothing will happen.
		    if ($.trim($().xfind('//li[contains(@class, "current")]/div/span[@class="value"]').text())) {
			JSONE.Msg.show('MSG_CANT_DO', 'error');
			return;
		    }

		    var closure = function(id, current) {
			var _key= $().xfind("//li[contains(@class, 'current')]/ul/li").size(), _value='', target;

			var key = sprintf(this.formatEdit, _key, '', 5);
			var value = keyOnly ?  sprintf(this.formatEditKey, '', '') : sprintf(this.formatEditValue, _value, '');
//			var html = sprintf(JSONE.Base.childFormat, id, key, value);

			var html = keyOnly ? sprintf(JSONE.Base.childKeyFormat, id, key, value) : sprintf(JSONE.Base.childFormat, id, key, value);


			// children exists already
			if (current.children().size() > 1 ) {
			    target = $(current.children()[1]);
			    target.append(html);
			} else {
			    var format = "<ul>%s</ul>";
			    target = current;
			    target.append(sprintf(format, html));
			}
			$().xfind('//li[contains(@class, "current")]/div/span[@class="value"]').children().css('display', 'none');
			//			console.log(target)


		    };
		    this._insert(closure);
		    this.setHeightEdit.call(this, true, keyOnly ? 'key' : null);
		};
		JSONE.classes.Control.prototype.insertKeyAsChild = function() {
		    this.insertAsChild(keyOnly=true);
		};

		JSONE.classes.Control.prototype.insertValue = function() {
		    // if current has value already, nothing will happen.
		    if ($('.current span.value textarea').size() || this.isRoot() || this.current.children().size() > 1) {
			JSONE.Msg.show('MSG_CANT_DO', 'error');
			return;
		    }
		    var closure = function(id, current) {
			var value = $().xfind("//li[contains(@class,'current')]//span[@class='value']");
			if (!value.size()) {
			    var valueNode = sprintf(this.formatEditValueSpan, '', '');
			    $().xfind("//li[contains(@class,'current')]//span[@class='key']").after(valueNode);
			} else {
			    var valueNode = sprintf(this.formatEditValue, value.text(), value.text());
			    value.html(valueNode);
			}
//			console.log(valueNode)
		    };
		    this._insert(closure);
		    this.setHeightEdit.call(this, true);

		};

		JSONE.classes.Control.prototype._forcus = function(type) {
		    type = type || "//input[contains(@type, 'text')]";
		    setTimeout(function(){
			    var obj = $().xfind(type);
			    if (obj.size() && obj[0].focus) try {obj[0].focus();} catch(e) {}
			}, 500);

		};


		JSONE.classes.Control.prototype.test = function(){
//		    console.log('test!');
		};

		JSONE.classes.Control.prototype.paste = function(targett) {
		    if (!JSONE.Base._clipboard.length) return;
//		    console.log(JSONE.Base._clipboard)

		    var closure = function(id, current) {
			var elm = current, html = JSONE.Base._clipboard;
			var format  = "<li id='item_%s' class='open%s'>%s</li>";
			html = sprintf(format, id, current.hasClass('hideList') ? ' hideList' : '', html);
			if (this.isRoot()) $().xfind('id("root")/ul').append(html);
			else elm.after(html);
		    };
		    this._insert(closure, nomsg=true);
		    JSONE.Msg.show('MSG_COPIED', 'undo');

		};

		JSONE.classes.Control.prototype.del = function(target){
		    JSONE.Msg.load();
		    if (this.isRoot(target)) return false;
		    this.remember();
		    target = target ? target : $().xfind("//li[contains(@class, 'current')]");
		    this.currentId = Math.max(0, $().xfind("//li[contains(@class, 'open')]").index(target[0])-1);

		    JSONE.Base._clipboard = target.html();
		    target.remove();
		    JSONE.Msg.show('MSG_DELETED');
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		    this.next();
		};

		JSONE.classes.Control.prototype.isRoot = function(target) {
		    //	    console.log([target, this.currentId]);
		    if ((!target && !this.currentId) || (target && target.parent().attr('id') == 'root')) return true;
		    return false;
		};

		JSONE.classes.Control.prototype.helpVisibility = false;

		JSONE.classes.Control.prototype.helpWidth = 250;
		JSONE.classes.Control.prototype.helpWidthClose = 230;
		JSONE.classes.Control.prototype.sliderPos = [];
		JSONE.classes.Control.prototype.helpMargins = [200, 300];
		JSONE.classes.Control.prototype.help = function() {
		    JSONE.Event.hideActionList();

		    this.helpVisibility = !this.helpVisibility;
		    if (this.helpVisibility) {
			$('#help').animate({width:(this.helpWidth-this.helpWidthClose*(!this.helpVisibility)) + 'px'}, 200, '', function(){
				$('#innerHelp dd').toggle();
			    });
		    } else {
			$('#innerHelp dd').toggle();
			$('#help').animate({width:(this.helpWidth-this.helpWidthClose*(!this.helpVisibility)) + 'px'}, 200);
		    }

//		    $('#content').animate({width:parseInt($().width(), 10) - this.helpWidth*this.helpVisibility+ 'px'}, 200);

		    this.saveConfig();
		    return;

		    // slider
		    var action = $('div.action');
		    var handles = [$('#handle1'), $('#handle2')];


		    if (this.helpVisibility) {
			this.sliderPos = [handles[0].css('left'), JSONE.Event.handle2Right];



			if (parseInt($().width(''), 10) < this.helpWidth + parseInt(handles[1].css('left'), 10) + this.helpMargins[0]) {
			    handles[1].css('left', parseInt($().width(), 10) - this.helpWidth - this.helpMargins[0]);
			}
			if (parseInt($().width(), 10) < this.helpWidth + parseInt(handles[0].css('left'), 10) + this.helpMargins[1]) {
			    handles[0].css('left', parseInt($().width(), 10) - this.helpWidth - this.helpMargins[1]);

			}
		    } else {
//			console.log(this.sliderPos)
			var self = this;
			$.each(handles, function(key){
				this.css('left', self.sliderPos[key]);
			    });
		    }

		    JSONE.Event.onSlideStop(null, {value: handles[0].css('left'), handle: handles[0]});
		    JSONE.Event.onSlideStop(null, {value: handles[1].css('left'), handle: handles[1]});

		    JSONE.Control.saveConfig();
		};

		JSONE.classes.Control.prototype.remember = function(undo, noClearRedo){
//		    return
		    var target = undo ?  JSONE.Base._bufferRedo : JSONE.Base._buffer;

		    JSONE.Base._saved = false;

		    if (target.length >= JSONE.Base._bufferMaxlength) target.shift();
//		    console.log(JSONE.Base.parseHtml()[JSONE.Base.rootNode])
		    target.push(JSONE.Base.parseHtml()[JSONE.Base.rootNode]);
		    if (!noClearRedo) {
			JSONE.Base._bufferRedo = [];
		    }
		};

		JSONE.classes.Control.prototype.redo = function(){
		    if (!JSONE.Base._bufferRedo.length) return;
		    JSONE.Msg.load();
		    this.remember(undo=false, noClearRedo=true);
		    JSONE.Base.jsonObj = JSONE.Base._bufferRedo.pop();
		    JSONE.Base.display();

		    JSONE.Msg.show('MSG_REDO', 'action');
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		};

		JSONE.classes.Control.prototype.read = function() {
		    JSONE.Event.onRead();
		};

		JSONE.classes.Control.prototype.readUri = function() {
		    var uri = window.location.hash.replace(/^#*uri\//, ''),
		    self = this;

		    $.post('./uri/read?' + uri,
			   {hoge:1}, function(data){
			       $('#text').attr('value', data);
			       self.read();
			   })

		};

		JSONE.classes.Control.prototype.undo = function(){
		    if (!JSONE.Base._buffer.length) return;
		    JSONE.Msg.load();

		    this.remember(undo=true, noClearRedo=true);
		    JSONE.Base.jsonObj = JSONE.Base._buffer.pop();
		    JSONE.Base.display();
		    JSONE.Msg.show('MSG_UNDO', 'undo');
//		    this.items = $().xfind("//li[contains(@class, 'open')]");
		    this.setItems();
		};

		/**
		 * when create execute, handle2 would be little to left side...
		 */
		JSONE.classes.Control.prototype.create = function(){
		    this.remember();
		    if ($('#text').attr('value') && !window.confirm(JSONE.Msg._message('MSG_CREATE'))) {
			return;
		    }
		    $('#text').attr('value', '');

		    JSONE.Event.actionMargin = 16;
		    this.read();
		    this.next();
		    JSONE.Msg.show('MSG_NEW');
		};

		/**
		 * save config
		 */
		JSONE.classes.Control.prototype.saveConfig = function(){
		    $.cookie('handle1', $('#handle1').css('left'));
//		    $.cookie('handle2', $('#handle2').css('left'));
		    $.cookie('help', this.helpVisibility+1);
		    $.cookie('vimode', JSONE.Base._vimode+1);
		};

		JSONE.classes.Control.prototype.readConfig = function() {
		    $('#handle1').css('left', $.cookie('handle1'));

		    if ($.cookie('help') == 2) this.help();
		    JSONE.Base._vimode = $.cookie('vimode') -1;
		};

		JSONE.classes.Control.prototype.popup = function(title, url, key) {
		    var href = window.location.hash;
		    href = href.replace(/^#/, '');
//		    console.log(key, href);
		    if (key && href == key) {
			tb_remove();
			return;
		    }
		    if (key) {
			window.location.hash = key;
		    }
		    var height = $(window).height()*0.75, width = $(window).width()/2;
		    tb_show(title, url + '?width='+ width + '&height=' + height);
		};

		JSONE.classes.Control.prototype.save = function(){
		    var jsonObj = JSONE.Base.parseHtml.call(JSONE.Base);
		    var obj = JSON.stringify(jsonObj[JSONE.Base.rootNode]);

		    // save2local
		    JSONE.Base._saved = true;

		    save2local.saveData('json_data', obj);

		    JSONE.Msg.show('MSG_AUTOSAVING', 'error');
		};



	JSONE.classes.KeyBind = function() {
	    this.kb
	};
	JSONE.classes.KeyBind.prototype.keys = {
		    a: 'create',
		    j: 'next',
		    k: 'prev',
		    down: 'next',
		    up: 'prev',
		    c: 'del', // cut
		    s: 'toggle',
//		    s: 'save',
//		    t: 'toggle',
		    e: 'edit',
		    i: 'insert',
		    n: 'insertKey',
		    I: 'insertAsChild',
		    N: 'insertKeyAsChild',
		    m: 'insertValue',
		    d: 'copy', // duplicate
		    r: 'read',
		    p: 'publish',
		    v: 'paste',
		    x: 'publishXML',
		    z: 'undo',
		    y: 'redo',
		    '1': function(){$('#text').removeClass('close').addClass('open');},
		    '2': function(){$('#text').removeClass('open').addClass('close');},
		    h: function(){JSONE.Control.popup('', './help/index.html', 'help')},
		    b: function(){JSONE.Control.popup('', './about/index.html', 'about')},
		    ':+v+i': 'viModeStart',
		    'esc': 'cancel',
		    'ctrl+m': 'edited',
		    '?': 'help'
	};



	JSONE.classes.KeyBind.prototype.actionListKeys = {
		    e: 'actionEditable',
		    c: 'actionDel',
		    d: 'actionCopy',
		    v: 'actionPaste',
		    i: 'actionInsert',
		    n: 'actionInsertKey',
		    m: 'actionInsertValue',
		    I: 'actionInsertChild',
		    N: 'actionInsertChildKey'
	};
	JSONE.classes.KeyBind.prototype.init = function(vimode) {
	    // draw help
	    var html='',img,
	    format = "<dl>%s</dl>",
	    formatLine = "<dt style='background-image:url(./images/shortcut/%s.gif);'>%s</dt><dd>%s</dd>";

	    $.each(JSONE.Language.keyInfo, function(key){
		    if (key == '?') img = 'shortcut';
		    else if (key.toUpperCase() == key) img = key.toLowerCase() + '_u';
		    else img = key;
		    html += sprintf(formatLine, img, key, this);
		});
	    $('#innerHelp').html(sprintf(format, html));
	    //		    console.log(vimode)
	    var keys = this.keys;

	    // key bind
	    this.kb = new HotKey;
	    var me = this;
	    $.each(keys, function(key){
		    var self = this;
		    me.kb.add(key,
			      typeof self == 'function' ? self : function(e) {
				  JSONE.Control[self] ? JSONE.Control[self]() :
				  function(){}();
				  if (e.preventDefault) {
				      e.preventDefault();
				      e.stopPropagation();
				  }
				  return false;
			      }
			      );
		});
	};


	$.scrollTo = function(x, y) {
        var scr = window.scroll||window.scrollTo;
	scr(x, y);

    }


    $.fn.extend({
	    escape: function(text){
//		var d = document;
		var div = d.createElement('div');
		var txt=d.createTextNode(text);
		div.appendChild(txt);
		//d.removeChild(div);
		text = div.innerHTML;
		return text;
	    }
	});


    function sprintf(){
	var format = Array.prototype.shift.apply(arguments);
	var args   = arguments;
	var i=0;
	return format.replace(/%s/g, function(){
		return args[i++];
	    });
    }

})(jQuery);



// override thickbox
function tb_position() {
    if (!$('#air_install').size()) return;
    $('#download').load('./app/soft/', true);

    var requiredMajorVersion = 9;
    // Minor version of Flash required
    var requiredMinorVersion = 0;
    // Minor version of Flash required
    var requiredRevision = 115;		// This is Flash Player 9 Update 3
    var hasReqestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

    if (hasReqestedVersion) {
	// if we've detected an acceptable version
	// embed the Flash Content SWF when all tests are passed

	AC_FL_RunContent(
		'codebase','http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab',
		'width','217',
		'height','180',
		'id','badge',
		'align','middle',
		'src','badge',
		'quality','high',
		'bgcolor','#FFFFFF',
		'name','badge',
		'allowscriptaccess','all',
		'pluginspage','http://www.macromedia.com/go/getflashplayer',
		'flashvars','appname=JSON%20Editor&appurl=http://jsoneditor.net/app/soft/download&airversion=1.5&imageurl=./images/air_installer.png',
		'movie','swf/badge', 'air_install' ); //end AC code

    } else {   // Flash Player is too old or we can't detect the plugin
	var html = '';
	html += '<p>Download <a href="http://jsoneditor.net/app/soft/download">JSON Editor</a> now.<br /><span id="AIRDownloadMessageRuntime">This application requires the <a href="';

	var platform = 'unknown';
	if (typeof(window.navigator.platform) != undefined)
	{
		platform = window.navigator.platform.toLowerCase();
		if (platform.indexOf('win') != -1)
			platform = 'win';
		else if (platform.indexOf('mac') != -1)
			platform = 'mac';
	}

	if (platform == 'win')
	    html += 'http://airdownload.adobe.com/air/win/download/1.1/AdobeAIRInstaller.exe';
	else if (platform == 'mac')
	    html += 'http://airdownload.adobe.com/air/mac/download/1.1/AdobeAIR.dmg';
	else
	    html += 'http://www.adobe.com/go/getair/';


	html += '">Adobe&#174;&nbsp;AIR&#8482; runtime</a>.</span></p>';

	$('#air_install').html(html);
    }

}


function tb_remove() {
 	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	document.onkeydown = "";
	document.onkeyup = "";
	window.location.hash = 'editor';
	return false;
}
