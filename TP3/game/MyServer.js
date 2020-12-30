class MyServer {
	constructor() {
        this.port = 8081;
        this.resquestType = {
            'MoveBot' : 1,
            'PlayBot' : 2,
            'AnimationRequest' : 3
        }

        this.request = null;
        this.type = null;
    }

    makePrologRequest(requestString, onSuccess, onError, async = true, type = 1) {  // Parameter async (true or false)?
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, async);

        request.onload = onSuccess || function(data) {
            console.log("Request received. Reply: ", JSON.parse(data.target.response));
            request.result = JSON.parse(data.target.response);
        };

        request.onerror = onError || function() {
            console.log("Error waiting for response");
        };

        if (async)
            request.timeout = 2000;

        request.ontimeout = function() {
            console.log("Request timeout! Resending...");
            request.send();
        }

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();

        
        this.request = request;
        this.type = type;
    }

    getResult() {
        return this.request.result;
    }

    // -- Prolog Requests ---- //

    // Board Prolog
    updateBoardProlog(gameOrchestrator, boardSet, board, lastMove) {
        let p = new Promise((resolve, reject) => {
            let move = board.convertId(lastMove[0]);
            let orientation = board.getOrientation(lastMove[0], lastMove[1]);

            let stringBoard = JSON.stringify(board.boardList).replaceAll("\"", "");

            let moveString = 'movePlayer(' + stringBoard + ',' + move[0] + '-' + move[1] + '-' + orientation + '-' + gameOrchestrator.turn + ')';
            this.makePrologRequest(moveString, null, null, true);

            let new_board = this.getResult();

            resolve(new_board);
        });

        p.then((message) => {
            console.log("THIS IS RECEIVED" + message);
            board.boardList = message;

            this.updateGroups(gameOrchestrator, board);
        });
    }

    updateGroups(gameOrchestrator, board) {
        let p = new Promise((resolve, reject) => {
            let stringNewBoard = JSON.stringify(board.boardList).replaceAll("\"", "");
            let groupsString = 'groups(' + stringNewBoard + ')';
            this.makePrologRequest(groupsString, null, null, false);
            let groupsData = this.getResult();
            groupsData[0] = groupsData[0] || 1;
            groupsData[1] = groupsData[1] || 1;
            gameOrchestrator.gameInfo.updateGroups(groupsData[0], groupsData[1]);
        });

        p.then((message) => {

        });
    }

    // -- End Game -- //
    checkEndGame(gameOrchestrator, boardSet, board) {
        let a = null;
        let p = new Promise((resolve, reject) => {
            let stringNewBoard = JSON.stringify(board.boardList).replaceAll("\"", "");
            let gameOverString = 'game_over(' + stringNewBoard + ')';
            this.makePrologRequest(gameOverString, null, null, false);
            let gameOverData = this.getResult();

            if (gameOverData.length != 0) {
                gameOrchestrator.changeState(new GameStateEnd(gameOrchestrator, board));
                gameOrchestrator.createGameStats("end", gameOverData);
            }
            else {
                gameOrchestrator.changeTurn();
                boardSet.resetPiece(gameOrchestrator.turn);
            }
        });

        p.then((message) => {
            a = message;
        });

        return a;
    }
    /*
    // Random Bot Play
    randomBotPlay() {
        let p = new Promise((resolve, reject) => {
            let chooseRandomString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(chooseRandomString, null, null, false);
            piece_played = this.gameOrchestrator.server.getResult();
        });

        p.then((message) => {
            this.randomBotMove();
        });
    }

    // Random Bot Move
    randomBotMove() {
        let p = new Promise((resolve, reject) => {
            let moveRandomString = 'moveRandom(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(moveRandomString, null, null, false);
            let new_board = this.gameOrchestrator.server.getResult();
            this.board.boardList = new_board;
        });

        p.then((message) => {
            let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
            let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
            let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;

            let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
            this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));
        });
    }

    // Smart Bot Play
    smartBotPlay() {
        let p = new Promise((resolve, reject) => {
            let chooseIntelligentString = 'chooseIntelligent(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(chooseIntelligentString, null, null, false);
            piece_played = this.gameOrchestrator.server.getResult();
        });

        p.then((message) => {
            this.smartBotMove();
        });
    }

    // Smart Bot Move
    smartBotMove() {
        let p = new Promise((resolve, reject) => {
            let moveIntelligentString = 'moveIntelligent(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(moveIntelligentString, null, null, false);
            let new_board = this.gameOrchestrator.server.getResult();
            this.board.boardList = new_board;
        });

        p.then((message) => {

        });
    }
    */
}