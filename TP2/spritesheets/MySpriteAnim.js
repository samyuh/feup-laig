class MySpriteAnim {
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        super(scene);
        
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.background = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.startTime = 0;     // Initialize startTime to 0,  and when loop ends sum it to the duration (?)
        this.currentCell = startCell;

        let number_cells = endCell - startCell + 1;
        this.cellDuration = this.duration / number_cells;
    }

    update(currentTime) {
        let elapsedTime = currentTime - this.startTime;

        // Calculate which sprite cell is active
        if (elapsedTime >= (this.cellDuration * (this.currentCell + 1))) {
            if (this.currentCell == this.endCell) {     // Reset Animation Loop
                this.currentCell = this.startCell;
                this.startTime += this.duration;
            }
            else
                this.currentCell++;
        }
    }

    display() {
        this.spriteSheet.activateCellP(this.currentCell);

        this.background.display();
    }
}