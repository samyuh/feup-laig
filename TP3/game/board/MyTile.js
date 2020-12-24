/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * * @param {CGFscene} gameboard - Reference to MyBoard object
 * * @param {CGFscene} piece - Reference to MyPiece object, which occupies this tile
 */
class MyTile {
	constructor(scene, row, column, tileMaterial,diffMaterial) {
        this.scene = scene;
        this.tile = new MyCube(scene);
        this.row = row;
        this.column = column;
        this.isDiff = false;
        this.tileMaterial = tileMaterial;
        this.diffMaterial = diffMaterial;
    }


    validMove(value) {
        this.isDiff = value; 
    }

    /**
   *    Display the tile
   */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.row, 0, this.column);
        if(this.isDiff) {
            this.diffMaterial.apply();
        }
        else {
            this.tileMaterial.apply();
        }
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