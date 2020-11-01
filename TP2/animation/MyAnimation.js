
class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        // --- Animation Start and Ending Time --- //
        this.startTime = null;
        this.endTime = null;

        // --- Animation Matrix --- //
        this.animation = mat4.create();

        this.active = true;

        // -- Not used yet bellow
        //this.startTransformations = [];
        //this.endTransformations = [];  
    }

    /*
    update(currentTime) {
        if (!this.active)
            return 0;

        this.currentTime = currentTime;
        
        if (currentTime < this.endTime) {
            let elapsedTime = currentTime - this.startTime;

            let currentXValue = this.startTransformations[0] + (this.endTransformations[0] - this.startTransformations[0]) * (elapsedTime / this.totalTime);
            let currentYValue = this.startTransformations[1] + (this.endTransformations[1] - this.startTransformations[1]) * (elapsedTime / this.totalTime);
            let currentZValue = this.startTransformations[2] + (this.endTransformations[2] - this.startTransformations[2]) * (elapsedTime / this.totalTime);

            this.currentTransformations = [currentXValue, currentYValue, currentZValue];
        }
    }
    */
}