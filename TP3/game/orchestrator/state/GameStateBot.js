/**
 * GameStateBot
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Board Object} board - current board of the game
 * @param {String} difficulty - difficulty of the game (random/intelligent)
 */
class GameStateBot extends GameState {
    constructor(gameOrchestrator, board, difficulty) {
        super(gameOrchestrator, board);
        this.board = board;

        this.botPlayed = false;
        this.botWaitTime = 2;
        this.elapsedTime = 0;

        this.selectedTiles = null;
        this.previousTileId = null;

        this.difficulty = difficulty;
    }

    /**
     * Does a move, by a Bot
     */
    moveBot() {
        let piece_played = null;
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        if (this.difficulty == "random") {  
            let chooseRandomString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            let p = this.gameOrchestrator.server.promiseRequest(chooseRandomString, null, null);
            p.then((request) => { 
                let piece_played = request;
                let position = this.board.getCoordinatesFromProlog(piece_played[0], piece_played[1], piece_played[2]);
                let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
                let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;
                
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 

                this.gameOrchestrator.gameSequence.addMove(
                    new MyGameMove(
                        this.gameOrchestrator.piecesList, 
                        piece,
                        this.gameOrchestrator.turn, 
                        this.gameOrchestrator.boardSet.auxBoardDisplacement, 
                        this.board.getPieceFinalPosition(firstId, secondId),
                        [firstId, secondId])
                    );
                
                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));

                let moveRandomString = 'moveRandom(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
                return this.gameOrchestrator.server.promiseRequest(moveRandomString, null, null);
            }).then((request) => {
                this.board.boardList = request;
            });

        } else {
            let chooseIntelligentString = 'chooseIntelligent(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
            let p = this.gameOrchestrator.server.promiseRequest(chooseIntelligentString, null, null);
            p.then((request) => {
                piece_played = request;
                let position = this.board.getCoordinatesFromProlog(piece_played[0], piece_played[1], piece_played[2]);
                let firstId = position[0] + position[1] * this.gameOrchestrator.boardSize + 1;
                let secondId = position[2] + position[3] * this.gameOrchestrator.boardSize + 1;
    
                let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.gameOrchestrator.whiteTexture, this.gameOrchestrator.blackTexture); 

                this.gameOrchestrator.gameSequence.addMove(
                    new MyGameMove(
                        this.gameOrchestrator.piecesList, 
                        piece,
                        this.gameOrchestrator.turn, 
                        this.gameOrchestrator.boardSet.auxBoardDisplacement, 
                        this.board.getPieceFinalPosition(firstId, secondId),
                        [firstId, secondId])
                    );

                this.gameOrchestrator.changeState(new GameStateAnime(this.gameOrchestrator, piece, this.gameOrchestrator.boardSet, [firstId, secondId]));

                let moveIntelligentString = 'moveIntelligent(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
                return this.gameOrchestrator.server.promiseRequest(moveIntelligentString, null, null);
            }).then((request) => {
                this.board.boardList = request;
            });  
        }
    }

    /**
     * Update function, called periodically, which makes a move by a Bot for each second
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.elapsedTime += elapsedTime;

        if(!this.botPlayed && this.elapsedTime > this.botWaitTime) {
            this.botPlayed = true;
            this.moveBot();
        }
    }

    /**
     * Display function, called periodically, which calls the display function of the board set and the game info, and the processNode from orchestrator, to build the scene
     */
    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
    }
}