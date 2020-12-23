class MyBoardSet {
    constructor(scene, boardList) {
        this.board = new MyBoard(scene, boardList);
        this.auxBoardRight = new MyAuxBoard(scene, -1);
        this.auxBoardLeft = new MyAuxBoard(scene, 1);
    }

    display() {
        this.board.display();
        this.auxBoardLeft.display();
        this.auxBoardRight.display();
    }
}