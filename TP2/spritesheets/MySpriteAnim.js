/**
 * MySpriteAnim
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {MySpriteSheet} spriteSheet - Spritesheet to use in this sprite animation
 * @param {integer} startCell - First cell of the sprite animation
 * @param {integer} endCell - Final cell of the sprite animation
 * @param {integer} duration - Reference to number of stacks of cylinder
 */
class MySpriteAnim extends CGFobject {
    constructor(scene, spriteSheet, startCell, endCell, duration) {
        super(scene);
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.background = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.currentCell = startCell;

        let number_cells = endCell - startCell + 1;
        this.cellDuration = this.duration / number_cells;

        this.elapsedTime = 0;
    }

    /**
     * Updates the sprite animation, by changing the current cell being presented, based on the elapsed time since the beggining of the sprite animation
     * @param {integer} currentTime - Time elapsed since the last call to this method
     */
    update(currentTime) {
        // Update elapsed time since the beggining of the sprite animation
        this.elapsedTime += currentTime;

        // Calculate which sprite cell is active - If the elapsedTime is greater than the time needed to present the current cell, it must change the cell presented
        if (this.elapsedTime >= (this.cellDuration * (this.currentCell + 1))) {
            if (this.currentCell == this.endCell) {     // Reset Animation Loop
                this.currentCell = this.startCell;
                this.elapsedTime = 0;
            }
            else
                this.currentCell++;     // Skip to the next cell
        }
    }

    /**
     * Displays the sprite animation, by displaying its background (MyRectangle), and activating the shader of the sprite animation
     */
    display() {
        // Activate the current cell to be presented
        this.spriteSheet.activateCellP(this.currentCell);

        // Make the background of the sprite animation transparent
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        // Display the background of the sprite animation
        this.background.display();

        // Remove transparency properties
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);

        // Activate the shader of the sprite animation
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
     * Updates the list of texture coordinates - Not used on MySpriteAnim
     * @param {integer} afs - dx/afs
     * @param {integer} aft - dy/aft
     */
    updateTexCoords(afs, aft) {
        // Do nothing
    }
}