/**
 * GameStateAnimator
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Sequence Object} gameSequence - sequence of game moves, to build the movie of the game
 */
class GameStateMovie {
    constructor(gameOrchestrator, gameSequence, prevState) {
        this.gameOrchestrator = gameOrchestrator;
        this.gameSequence = gameSequence;

        this.addedPiece = false;
        this.currentTime = 0;
        this.currentSequenceIndex = 0;
        this.currentMove = this.gameSequence.moves[0];
        this.prevState = prevState;

        if(this.gameOrchestrator.turn == "black") {
            this.gameOrchestrator.boardSet.resetPiece();
        }

        this.animation = new MyPieceAnimation(
            this.gameOrchestrator.scene, 
            this.gameOrchestrator.boardSet,
            this.gameOrchestrator.boardSet.pieceToPlay, 
            this.gameOrchestrator.boardSet.pieceStack,
            this.currentMove.startPosition, 
            this.currentMove.finalPosition);
    }

    /**
     * Update function, called periodically, which calls the update function of the piece animation, and changes the current move being presented
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.currentTime += elapsedTime;

        if(!this.animation.active && this.addedPiece) {
            if (this.currentSequenceIndex == (this.gameSequence.moves.length - 1)) { // last
                if(this.prevState == "turn") {
                    this.gameOrchestrator.returnGame();
                }
                else {
                    this.gameOrchestrator.changeState(new GameStateEnd(this.gameOrchestrator, this.gameOrchestrator.boardSet.board));
                }
            }
            else {
                this.currentSequenceIndex = this.currentSequenceIndex + 1;
                this.currentMove = this.gameSequence.moves[this.currentSequenceIndex];
    
                this.animation = new MyPieceAnimation(
                    this.gameOrchestrator.scene, 
                    this.gameOrchestrator.boardSet,
                    this.gameOrchestrator.boardSet.pieceToPlay, 
                    this.gameOrchestrator.boardSet.pieceStack,
                    this.currentMove.startPosition, 
                    this.currentMove.finalPosition);
            }
            this.addedPiece = false;
        }
        
        this.animation.update(elapsedTime);
    }

    /**
     * Display function, called periodically, which calls the display function of the board set and the game info, and the apply function of the piece animation
     */
    display() {
        // -- Board -- //
        this.gameOrchestrator.scene.pushMatrix();

        if(this.animation.active) {
            this.animation.apply();
        } else if(!this.addedPiece) {
            this.gameOrchestrator.boardSet.board.addPiece(this.currentMove.piece);
            this.addedPiece = true;
        }
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        this.gameOrchestrator.scene.popMatrix();
    }
}