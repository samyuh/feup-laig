/**
 * MyServer
 * @constructor
 */
class MyServer {
	constructor() {
        this.port = 8081;
    }

    /**
     * Makes a request to the Prolog server
     * @param {String} requestString - the string of the request to Prolog server
     * @param {Function} onSuccess - alternative onSuccess function
     * @param {Function} onError - alternative onError function
     */
    promiseRequest(requestString, onSuccess, onError) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);

            request.onload = onSuccess || function(data) {
                console.log("Request received. Reply: ", JSON.parse(data.target.response));
                request.result = JSON.parse(data.target.response);
                resolve(request.result);
            };

            request.onerror = onError || function() {
                console.log("Error waiting for response");
                reject("Error waiting for response");
            };

            request.timeout = 2000;
            request.ontimeout = function() {
                console.log("Request timeout! Resending...");
                request.send();
            }

            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
        });
    }
}