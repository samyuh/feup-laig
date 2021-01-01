/**
 * MyTile
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Integer} row - the row of the cell corresponding to this tile
 * @param {Integer} column - the column of the cell corresponding to this tile
 * @param {CGFAppearance} tileMaterial - the material of the tile
 * @param {CGFAppearance} diffMaterial - the material of the tile when it's playable by the user
 */
class MyTile {
	constructor(scene, row, column, tileMaterial, diffMaterial) {
        this.scene = scene;
        this.tile = new MyCube(scene);
        this.row = row;
        this.column = column;
        this.isDiff = false;
        this.tileMaterial = tileMaterial;
        this.diffMaterial = diffMaterial;
    }

    /**
     * If the tile is playable by the user (valid move), then we change its material
     * @param {Integer} value - boolean value that tells if the tile is playable
     */
    validMove(value) {
        this.isDiff = value; 
    }

    /**
     * Display function, called periodically, which calls the display function of the cube that makes the tile
     */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.row, 0, this.column);
        this.scene.scale(1, 0.6, 1);
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
   * @param {Integer} afs - dx/afs
   * @param {Integer} aft - dy/aft
   */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}