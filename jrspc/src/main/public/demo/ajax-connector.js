/** use if not ws_connector.js applyed only! */

var Server = {url: "http://"+ document.location.host +"/jrspc/ajax-request"};

(function() {
	
	function getXMLHttpRequest() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		if(confirm("This browser not support AJAX!\nDownload modern browser?")){
			document.location = "http://www.mozilla.org/ru/firefox/new/";
		}else{
			alert("Download modern browser for work with this application!");
		    throw "This browser not suport Ajax!";
		}
	}
	
	Server.call = function(service, method, params, successCallback, errorCallback, control) {
		var data = {
			service : service,
			method : method,
			params : params ? params : {}
		};
		if (control) {control.disabled = true;}
		var requestData = JSON.stringify(data);
		var request = getXMLHttpRequest();

		request.onreadystatechange = function() {			
			//log("request.status="+request.status+", request.readyState="+request.readyState);
			if ((request.readyState == 4 && request.status != 200)) {
				processError("network error!", errorCallback);
				if (control) {control.disabled = false;}
				return;
			}	
			if (!(request.readyState == 4 && request.status == 200)) {return;}			
			//log("request.responseText="+request.responseText);
			try {
				var response = JSON.parse(request.responseText);
				if (response.error) {
					processError(response.error, errorCallback);
				} else {
					if (successCallback) {
						try {
							//log("response="+JSON.stringify(response));							
							successCallback(response.result);
						} catch (ex) {
							error("in ajax successCallback: " + ex + ", data=" + data);
						}
					}
				}
			} catch (conectionError) {
				error("in process ajax request: " + conectionError);
			}			
			if (control) {control.disabled = false;}
		}
		request.open("POST", Server.url, true);
		request.send(requestData);
	}
	
	function processError(error, errorCallback){
		if (errorCallback) {
			try {
				errorCallback(error);
			} catch (ex) {
				error("in ajax errorCallback: " + ex);
			}
		} else {
			alert(error);
		}
		
	}	
})();

function error(s){if(window.console){console.error(s);}};
function log(s){if(window.console){console.log(s);}};