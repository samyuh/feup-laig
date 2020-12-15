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

        this.tileMaterial = new CGFappearance(scene);
        this.emptyTexture = new CGFtexture(scene, "scenes/images/wood.jpg");
        this.tileMaterial.setTexture(this.emptyTexture);

    }

    get_piece() {
        return this.piece;
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
        this.tileMaterial.apply();
        this.scene.translate(this.row, 0, this.column);
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