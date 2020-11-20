class MySpriteAnim {
    constructor(scene, spriteSheet, startCell, endCell, duration) {
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.background = new MyRectangle(this.scene, 0, 0, 1, 1);

        this.currentCell = startCell;

        let number_cells = endCell - startCell + 1;
        this.cellDuration = this.duration / number_cells;

        this.elapsedTime = 0;
    }

    update(currentTime) {
        this.elapsedTime += currentTime;

        // Calculate which sprite cell is active
        if (this.elapsedTime >= (this.cellDuration * (this.currentCell + 1))) {
            if (this.currentCell == this.endCell) {     // Reset Animation Loop
                this.currentCell = this.startCell;
                this.elapsedTime = 0;
            }
            else
                this.currentCell++;
        }
    }

    display() {
        this.spriteSheet.activateCellP(this.currentCell);

        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);
        this.background.display();

        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    updateTexCoords(afs, aft) {
        // Do nothing
    }
}