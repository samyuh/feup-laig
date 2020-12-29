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
        request.onerror = onError || function() {console.log("Error waiting for response");};

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

    // -- Prolog Requests ---- //

    updateBoardProlog(gameOrchestrator, board, lastMove) {
        let p = new Promise((resolve, reject) => {
            let move = board.convertId(lastMove[0]);
            let orientation = board.getOrientation(lastMove[0], lastMove[1]);

            let stringBoard = JSON.stringify(board.boardList).replaceAll("\"", "");

            let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + gameOrchestrator.turn + ')';
            this.makePrologRequest(moveString, null, null, false);

            let new_board = this.getResult();

            resolve(new_board);
        });

        p.then((message) => {
            console.log("THIS IS RECEIVED" + message);
            board.boardList = message;
        });
    }
}