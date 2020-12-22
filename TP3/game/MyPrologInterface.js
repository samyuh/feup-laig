/**
 * MyPrologInterface
 * @constructor
 */
class MyPrologInterface {
	constructor() {
        this.data = null;

        this.board = null;
    }

    testar() {
        let requestString = 'initial(' + 7 + ')';
        this.getPrologRequest(requestString, this.setInitialBoard, null, null);

        return this.data;
    }

    setInitialBoard(data) {
        let boardList = JSON.parse(data.target.response)
        
        console.log("PIIIIIIIIIII");

        //this.board = new MyBoard(boardList);

        this.scene.pushMatrix();
        for (let i = 0; i < this.boardList.length; i++) {
            this.scene.registerForPick(i + 1, this.boardList[i]);
            this.boardList[i].display();
        }
        this.scene.popMatrix();

        console.log(boardList);
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