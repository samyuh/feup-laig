class MyKeyframeAnimation extends MyAnimation {
    constructor(scene) {
        super(scene);    

        // --- KeyFrame --- //
        this.keyframes = [];
        this.state = 0;

        // --- If animation is active or not --- //
        this.active = false;
    }

    updateTimeValues() {
        this.startTime = this.keyframes[0].instant;
        this.endTime = this.keyframes[this.keyframes.length - 1].instant;
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        
        //this.keyframes.sort(this.sortMethod);
    }

    /*
    sortMethod(keyframe1, keyframe2) {
        return keyframe1.instant < keyframe2.instant;
    }
    */

    update(elapsedTime) {
        this.totalTime += elapsedTime;
        //console.log(this.totalTime, this.startTime, this.endTime);

        this.active = (this.startTime < this.totalTime);
        //console.log(this.active);

        if (!this.active)
            return;

        if (this.totalTime < this.endTime) {
            let lastState = ((this.state + 1) == this.keyframes.length) ? true : false;
            //console.log(this.state + " " + lastState);

            if(!lastState) {
                // --- Switch KeyFrame if needed --- //
                if ((this.totalTime > this.keyframes[this.state + 1].instant))
                    this.state++; 

                //console.log("Next KeyFrame: " + this.keyframes[this.state + 1].instant);

                // --- Previous KeyFrame --- //
                let previousKeyframe = this.keyframes[this.state]; 

                // --- Next KeyFrame --- //
                let nextKeyframe = this.keyframes[this.state + 1];

                // --- Time Percentage --- //
                let timePercentage = (this.totalTime - previousKeyframe.instant) / (nextKeyframe.instant - previousKeyframe.instant);
        
                this.animation = this.transformations(previousKeyframe, nextKeyframe, timePercentage);
            }
            else {
                // Apply last transformation
                this.animation = this.transformations2(this.keyframes[this.state]);
            }
        }
    }

    transformations2(keyframe) {
        let matrix = mat4.create();

        mat4.translate(matrix, matrix, [keyframe.translation[0], keyframe.translation[1], keyframe.translation[2]]);

        let rotationVec3 = [keyframe.rotation[0], keyframe.rotation[1], keyframe.rotation[2]];
        mat4.rotate(matrix, matrix, rotationVec3[0] * (Math.PI / 180), [1, 0, 0]);
        mat4.rotate(matrix, matrix, rotationVec3[1] * (Math.PI / 180), [0, 1, 0]);
        mat4.rotate(matrix, matrix, rotationVec3[2] * (Math.PI / 180), [0, 0, 1]);

        let scaleVec3 = [keyframe.scale[0], keyframe.scale[1], keyframe.scale[2]];
        mat4.scale(matrix, matrix, scaleVec3);

        return matrix;
    }

    transformations(previousKeyframe, nextKeyframe, timePercentage) {
        // --- Calculate Values for each Transformation --- //
        // --- Init transformation matrix --- //
        let matrix = mat4.create();

        // ---- Translation ---- //
        var translationVec3 = [0, 0, 0];

        var PKeyFrame = [previousKeyframe.translation[0], previousKeyframe.translation[1], previousKeyframe.translation[2]];
        var NKeyFrame = [nextKeyframe.translation[0], nextKeyframe.translation[1], nextKeyframe.translation[2]];
        
        vec3.lerp(translationVec3, PKeyFrame, NKeyFrame, timePercentage);

        mat4.translate(matrix, matrix, translationVec3);

        // ---- Rotation ---- //
        let rotationVec3 = [0, 0, 0];

        let previousRotation = [previousKeyframe.rotation[0], previousKeyframe.rotation[1], previousKeyframe.rotation[2]];
        let nextRotation = [nextKeyframe.rotation[0], nextKeyframe.rotation[1], nextKeyframe.rotation[2]];

        vec3.lerp(rotationVec3, previousRotation, nextRotation, timePercentage);
        
        mat4.rotate(matrix, matrix, rotationVec3[0] * (Math.PI / 180), [1, 0, 0]);
        mat4.rotate(matrix, matrix, rotationVec3[1] * (Math.PI / 180), [0, 1, 0]);
        mat4.rotate(matrix, matrix, rotationVec3[2] * (Math.PI / 180), [0, 0, 1]);

        // ---- Scale ---- //
        let scaleVec3 = [0, 0, 0];

        let previousScaleFrame = [previousKeyframe.scale[0], previousKeyframe.scale[1], previousKeyframe.scale[2]];
        let nextScaleFarme = [nextKeyframe.scale[0], nextKeyframe.scale[1], nextKeyframe.scale[2]];
    
        vec3.lerp(scaleVec3, previousScaleFrame, nextScaleFarme, timePercentage);

        mat4.scale(matrix, matrix, scaleVec3);

        return matrix;
    }

    apply() {
        // --- Check if animation is active --- //
        if (!this.active || this.keyframes.length == 0)
            return 0;     // Multiply by animation matrix before return?
        
        // ---- Update Scene ---- //
        this.scene.multMatrix(this.animation);
    }
}