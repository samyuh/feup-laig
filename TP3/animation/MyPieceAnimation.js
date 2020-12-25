class MyPieceAnimation {
    constructor(scene, pieceToPlay, startPosition, finalPosition) {
        this.scene = scene;
        this.totalTime = 0.5;
        this.currentTime = 0;
        this.startTime = null;
        this.active = true;

        this.pieceToPlay = pieceToPlay;
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;

        this.matrix = mat4.create();
    }

    update(time) {
        if(this.startTime == null) {
            this.startTime = time;
        } else {
            this.currentTime = (time - this.startTime);
        }

        if(this.totalTime*1000 <= this.currentTime) {
            this.active = false;
        }
        
        var timePercentage = (this.totalTime*1000 - this.currentTime) / (this.totalTime*1000);

        // --- Translate --- //
        this.matrix = mat4.create();
        var translationVec3 = [0, 0, 0];

        var StartPosition = [this.startPosition[0], this.startPosition[1], this.startPosition[2]];
        var EndPosition = [this.finalPosition[0], this.finalPosition[1], this.finalPosition[2]];
        vec3.lerp(translationVec3, EndPosition, StartPosition, timePercentage);

        mat4.translate(this.matrix, this.matrix, translationVec3);
        // --- Translate --- //

         // ---- Rotation ---- //
         let rotationVec3 = [0, 0, 0];

         let nextRotation = [0, this.finalPosition[3], 0];
         let previousRotation = [0, 0, 0];

         vec3.lerp(rotationVec3, nextRotation, previousRotation, timePercentage);
         
         mat4.rotate(this.matrix, this.matrix, rotationVec3[1] * (Math.PI / 180), [0, 1, 0]);
         // ---- Rotation ---- //
    }

    apply() {
        if(!this.active) {
            return 0;
        }
        
        this.scene.pushMatrix();
        this.scene.multMatrix(this.matrix);
        this.pieceToPlay.display();
        this.scene.popMatrix();
    }
}