class GameStateBot extends GameState {
    constructor(gameOrchestrator, board, difficulty) {
        super(gameOrchestrator, board);
        this.board = board;

        this.selectedTiles = null;
        this.previousTileId = null;

        this.difficulty = difficulty;

        this.moveBot();
    }

    moveBot() {
        let piece_played = null;
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        if (this.difficulty == "random") {    
                let chooseRandomString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
                let p = this.gameOrchestrator.server.promiseRequest(chooseRandomString, null, null);
                p.then((request) => { 
                    let piece_played = request;
                    let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
                    let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
                    let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;
        
                    let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
                    this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));

                    let moveRandomString = 'moveRandom(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
                    return this.gameOrchestrator.server.promiseRequest(moveRandomString, null, null);
                }).then((request) => {
                    this.board.boardList = request;
                });

        } else {
            console.log("intelligent");
            let chooseIntelligentString = 'chooseIntelligent(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            let p = this.gameOrchestrator.server.promiseRequest(chooseIntelligentString, null, null);
            p.then((request) => {
                piece_played = request;
                let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
                let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
                let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;
    
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));

                let moveIntelligentString = 'moveIntelligent(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
                return this.gameOrchestrator.server.promiseRequest(moveIntelligentString, null, null);
            }).then((request) => {
                this.board.boardList = request;
            });   
        }
    }

    update(elapsedTime) {
        
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
    }
}