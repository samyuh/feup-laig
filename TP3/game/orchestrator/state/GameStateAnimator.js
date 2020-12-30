/**
 * GameStateAnimator
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Sequence Object} gameSequence - sequence of game moves, to build the movie of the game
 */
class GameStateAnimator {
    constructor(gameOrchestrator, gameSequence) {
        this.gameOrchestrator = gameOrchestrator;
        this.gameSequence = gameSequence;

        this.currentTime = 0;
        this.currentSequenceIndex = 0;
        this.currentMove = this.gameSequence.moves[0];

        this.animation = new MyPieceAnimation(
            this.gameOrchestrator.scene, 
            this.gameOrchestrator.boardSet.pieceToPlay, 
            this.currentMove.startPosition, 
            this.currentMove.finalPosition);
    }

    /**
     * Resets the movie
     */
    reset() {

    }

    /**
     * Starts the movie
     */
    start() {

    }

    /**
     * Update function, called periodically, which calls the update function of the piece animation, and changes the current move being presented
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.currentTime += elapsedTime;

        if(!this.animation.active) {
            if (this.currentSequenceIndex == (this.gameSequence.moves.length - 1)) { // last
                this.gameOrchestrator.board.addPiece(this.currentMove.piece);
                this.gameOrchestrator.changeState(new GameStateGame(this.gameOrchestrator, this.gameOrchestrator.board));
            }
            else {
                this.gameOrchestrator.board.addPiece(this.currentMove.piece);

                this.currentSequenceIndex = this.currentSequenceIndex + 1;
                this.currentMove = this.gameSequence.moves[this.currentSequenceIndex];
    
                this.animation = new MyPieceAnimation(
                    this.gameOrchestrator.scene, 
                    this.gameOrchestrator.boardSet.pieceToPlay, 
                    this.currentMove.startPosition, 
                    this.currentMove.finalPosition);
            }
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
        }
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        this.gameOrchestrator.scene.popMatrix();
        // -- Board -- //
    }
}