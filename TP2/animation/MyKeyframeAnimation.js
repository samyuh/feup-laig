class MyKeyframeAnimation extends MyAnimation {
    constructor(startTime, endTime, startTransformations, endTransformations) {
        super(startTime, endTime, startTransformations, endTransformations);

        this.keyframes = [];

        this.keyframeNumber = 0;
        this.timePercentage = 0;

        this.previousKeyframe;
        this.nextKeyframe;

        this.animation;
    }

    sortMethod(keyframe1, keyframe2) {
        return keyframe1.instant < keyframe2.instant;
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
        
        this.keyframes.sort(sortMethod);
    }

    update(currentTime) {
        if (!this.active)
            return 0;

        if (currentTime < this.endTime) {
            if (this.keyframeNumber == 0)
                this.previousKeyframe = new MyKeyframe(0, [0,0,0],0,0,0,[1.0,1.0,1.0]);  // Keyframe with no changes
            else
                this.previousKeyframe = this.keyframes[this.keyframeNumber - 1];
                
            this.nextKeyframe = this.keyframes[this.keyframeNumber];

            this.timePercentage = (this.elapsedTime - this.previousKeyframe.instant) / (this.nextKeyframe.instant - this.previousKeyframe.instant);
        }
    }

    apply() {
        if (!this.active || this.keyframes.length == 0)
            return;     // Multiply by animation matrix before return?

        if (this.elapsedTime > this.keyframes[this.keyframeNumber].instant) {
            this.keyframeNumber++;  // Switch to next keyframe
        }

        if (this.keyframeNumber == this.keyframes.length) {
            this.keyframeNumber--;
            this.active = false;
        }

        this.update(this.currentTime);

        let matrix = mat4.create();

        // Process Translations
        let translationX = lerp(this.previousKeyframe.translation[0], this.nextKeyframe.translation[0], this.timePercentage);
        let translationY = lerp(this.previousKeyframe.translation[1], this.nextKeyframe.translation[1], this.timePercentage);
        let translationZ = lerp(this.previousKeyframe.translation[2], this.nextKeyframe.translation[2], this.timePercentage);

        mat4.translate(matrix, matrix, [translationX, translationY, translationZ]);

        // Process Rotations
        let rotationX = lerp(this.previousKeyframe.rotationX, this.nextKeyframe.rotationX, this.timePercentage) * DEGREE_TO_RAD;
        let rotationY = lerp(this.previousKeyframe.rotationY, this.nextKeyframe.rotationY, this.timePercentage) * DEGREE_TO_RAD;
        let rotationZ = lerp(this.previousKeyframe.rotationZ, this.nextKeyframe.rotationZ, this.timePercentage) * DEGREE_TO_RAD;

        mat4.rotate(matrix, matrix, rotationX, [1, 0, 0]);
        mat4.rotate(matrix, matrix, rotationY, [0, 1, 0]);
        mat4.rotate(matrix, matrix, rotationZ, [0, 0, 1]);

        // Process Scales
        let scaleX = lerp(this.previousKeyframe.scale[0], this.nextKeyframe.scale[0], this.timePercentage);
        let scaleY = lerp(this.previousKeyframe.scale[1], this.nextKeyframe.scale[1], this.timePercentage);
        let scaleZ = lerp(this.previousKeyframe.scale[2], this.nextKeyframe.scale[2], this.timePercentage);

        mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ]);

        this.animation = matrix;
    }
}