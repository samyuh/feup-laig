/**
 * MyPrologInterface
 * @constructor
 */
class MyPrologInterface {
	constructor() {
        this.data = null;
    }

    testar() {
        let requestString = 'initial(' + 7 +  ')';
        this.getPrologRequest(requestString, this.setValue, null, null);

        return this.data;

    }

    setValue(data) {
        console.log(data.target.response);

        for(let i = 0; i <  data.target.response.length; i++) {
            console.log( data.target.response[i]);
        }
    }

    getPrologRequest(requestString, onSuccess, onError)  {
        var requestPort =  8081;
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess;
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
		
    makeRequest() {
        // Get Parameter Values
        var requestString = document.querySelector("#query_field").value;				
        
        // Make Request
        getPrologRequest(requestString, handleReply);
    }
			
    //Handle the Reply
    handleReply(data){
        document.querySelector("#query_result").innerHTML=data.target.response;
    }  
}