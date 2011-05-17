/* AIR Menus HTML application logic **/
		var popUp;
		var eventLog;

		var macStandardModifier = air.Keyboard.COMMAND;
		var winStandardModifier = air.Keyboard.CONTROL;
		var standardModifier;
		
		var macQuitLabel = "Quit";
		var winQuitLabel = "Exit";
		var quitLabel;
		
		var macInstructions ="Choose an item from the menu, control-click in the window \n" +
							" to open a context menu, click in the window to \n" +
							" pop up a menu, or click and hold on the dock icon \n" + 
							" to open the dock menu.\n\n"
		var winInstructions = "Choose an item from the menu, right-click in the window \n" +
							" to open a context menu, left-click in the window to \n" +
							" pop up a menu, or right-click on the system tray icon \n" + 
							" to open the system tray menu.\n\n";
		
		//Sets the system tray or dock icon with the loaded image
		var iconLoadComplete = function(event)
		{
			air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
		}
	
		//Creates the menus
		function AIRMenus(){
			//Set OS-specific variables
			var preface = document.getElementById("preface");
			var currentOS = air.Capabilities.os;
			var containsWindows = currentOS.search("Windows");
			if(containsWindows > -1){
				preface.appendChild(document.createTextNode(winInstructions));
				standardModifier = winStandardModifier;
				quitLabel = winQuitLabel;
			} else {
				preface.appendChild(document.createTextNode(macInstructions));
				standardModifier = macStandardModifier;
				quitLabel = macQuitLabel;
			}		
			
			//For application menu (on MAC OS X)
			if(air.NativeApplication.supportsMenu){
				air.NativeApplication.nativeApplication.menu = createRootMenu("application menu");
			}
			
			//Create Dock menu and set icon image
			if(air.NativeApplication.supportsDockIcon){
				air.NativeApplication.nativeApplication.icon.menu = createRootMenu("dock icon menu");
				var dockIconLoader = new runtime.flash.display.Loader();
				dockIconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete);
				dockIconLoader.load(new air.URLRequest("icons/AIRApp_128.png"));
			}
			
			//For window menu (on Microsoft Windows)
			if(air.NativeWindow.supportsMenu){
				window.nativeWindow.menu = createRootMenu("window menu");
			}
			
			//Create system tray icon menu, tooltip and set the image so that the icon will be shown
			if(air.NativeApplication.supportsSystemTrayIcon){
				air.NativeApplication.nativeApplication.icon.tooltip = "AIR Menus HTML";
				air.NativeApplication.nativeApplication.icon.menu = createRootMenu("system tray icon menu");
				var systrayIconLoader = new runtime.flash.display.Loader();
				systrayIconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete);
				systrayIconLoader.load(new air.URLRequest("icons/AIRApp_16.png"));
			}
			
			window.htmlLoader.contextMenu = createRootMenu("htmlLoader context menu");
			
			//Create the pop-up menu
			popUp = createRootMenu("pop-up menu");
			
			//Activate this window so that it will be visible
			window.nativeWindow.activate();
						
			//Get a reference to the eventLog element where the selection events are displayed
			eventLog = document.getElementById("eventLog");
		}
		
		//Reports the chosen menu command
		function itemSelected(event){
			var message = "Selected item: \"" + event.target.label + "\" in " + event.target.data + ".";
			air.trace(message);
			newEntry = document.createElement('p');
			newEntry.appendChild(document.createTextNode(message));
			eventLog.appendChild(newEntry);
		}
		
		//Displays the pop-up menu
		function popUpMenu(event){
			popUp.display(window.nativeWindow.stage, event.clientX, event.clientY);
		}

		//Displays the context menu
		function showContextMenu(event){
			event.preventDefault();
			window.htmlLoader.contextMenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
		}

		function createRootMenu(menuType){
			var menu = new air.NativeMenu();
			menu.addSubmenu(createFileMenu(menuType),"File");
			menu.addSubmenu(createEditMenu(menuType),"Edit");
			menu.addSubmenu(createHelpMenu(menuType),"Help");
			return menu;
		}
		
		function createFileMenu(menuType){
			var temp;
			var menu = new air.NativeMenu();
			temp = menu.addItem(new air.NativeMenuItem("New"));
				temp.keyEquivalent = 'n';
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Open"));
				temp.keyEquivalent = 'o';
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Save"));
				temp.keyEquivalent = 's';
				temp.data = menuType;
			menu.addItem(new air.NativeMenuItem("",true));//separator
			temp = menu.addItem(new air.NativeMenuItem(quitLabel));
				temp.keyEquivalent = 'q';
				temp.data = menuType;
			
			for (var item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,itemSelected);
			}			
			return menu;
		}
		
		function createEditMenu(menuType){
			var temp;
			var menu = new air.NativeMenu();
			temp = menu.addItem(new air.NativeMenuItem("Undo"));
				temp.keyEquivalent = 'z';
				temp.data = menuType;
			menu.addItem(new air.NativeMenuItem("",true));//separator
			temp = menu.addItem(new air.NativeMenuItem("Cut"));
				temp.keyEquivalent = 'x';
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Copy"));
				temp.keyEquivalent = 'c';
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Paste"));
				temp.keyEquivalent = 'v';
				temp.data = menuType;
			temp = menu.addSubmenu(createPasteSpecialSubMenu(menuType), "Paste special");
				temp.data = menuType;
			for (var item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,itemSelected);
			}			
			return menu;
		}
		
		function createHelpMenu(menuType){
			var temp;
			var menu = new air.NativeMenu();
			temp = menu.addItem(new air.NativeMenuItem("AIR Menus help"));
				temp.keyEquivalent = "h";
				temp.data = menuType;
			menu.addItem(new air.NativeMenuItem("",true));//separator
			temp = menu.addItem(new air.NativeMenuItem("Check for updates"));
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Activate"));
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("Provide feedback"));
				temp.data = menuType;
			menu.addItem(new air.NativeMenuItem("",true));//separator
			temp = menu.addItem(new air.NativeMenuItem("About AIR Menus"));
				temp.keyEquivalent = 'a';
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("View source"));
				temp.keyEquivalent = 'v';
				temp.keyEquivalentModifiers = [];
				temp.addEventListener(air.Event.SELECT, viewSource);
				temp.data = menuType;
			for (var item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,itemSelected);
			}			
			return menu;			
		}
		
		function createPasteSpecialSubMenu(menuType){
			var temp;
			var menu = new air.NativeMenu();
			temp = menu.addItem(new air.NativeMenuItem("As plain text"));
				temp.keyEquivalent = "p";
				temp.keyEquivalentModifiers = [air.Keyboard.SHIFT, standardModifier];
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("As html text"));
				temp.keyEquivalent = "h";
				temp.keyEquivalentModifiers = [air.Keyboard.SHIFT, standardModifier];
				temp.data = menuType;
			temp = menu.addItem(new air.NativeMenuItem("As rich text"));
				temp.keyEquivalent = "r";
				temp.keyEquivalentModifiers = [air.Keyboard.SHIFT, standardModifier];
				temp.data = menuType;

			for (var item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,itemSelected);
			}			
			return menu;			
		}

		function viewSource(){
			SourceViewer.getDefault().viewSource();
		}	
		
		function noMenu(event){
			event.preventDefault();	
		}