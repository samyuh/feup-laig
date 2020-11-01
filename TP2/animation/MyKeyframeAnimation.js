class MyKeyframeAnimation extends MyAnimation {
    constructor(scene) {
        super(scene);    

        // --- KeyFrame --- //
        this.keyframes = [];
        this.keyframeNumber = 0;
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        
        // this.keyframes.sort(this.sortMethod);
    }

    /*
    sortMethod(keyframe1, keyframe2) {
        return keyframe1.instant < keyframe2.instant;
    }
    */

    update(currentTime) {
        if (!this.active)
            return 0;

        if(this.startTime == null) {
            this.startTime = currentTime;
            this.endTime = this.keyframes[this.keyframes.length - 1].instant;
        }

        let elapsedTime = currentTime - this.startTime;

        if (elapsedTime < this.endTime) {
            // --- Switch KeyFrame if needed --- //
            if ((elapsedTime > this.keyframes[this.keyframeNumber].instant) && (this.keyframeNumber != (this.keyframes.length - 1))) {
                this.keyframeNumber++; 
            }

            // --- Previous KeyFrame --- //
            let previousKeyframe;
        
            if (this.keyframeNumber == 0) 
                previousKeyframe = new MyKeyframe(0, [0,0,0], [0,0,0], [1.0,1.0,1.0]);  // Keyframe with no changes
            else 
                previousKeyframe = this.keyframes[this.keyframeNumber - 1]; 

            // --- Next KeyFrame --- //
            let nextKeyframe = this.keyframes[this.keyframeNumber];

            // --- Time Percentage --- //
            let timePercentage = (elapsedTime - previousKeyframe.instant) / (nextKeyframe.instant - previousKeyframe.instant);
            
            /*
            if (this.keyframeNumber == this.keyframes.length) {
                this.keyframeNumber--;
                this.active = false;
                // dar apply da ultima
            }
            */
    
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
    
            this.animation = matrix;
        }
    }

    apply() {
        // --- Check if animation is active --- //
        if (!this.active || this.keyframes.length == 0)
            return;     // Multiply by animation matrix before return?
        
        // ---- Update Scene ---- //
        this.scene.multMatrix(this.animation);
    }
}