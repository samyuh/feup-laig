class GameStateBot extends GameState {
    constructor(gameOrchestrator, board, difficulty) {
        super(gameOrchestrator, board);
        this.board = board;

        this.time = 0;

        this.selectedTiles = null;
        this.previousTileId = null;

        this.difficulty = difficulty;
        this.piece_played = null;
        this.value = 2;

        this.stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");
    }

    moveRandom() {
        
        let moveRandomString = 'moveRandom(' + this.stringBoard + ',' + this.piece_played[0] + '-' + this.piece_played[1] + '-' + this.piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
        this.gameOrchestrator.server.makePrologRequest(moveRandomString, null, null, true, 3);

        let new_board = this.gameOrchestrator.server.getResult();
    }

    moveBot() {
        let piece_played = null;

        if (this.difficulty == "random") {    
                 console.log("doff")          
                let chooseRandomString = 'chooseRandom(' + this.stringBoard + ',' + this.gameOrchestrator.turn + ')';
                this.gameOrchestrator.server.makePrologRequest(chooseRandomString, null, null, true, 2);

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
        if(this.time >= 2 && this.time < 20) {
            this.moveBot();
            this.time = 40;
        } 

        if((this.gameOrchestrator.server.getResult() != null) && (this.gameOrchestrator.server.type == 2)) {
            this.piece_played = this.gameOrchestrator.server.getResult();
            this.gameOrchestrator.server.type = 3;
            //console.log(this.piece_played);
            this.piece_played= [5, this.value, 'up'];
            this.value += 2;
            //console.log("first");
            this.moveRandom();
        }

        else if((this.gameOrchestrator.server.getResult() != null) && (this.gameOrchestrator.server.type == 3)) {
            console.log("aqui");
            console.log(this.piece_played);
            /*
            let board = this.gameOrchestrator.server.getResult();
            this.board.boardList = board;
            */
            let position = this.board.getCoordinates2(this.piece_played[0], this.piece_played[1], this.piece_played[2]);
            let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
            let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;
            this.gameOrchestrator.server.type = 0;
            let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
            this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));
        }
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
    }
}