/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * * @param {CGFscene} gameboard - Reference to MyBoard object
 * * @param {CGFscene} piece - Reference to MyPiece object, which occupies this tile
 */
class MyTile {
	constructor(scene, row, column, gameboard, piece) {
        this.scene = scene;
        this.tile = new MyCube(scene);
        this.row = row;
        this.column = column;
        this.gameboard = gameboard;
        this.piece = piece;
        this.emptyTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.whiteTexture = new CGFtexture(scene, "scenes/images/white.jpg");
        this.blackTexture = new CGFtexture(scene, "scenes/images/black.jpg");
        this.tileMaterial = new CGFappearance(scene);
        this.tileMaterial.setTexture(this.emptyTexture);
        if (row == 1 && column == 3)
            this.set_piece("white");
        if (row == 1 && column == 4)
            this.set_piece("black");
    }

    get_piece() {
        return this.piece;
    }

    set_piece(piece) {
        this.piece = piece;
        if (piece == "white")
            this.tileMaterial.setTexture(this.whiteTexture);
        if (piece == "black")
            this.tileMaterial.setTexture(this.blackTexture);
    }

    unset_piece() {
        this.piece = "empty";
        this.tileMaterial.setTexture(this.emptyTexture);
    }

    /**
   *    Display the tile
   */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.row, 0, this.column);
        this.tileMaterial.apply();
        this.tile.display();
        this.scene.popMatrix();
    }

    /**
   * Updates the list of texture coordinates - Not used on MyTile
   * @param {integer} afs - dx/afs
   * @param {integer} aft - dy/aft
   */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}