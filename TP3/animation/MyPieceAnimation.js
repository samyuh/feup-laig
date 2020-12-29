class MyPieceAnimation {
    constructor(scene, pieceToPlay, pieceStack, startPosition, finalPosition) {
        this.scene = scene;
        this.totalTime = 2.5;
        this.currentTime = 0;
        this.startTime = 0;
        this.active = true;

        this.pieceToPlay = pieceToPlay;
        this.pieceStack = pieceStack;
        this.startPosition = startPosition;
        this.finalPosition = finalPosition;

        this.keyFrameAnim = new MyKeyframeAnimation(this.scene);
        let newKeyFrame1 = new MyKeyframe(0, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame1);

        let newKeyFrame2 = new MyKeyframe(1, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame2);

        let newKeyFrame3 = new MyKeyframe(1.3, [this.startPosition[0], this.startPosition[1] + 2, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame3);

        let newKeyFrame4 = new MyKeyframe(2.1, [this.finalPosition[0], this.finalPosition[1] + 2, this.finalPosition[2]], [0, this.finalPosition[3], 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame4);

        let newKeyFrame5 = new MyKeyframe(2.4, [this.finalPosition[0], this.finalPosition[1], this.finalPosition[2]], [0, this.finalPosition[3], 0], [1,1,1]);
        this.keyFrameAnim.addKeyframe(newKeyFrame5);
        this.keyFrameAnim.updateTimeValues();

        // --- TODO : MAKING OTHER PIECE APPEAR -- //

        this.keyFrameAnimStack = new MyKeyframeAnimation(this.scene);
        let newKeyFrame6 = new MyKeyframe(0, [this.startPosition[0], this.startPosition[1] - 1, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame6);

        let newKeyFrame7 = new MyKeyframe(1.5, [this.startPosition[0], this.startPosition[1] - 1, this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame7);

        let newKeyFrame8 = new MyKeyframe(2.2, [this.startPosition[0], this.startPosition[1], this.startPosition[2]], [0, 0, 0], [1,1,1]);
        this.keyFrameAnimStack.addKeyframe(newKeyFrame8);
        this.keyFrameAnimStack.updateTimeValues();
    }

    update(elapsedTime) {
        this.currentTime += elapsedTime;

        if(this.totalTime <= this.currentTime) {
            this.active = false;
        }

        this.keyFrameAnim.update(elapsedTime);
        this.keyFrameAnimStack.update(elapsedTime);
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

        this.scene.pushMatrix();
        let up = this.keyFrameAnimStack.apply();
        if(up != 0) {
            this.pieceStack.display();
        } 
        this.scene.popMatrix();
    }
}