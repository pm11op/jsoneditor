var JSONE = JSONE || {};
var ex= function(obj1, obj2){
    $.each(obj2, function(key){
	    obj1[key] = this;
	});

    return obj1;
};
JSONE._Language = {};
JSONE._Language.ja = function(){};
JSONE._Language.ja.prototype = {
    statusMsg: {
	'MSG_PUBLISH': 'JSON を出力しました',
	'MSG_COPIED': 'ノードをコピーしました',
	'MSG_PUBLISHXML': 'XML で出力しました',
	'MSG_CHANGED': 'ツリーを更新しました',
	'MSG_DELETED': '削除しました',
	'MSG_REDO': 'やり直しました',
	'MSG_UNDO': 'とり消しました',
	'MSG_REREDO': 'やり直し',
	'MSG_REUNDO': 'とり消し',
	'MSG_READ': 'データ読み込みました',
	'MSG_NEW': '新規作成',
	'MSG_INVALID_DATA': '不適切なデータです',
	'MSG_LOADING': '',
	'MSG_AUTOSAVING': '',
	'MSG_NOTSAVED': 'saved?',
	'MSG_CREATE': 'The Editing data will be *lost*. Create a new one?',
	'MSG_CANT_DO': '無効なアクションです'
    }
};

JSONE._Language.en = function(){};
JSONE._Language.en.prototype = {
    statusMsg: {
	'MSG_PUBLISH': 'The JSON data has been outputed.',
	'MSG_PUBLISHXML': 'The XML data has been outputed.',
	'MSG_CHANGED': 'Edited the node.',
	'MSG_DELETED': 'Deleted the node.',
	'MSG_READ': 'Loaded the data.',
	'MSG_REDO': 'Redo OK.',
	'MSG_UNDO': 'Undo OK.',
	'MSG_REREDO': 'Redo?',
	'MSG_REUNDO': 'Undo?',
	'MSG_NEW': 'Initialized.',
	'MSG_COPIED': 'Duplicated the node.',
	'MSG_INVALID_DATA': 'Invalid data.',
	'MSG_LOADING': '<img src="./images/loading.gif" />',
	'MSG_AUTOSAVING': 'saved to local',
	'MSG_NOTSAVED': 'The Editing data will be *lost*.',
	'MSG_CREATE': 'The Editing data will be *lost*. Create a new one?',
	'MSG_CANT_DO': 'Invalid action.'
    },
    
    keyInfo:  {
	'?': 'Open shortcut help (Shift+"/")',
	a: 'Create a new one',
	j: 'Next item',
	k: 'Prev item',
	c: 'Cut',
	v: 'Paste',
//	s: 'Save to local',
//	t: 'Toggle expand / collapse',
	s: 'Toggle expand / collapse',
	e: 'Edit - "Ctrl+Enter"->OK, "Esc"->Cancel ',
	i: 'Append node',
	n: 'Append Key only',
	I: 'Append child node (Shift+"i")',
	N: 'Append child Key only (Shift+"n")',
	m: 'Append Value only',
	d: 'Duplicate',
	r: 'Read from textarea',
	p: 'Publish as JSON',
	x: 'Publish as XML',
	z: 'Undo',
	y: 'Redo',
	1: 'Make textarea size larger',
	2: 'Make textarea size smaller'
    }

};