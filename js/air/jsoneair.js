var d = document, menuListener;

// prepare menu area
var textMenu = air.ui.Menu.createFromJSON("js/air/test.js");
air.ui.Menu.setAsMenu(textMenu, true);

function doLoad() {


    /**
     * check for update
     * these code must be excuted only air
     */
    +function(){
	var title = d.title;
	var updater = new AirSimpleUpdater(
					   'http://jsoneditor.net/application.xml',
					   'http://jsoneditor.net/app/soft/download/%version%');

	// version
	d.title = d.title + ' ver. ' + updater.getLocalVersion();

	/**
	 * Handle an error.
	 */
	updater.handleError = function(error) {
	    // not connected
	    if (error.errorID == 2032) {
		d.title = title;
		return;
	    }
	    var msg = error.text == undefined ? error.message : error.text;
	    alert("Error:\r\n\r\n" + msg);
	};

	updater.run();
    }();


//    return;

    window.da = document.getElementById('UI').contentWindow.childSandboxBridge;


    var files = new AIRFiles(air);


    menuListener = function(e) {
	switch (e.target.label) {
	case 'Open':
	    files.openFileDB(
			     function(text){
				 da.set('text', 'value', text);
				 da.read();
			     });
	    break;
	case 'Save':
	    files.saveFile(function(){
		    da.publish();
		    return da.get('text').value;
		});
	    break;
	case 'Save as...':
   	    files.saveAs(function(){
		da.publish();
		return da.get('text').value;
	    });
	    break;

	case 'Quit':
	    air.NativeApplication.nativeApplication.exit();
	}

    };

    //make menu
    var textMenu = air.ui.Menu.createFromJSON("js/air/textContextMenu.js");
    air.ui.Menu.setAsMenu(textMenu, true);

}

