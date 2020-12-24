class MyServer {
	constructor() {
        this.port = 8081;
        this.request = null;
    }

    makePrologRequest(requestString, onSuccess, onError, async = true) {  // Parameter async (true or false)?
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, async);

        request.onload = onSuccess || function(data) {
            console.log("Request received. Reply: ", JSON.parse(data.target.response));
            request.result = JSON.parse(data.target.response);
        };
        request.onerror = onError || function(){console.log("Error waiting for response");};

        if (async)
            request.timeout = 2000;

        request.ontimeout = function() {
            console.log("Request timeout! Resending...");
            request.send();
        }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();

        this.request = request;
    }

    getResult() {
        return this.request.result;
    }
}