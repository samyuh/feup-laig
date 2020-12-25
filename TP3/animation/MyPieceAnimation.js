class MyPieceAnimation {
    constructor(scene, pieceToPlay, startPosition, finalPosition) {
        this.scene = scene;
        this.totalTime = 1.75;
        this.currentTime = 0;
        this.startTime = null;
        this.active = true;

        this.pieceToPlay = pieceToPlay;
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;

        this.keyFrameAnim = new MyKeyframeAnimation(this.scene);
        let newKeyFrame1 = new MyKeyframe(0, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame1);

        let newKeyFrame2 = new MyKeyframe(1, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame2);

        let newKeyFrame3 = new MyKeyframe(1.5, [this.finalPosition[0], this.finalPosition[1], this.finalPosition[2]], [0, this.finalPosition[3], 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame3);
        this.keyFrameAnim.updateTimeValues();

        // --- TODO : MAKING OTHER PIECE APPEAR -- //
    }

    update(time, elapsedTime) {
        if(this.startTime == null) {
            this.startTime = time;
        } else {
            this.currentTime = (time - this.startTime);
        }

        if(this.totalTime*1000 <= this.currentTime) {
            this.active = false;
        }
        this.keyFrameAnim.update(elapsedTime);
    }

    apply() {
        if(!this.active) {
            return 0;
        }

        this.scene.pushMatrix();
        let display = this.keyFrameAnim.apply();
        if(display != 0) {
            this.pieceToPlay.display();
            
        } 
        this.scene.popMatrix();
    }
}