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

    reset() {

    }

    start() {

    }

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

        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}