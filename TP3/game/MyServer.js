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
     * @param {Function} async - boolean value: true if request is synchronous, false otherwise
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
    
    // -- Prolog Requests ---- //

    // Board Prolog
    updateBoardProlog(gameOrchestrator, board, lastMove) {
            let move = board.convertProlog(lastMove[0]);
            let orientation = board.getOrientation(lastMove[0], lastMove[1]);

            let stringBoard = JSON.stringify(board.boardList).replaceAll("\"", "");

            let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + gameOrchestrator.turn + ')';
            let p = this.promiseRequest(moveString, null, null);

            p.then((request) => {
                board.boardList = request;

                let stringNewBoard = JSON.stringify(board.boardList).replaceAll("\"", "");
                let groupsString = 'groups(' + stringNewBoard + ')';
            
                return this.promiseRequest(groupsString, null, null);
            }).then((request) => {
                console.log(request);
                let groupsData = request;
                groupsData[0] = groupsData[0] || 1;
                groupsData[1] = groupsData[1] || 1;
                gameOrchestrator.gameInfo.updateGroups(groupsData[0], groupsData[1]);
            });
    }

    // -- End Game -- //
    checkEndGame(gameOrchestrator, boardSet, board) {
        let stringNewBoard = JSON.stringify(board.boardList).replaceAll("\"", "");
        let gameOverString = 'game_over(' + stringNewBoard + ')';
        let p = this.promiseRequest(gameOverString, null, null, false);

        p.then((request) => {
            let gameOverData = request;

            if (gameOverData.length != 0) {
                gameOrchestrator.changeState(new GameStateEnd(gameOrchestrator, board));
                gameOrchestrator.createGameStats("end", gameOverData);
            }
            else {
                gameOrchestrator.changeTurn();
            }
        });
    }  
}