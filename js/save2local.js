/*--------------------------------------------------------------------
 * save2local.js
 * Unoh Inc. 2007/01/26
 * -------------------------------------------------------------------
 */
var save2local = {
    version:    '1.000',
    swf_path:   'swf/save2local.swf',
    objid:      'save2local_objid',
    divid:      'save2local_divid',
    swf:        undefined,
    getObj:     function () {
                    var id = this.objid;
                    return (navigator.appName.indexOf("Microsoft") != -1) ? window[id] : document[id];
                },

    // if data contain escaped double quortation (\"), loadData crush... 
    saveData:   function (key, dat) {
                    var f = this.getObj();
		    if (dat) dat = dat.replace(/\\"/g, '######'); // added pm11op
//		    console.log(dat)
                    if (f && f.saveData) f.saveData(key, dat);
                },
    loadData:   function (key) {
                    var f = this.getObj();
//		    console.log(f.loadData(key))
                    if (f && f.loadData) {
                        var dat = f.loadData(key);
  		        if (dat) dat = dat.replace(/######/g, '\\"'); // added pm11op
                        return dat;
                    }
                    return undefined;
                }
};

//document.write('<!-- saved from url=(0013)about:internet -->');
//document.write('<div id="' + save2local.divid + '"></div>');

//save2local.swf  = new SWFObject(save2local.swf_path, save2local.objid, "1", "1", "8", "white");
//save2local.swf.write(save2local.divid);

$(function(){
var _html = '<!-- saved from url=(0013)about:internet -->' +
    '<div id="' + save2local.divid + '"></div>';
$('#content').append(_html);


if (swfobject.hasFlashPlayerVersion("8.0.0")) {
    var fn = function() {
	var att = { data:save2local.swf_path, width:"1", height:"1", id: save2local.objid};
	var id = save2local.divid;
	var myObject = swfobject.createSWF(att, save2local.objid, id);
    };
    swfobject.addDomLoadEvent(fn);
//    console.log('ready');
}



    });
//--------------------------------------------------------------------

