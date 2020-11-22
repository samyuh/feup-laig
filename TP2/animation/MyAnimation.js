/**
 * MyAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
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

    /** 
    * Update (override by subclasses)
    * @param {integer} elapsedTime - elapsed time since last call
    */
    update(elapsedTime) {
        // Override
    }
}