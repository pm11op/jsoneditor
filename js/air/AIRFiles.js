function AIRFiles(air) {
    this.currentFile; // The current file in the editor.
    this.stream; // A FileStream object, used to read and write files.
    this.defaultDir; // The default directory location.
    this.chooserMode; // Whether the FileChooser.html window is used as an Open or Save As window.
    this.air = air;
    this.defaultDir = this.air.File.documentsDirectory;


}
			

/**
 * Displays the FileChooser.html file in a new window, and sets its mode to "Open".
 */
AIRFiles.prototype.openFileDB = function(callback) {
//    alert('open');
    var fileChooser, self = this;
    if(this.currentFile) {
	fileChooser = this.currentFile;
    } else {
	fileChooser = this.defaultDir;
    }
    fileChooser.browseForOpen("Open");

    this._open = function(e){self.openFile.call(self, e, callback)};
    fileChooser.addEventListener(this.air.Event.SELECT, this._open);

}
	
/**
 * Opens and reads a file. 
 */
AIRFiles.prototype.openFile = function(event, callback) {
    var stream = new this.air.FileStream();

    try {
	this.currentFile = event.target;

	    
	stream.open(this.currentFile, this.air.FileMode.READ);
	var str = stream.readUTFBytes(stream.bytesAvailable);
	stream.close();
	callback.call('', str);
	    
    } catch(error) {
	this.ioErrorHandler();
    }
    event.target.removeEventListener(this.air.Event.SELECT, this._open); 
}
	
/**
 * Displays the "Save As" dialog box.
 */
AIRFiles.prototype.saveAs = function(callback) {
    var fileChooser;
    if(this.currentFile) {
	fileChooser = this.currentFile;
    } else {
	fileChooser = this.defaultDir;
    }
    fileChooser.browseForSave("Save");
    var self = this;
    this._save = function(e) {self.saveAsSelectHandler.call(self, e, callback)};
    fileChooser.addEventListener(this.air.Event.SELECT, this._save);
}	
AIRFiles.prototype.saveAsSelectHandler = function(event, callback) {
    this.currentFile = event.target;
    var self = this;
    event.target.removeEventListener(this.air.Event.SELECT, this._save);
    this.saveFile(callback);
}
	
/**
 * Opens and saves a file with the data in the mainText textArea element. 
 * Newline (\n) characters in the text are replaced with the 
 * platform-specific line ending character (File.lineEnding), which is the 
 * line-feed character on Mac OS and the carriage return character followed by the 
 * line-feed character on Windows.
 */
AIRFiles.prototype.saveFile = function(callback) {
    if (this.currentFile == null) {
	this.saveAs(callback);
    } else {
	try {
	    var stream = new this.air.FileStream();
	    stream.open(this.currentFile, this.air.FileMode.WRITE);
	    var outData = callback.call();
	    outData = outData.replace(/\n/g, this.air.File.lineEnding);
	    stream.writeUTFBytes(outData);
	    stream.close();
	} 
	catch(error) {
	    this.ioErrorHandler(error);
	}
    }
}		
	
/**
 * Error message for file I/O errors. 
 */
AIRFiles.prototype.ioErrorHandler = function(e) {
//    alert(e);
    alert("Error reading or writing the file.");
}
