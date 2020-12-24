class MyPieceAnimation {
    constructor(scene, pieceToPlay, startPosition, finalPosition) {
        // scene, piece, inicialFixedPos, finalFixedPos
        // Position not in board, but in scenee!!
        this.scene = scene;
        this.totalTime = 0.5;
        this.currentTime = 0;
        this.startTime = null;
        this.active = true;

        this.pieceToPlay = pieceToPlay;

        this.position = this.putPiece(finalPosition[0], finalPosition[1]); 
    }

    putPiece(prev, actual) {
        let rowP = ((prev - 1) % 7) + 1;
        let columnP = Math.floor((prev - 1) / 7) + 1;

        let rowA = ((actual - 1) % 7) + 1;
        let columnA = Math.floor((actual - 1) / 7) + 1;

        return [rowP, columnP, rowA, columnA];
    }

    update(time) {
        if(this.startTime == null) {
            this.startTime = time;
        } else {
            this.currentTime = (time - this.startTime);
        }
        

        if(this.totalTime*1000 <= this.currentTime) {
            this.active = false;
        }
    }

    apply() {
        this.scene.pushMatrix();
        this.pieceToPlay.updatePosition(this.position[0], this.position[1], this.position[2], this.position[3]);
        this.scene.popMatrix();
    }
}