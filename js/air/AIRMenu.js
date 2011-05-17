+function(){
    var root = new air.NativeMenu;
    var file = root.addSubmenu(new air.NativeMenu, 'File');
    var exit = new air.NativeMenuItem('Exit');
    exit.addEventListener(air.Event.SELECT, function(e){alert(e.target.label)});

    file.submenu.addItem(exit);

    if(air.NativeApplication.supportsMenu){
	air.NativeApplication.nativeApplication.menu = root;
    } else if (air.NativeWindow.supportsMenu) {
	stage.nativeWindow.menu = root;
    }
}//();