class GameStateBot extends GameState {
    constructor(gameOrchestrator, board, difficulty) {
        super(gameOrchestrator, board);
        this.board = board;

        this.time = 0;

        this.selectedTiles = null;
        this.previousTileId = null;

        this.whiteTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/black.jpg");

        this.difficulty = difficulty;
    }

    checkEndGame() {
        let stringNewBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
        let gameOverString = 'game_over(' + stringNewBoard + ')';
        this.gameOrchestrator.server.makePrologRequest(gameOverString, null, null, false);
        let gameOverData = this.gameOrchestrator.server.getResult();
        if (gameOverData.length != 0) {
            this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.board));
            this.gameOrchestrator.createGameStats(gameOverData);
        }
    }

    moveBot() {
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
        let piece_played = null;

        if (this.difficulty == "random") { 
            let p = new Promise((resolve, reject) => {                
                let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
                let chooseRandomString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
                this.gameOrchestrator.server.makePrologRequest(chooseRandomString, null, null, false);
                
                let piece_played = this.gameOrchestrator.server.getResult();

                let moveRandomString = 'moveRandom(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
                this.gameOrchestrator.server.makePrologRequest(moveRandomString, null, null, false);

                let new_board = this.gameOrchestrator.server.getResult();
                this.board.boardList = new_board;
                
                resolve(piece_played);
            });

            p.then((message) => {
                let piece_played = message;

                let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
                let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
                let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;

                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));
            });
        } else {
            console.log("intelligent");
            let chooseIntelligentString = 'chooseIntelligent(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(chooseIntelligentString, null, null, false);
            piece_played = this.gameOrchestrator.server.getResult();

            let moveIntelligentString = 'moveIntelligent(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
            this.gameOrchestrator.server.makePrologRequest(moveIntelligentString, null, null, false);
            let new_board = this.gameOrchestrator.server.getResult();
            this.board.boardList = new_board;

            let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
            let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
            let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;

            let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
            this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));
        }
    }

    update(elapsedTime) {
        this.time += elapsedTime;

        if(this.time >= 1) {
            this.moveBot();
            this.time = 0;
        }
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //

        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}