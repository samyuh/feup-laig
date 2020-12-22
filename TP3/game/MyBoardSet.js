class MyBoardSet {
    constructor(scene, boardList) {
        this.board = new MyBoard(scene, boardList);
        this.auxBoardRight = null;
        this.auxBoardLeft = null;
    }

    display() {
        this.board.display();
        this.auxBoardLeft.display();
        this.auxBoardRight.display();
    }
}