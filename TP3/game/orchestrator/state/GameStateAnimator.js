class GameStateAnimator {
    constructor(gameOrchestrator, gameSequence) {
        this.gameOrchestrator = gameOrchestrator;
        this.gameSequence = gameSequence;

        this.frameTime = 3;
        this.currentTime = 0;
        this.startTime = null;

        this.prevSequenceIndex = -1;
        this.currentSequenceIndex = 0;
    }

    reset() {

    }

    start() {

    }

    update(time) {
        if (this.startTime == null) {
            this.startTime = time;
        } else {
            this.currentTime = (time - this.startTime);
        }

        this.currentSequenceIndex = Math.floor((this.currentTime/1000) / this.frameTime);
        console.log(this.currentSequenceIndex);
        console.log(this.prevSequenceIndex);
        if(this.currentSequenceIndex != this.prevSequenceIndex) {
            this.prevSequenceIndex = this.currentSequenceIndex; 
            
            this.gameOrchestrator.board.addPiece(this.gameSequence.moves[this.currentSequenceIndex].piece);
        }
        if(this.currentSequenceIndex > this.gameSequence.moves.length) {
            this.gameOrchestrator.changeState(new GameStateGame(this.gameOrchestrator, this.gameOrchestrator.board));
        }
        
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //
        
        // -- Lava -- //
        this.gameOrchestrator.lavaAnim.apply();
        // -- Lava -- //

        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}