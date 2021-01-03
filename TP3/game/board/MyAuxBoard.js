/**
 * MyAuxBoard
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {CGFtexture} auxBoardTexture - the texture of the auxiliary board
 */
class MyAuxBoard {
	constructor(scene, auxBoardTexture) {
        this.scene = scene;

        // -- Board -- //
        this.auxBoardFront = new MyCube(this.scene);
        this.auxBoardLeft = new MyCube(this.scene);
        this.auxBoardRight = new MyCube(this.scene);
        this.auxBoardBot = new MyCube(this.scene);

        // -- Material -- //
        this.tileMaterial = new CGFappearance(scene);
        this.tileMaterial.setTexture(auxBoardTexture);
    }

    /**
     * Update the texture of board when changing themes
     * @param {Texture} boardTexture - board texture
     */
    updateTexture(auxBoardTexture) {
        this.tileMaterial.setTexture(auxBoardTexture)
    }
    /**
     * Display function, called periodically, which calls the display function of the cubes composing the auxiliary board
     */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -3);
        this.scene.scale(1, 1, 5);
        this.tileMaterial.apply();
        this.auxBoardFront.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 4);
        this.scene.scale(1, 1, 5);
        this.tileMaterial.apply();
        this.auxBoardBot.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0.5);
        this.scene.scale(1, 1, 12);
        this.tileMaterial.apply();
        this.auxBoardRight.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 0.5);
        this.scene.scale(1, 1, 12);
        
        this.tileMaterial.apply();
        this.auxBoardLeft.display();
        this.scene.popMatrix();
    }

    /**
     * Updates the list of texture coordinates - Not used on MyAuxBoard
     * @param {Integer} afs - dx/afs
     * @param {Integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Not asked to do afs and aft. Only needed on Rectangle and Triangle.
    }
}