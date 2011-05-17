/**
 * @author Toby <air-simple-updater@toby.ca>
 * @version 1.0
 * @param {string} remoteApplicationXmlUrl The URL to a copy of the latest
 * version of your application.xml file.
 * @param {string} remoteApplicationAirUrl The URL to the latest version of
 * your AIR file. The string %version%, if present, will be replaced with
 * the version found in the remote application.xml file.
 */
AirSimpleUpdater = function(remoteApplicationXmlUrl, remoteApplicationAirUrl)
{
	var CHECKING_FOR_UPDATE = "CHECKING_FOR_UPDATE";

	var DOWNLOADING_UPDATE = "DOWNLOADING_UPDATE";

	var originalTitle;

	/**
	 * Action to take if the installed version is the same as the latest
	 * version on the server.
	 */
	this.noUpdateRequired = function()
	{
		//alert("You have the latest version");
	}

	/**
	 * Called before proceeding with the update, giving the user
	 * a chance to opt out.
	 *
	 * @return {boolean} False if the update should be aborted, true
	 * otherwise.
	 */
	this.beforeUpdate = function(localVersion, remoteVersion)
	{
		return confirm("A new version of " + this.getApplicationName() +
		" is available, would you like to update now?\r\n\r\n" +
		"Installed version: " +
		localVersion +
		"\r\n" +
		"Available version: " +
		remoteVersion);
	}

	/**
	 * Compares the version number of the installed application
	 * against the remote version stored on your web server.
	 *
	 * @param {float} localVersion
	 * @param {float} remoteVersion
	 * @return {boolean} True if the remote version is newer
	 */
	this.compareVersions = function(localVersion, remoteVersion)
	{
//		return parseFloat(localVersion) < parseFloat(remoteVersion);
	    return localVersion != remoteVersion;
	}

	/**
	 * What to do while waiting for something to download.  You may
	 * have some custom HTML you want to show, so feel free to override
	 * this function to do what you want.  The status parameter will
	 * be either CHECKING_FOR_UPDATE or DOWNLOADING_UPDATE.
	 */
	this.whileWaiting = function(status)
	{
		originalTitle = document.title;
		switch (status)
		{
			case CHECKING_FOR_UPDATE:
				document.title = "Checking for update, please wait...";
				break;
			case DOWNLOADING_UPDATE:
				document.title = "Downloading update, please wait...";
				break;
		}
	}

	/**
	 * What to do when a download is finished.  If you chose to
	 * override whileWaiting, then you probably want to also override
	 * this function.
	 */
	this.finishedWaiting = function()
	{
		document.title = originalTitle;
	}

	/**
	 * Handle an error.
	 */
	this.handleError = function(error)
	{
		var msg = error.text == undefined ? error.message : error.text;
		alert("Error:\r\n\r\n" + msg);
	}

	/**
	 * Run the auto-updater
	 */
	this.run = function()
	{
		var _self = this;
		this.getRemoteVersion(function(remoteVersion)
		{
			var localVersion = _self.getLocalVersion();
			if (_self.compareVersions(localVersion, remoteVersion))
			{
				if (!_self.beforeUpdate(localVersion, remoteVersion))
					return;

				_self.installRemoteVersion(remoteVersion);
			}
			else
			{
				_self.noUpdateRequired();
			}
		});
	}

	/**
	 * Install the remote version of the application
	 */
	this.installRemoteVersion = function(remoteVersion)
	{
		var url = remoteApplicationAirUrl;
		if (url.indexOf("%version%"))
			url = url.replace("%version%", remoteVersion);
		this.whileWaiting(DOWNLOADING_UPDATE);

		this.getHttpGetStream(url, function(httpStream, _self)
		{
			var bytes = new air.ByteArray();

			try
			{
				httpStream.readBytes(bytes, 0, httpStream.bytesAvailable);

				tempFile = air.File.createTempFile();
				fileStream = new air.FileStream();
			    fileStream.open(tempFile, air.FileMode.WRITE);
			    fileStream.writeBytes(bytes, 0, bytes.length);
			    fileStream.close();

				_self.finishedWaiting();

				var updater = new air.Updater();
				updater.update(tempFile, remoteVersion);
			}
			catch (error)
			{
				_self.finishedWaiting();
				_self.handleError(error);
			}
		}, this.handleError);
	}

	/**
	 * Retrieve the remote version string.
	 *
	 * @param {function} handleFunc the function to handle the response
	 */
	this.getRemoteVersion = function(handleRemoteVersion)
	{
		this.whileWaiting(CHECKING_FOR_UPDATE);
		this.getHttpGetStream(remoteApplicationXmlUrl, function(stream, _self)
		{
			var data = new air.ByteArray();
			try
			{
				stream.readBytes(data, 0, stream.bytesAvailable);
			}
			catch (error)
			{
				_self.handleError(error);
			}
			_self.finishedWaiting();
			handleRemoteVersion(_self.getApplicationVersion(new DOMParser().parseFromString(data.toString(), "text/xml")));
		}, this.handleError);
	}

	/**
	 * Determines the installed application version, taken
	 * from the installed application.xml file.
	 *
	 * @return {string} The installed version
	 */
	this.getLocalVersion = function()
	{
		return this.getApplicationVersion(this.getApplicationXml());
	}

	/**
	 * Determines the installed application name, taken
	 * from the installed application.xml file.
	 *
	 * @return {string} The application name
	 */
	this.getApplicationName = function()
	{
		return this.getApplicationXml().getElementsByTagName("application")[0].getElementsByTagName("name")[0].firstChild.nodeValue;
	}

	/**
	 * Get the DOMParser for the application.xml file.
	 *
	 * @return {DOMParser} A DOMParser object representing
	 * your application.xml file.
	 */
	this.getApplicationXml = function()
	{
		file = air.File.applicationDirectory.resolvePath("META-INF/AIR/application.xml");
		stream = new air.FileStream();

		try
		{
			stream.open(file, air.FileMode.READ);
		}
		catch (exception)
		{
			if (exception.message.indexOf("#3003") >= 0)
			{
				file = air.File.applicationDirectory.resolvePath("application.xml");
				stream = new air.FileStream();
				stream.open(file, air.FileMode.READ);
			}
			else
			{
				throw exception;
			}
		}

		data = stream.readUTFBytes(stream.bytesAvailable);
		stream.close();

		return new DOMParser().parseFromString(data, "text/xml");
	}

	/**
	 * Find the version from an application.xml file
	 *
	 * @param {DOMParser} domParser the application.xml DOMParser
	 */
	this.getApplicationVersion = function(domParser)
	{
		return domParser.getElementsByTagName("application")[0].getElementsByTagName("version")[0].firstChild.nodeValue;
	}

	/**
	 * Get an HTTP stream for a URL
	 */
	this.getHttpGetStream = function(url, successFunc, errorFunc)
	{
		var req = new air.URLRequest(url);
		req.method = air.URLRequestMethod.GET;
		var stream = new air.URLStream();
		_self = this;
		stream.addEventListener(air.Event.COMPLETE, function(event)
		{
			successFunc(stream, _self);
		});
		stream.addEventListener(air.IOErrorEvent.IO_ERROR, function(event)
		{
			errorFunc(event);
		});
		try
		{
			stream.load(req);
		}
		catch (error)
		{
			errorFunc(error);
		}
	}
}
