
class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        // --- Animation Start and Ending Time --- //
        this.startTime;
        this.endTime;

        this.totalTime = 0;
        // --- Animation Matrix --- //
        this.animation = mat4.create();
    }

    update(elapsedTime) {
        // Overload
    }
}