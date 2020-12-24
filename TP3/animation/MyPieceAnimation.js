class MyPieceAnimation {
    constructor(scene, piece, board, finalPosition) {
        this.scene = scene;
        this.totalTime = 5;
        this.currentTime = 0;
        this.startTime = null;
        this.active = true;

        this.piece = piece;
        this.board = board;

        let position = this.putPiece(finalPosition[0], finalPosition[1]);   
        this.piece.updatePosition(position[0], position[1], position[2], position[3]);
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
            
            this.board.addPiece(this.piece);
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 5 - this.currentTime/1000, 0);
        this.piece.display();
        this.scene.popMatrix();
    }
}