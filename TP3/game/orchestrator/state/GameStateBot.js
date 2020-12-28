class GameStateBot extends GameState {
    constructor(gameOrchestrator, board) {
        super(gameOrchestrator, board);
        this.board = board;

        this.time = 0;

        this.selectedTiles = null;
        this.previousTileId = null;

        this.whiteTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(this.gameOrchestrator.scene, "scenes/images/black.jpg");

    }

    pedidos() {
        let stringBoard = JSON.stringify(this.board.boardList).replaceAll("\"", "");

        let chooseRandomString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
        this.gameOrchestrator.server.makePrologRequest(chooseRandomString, null, null, false);
        let piece_played = this.gameOrchestrator.server.getResult();
        console.log(piece_played);

        // moveRandom(GameState, L-C-O-Color)

        let moveRandomString = 'moveRandom(' + stringBoard + ',' + piece_played[0] + '-' + piece_played[1] + '-' + piece_played[2] + '-' + this.gameOrchestrator.turn + ')';
        this.gameOrchestrator.server.makePrologRequest(moveRandomString, null, null, false);
        let new_board = this.gameOrchestrator.server.getResult();
        this.board.boardList = new_board;

        //let chooseIntelligentString = 'chooseRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';

        let position = this.board.getCoordinates2(piece_played[0], piece_played[1], piece_played[2]);
        let piece = new MyPiece(this.gameOrchestrator.scene, this.gameOrchestrator.turn, this.whiteTexture, this.blackTexture);
        piece.updatePosition(position[0], position[1], position[2], position[3]);
        this.board.addPiece(piece);


        //let moveIntelligentString = 'moveRandom(' + stringBoard + ',' + this.gameOrchestrator.turn + ')';
        //this.gameOrchestrator.server.makePrologRequest(moveIntelligentString, null, null, false);
    }

    update(elapsedTime) {
        this.time += elapsedTime;
        //console.log(this.time);

        if(this.time >= 10) {
            this.pedidos();
            this.time = 0;
        }
    }

    display() {
        // -- Board -- //
        this.gameOrchestrator.boardSet.display();
        this.gameOrchestrator.gameInfo.display();
        // -- Board -- //

        this.gameOrchestrator.processNode(this.gameOrchestrator.graph.idRoot, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].material, this.gameOrchestrator.graph.nodes[this.gameOrchestrator.graph.idRoot].texture);
    }
}