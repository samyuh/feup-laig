/**
 * GameStateAnimator
 * @constructor
 * @param {Orchestrator Object} gameOrchestrator - the gameOrchestrator controlling the game
 * @param {Sequence Object} gameSequence - sequence of game moves, to build the movie of the game
 */
class GameStateMovie extends GameState {
    constructor(gameOrchestrator, board, gameSequence, prevState) {
        super(gameOrchestrator, board);
        this.gameSequence = gameSequence;
        this.addedPiece = false;
        this.currentTime = 0;
        this.currentSequenceIndex = 0;
        this.currentMove = this.gameSequence.moves[0];
        this.prevState = prevState;

        if(this.gameOrchestrator.turn == "black") {
            this.gameOrchestrator.boardSet.resetPiece();
        }

        if (this.gameOrchestrator.concreteState instanceof GameStateEnd) {
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
     * Update the position and textures of an animations when graph changes
     * @param {Array} auxBoardDisplacement - displacement of the auxiliary board
     * @param {Texture} whiteTexture - white Texture of the piece
     * @param {Texture} blackTexture - black Texture of the piece
     */
    updatePosition(auxBoardDisplacement, whiteTexture, blackTexture) {
        // -- Update Textures -- //
        this.animation.pieceToPlay.whiteTexture = whiteTexture; 
        this.animation.pieceToPlay.blackTexture = blackTexture;

        this.animation.pieceStack.whiteTexture = whiteTexture;
        this.animation.pieceStack.blackTexture = blackTexture;

        this.animation.updateKeyFrames(auxBoardDisplacement, this.board.getPieceFinalPosition(
                                                                    this.currentMove.coordinates[0], 
                                                                    this.currentMove.coordinates[1]
                                                                ));
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